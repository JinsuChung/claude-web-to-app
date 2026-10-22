'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import QRCode from 'qrcode';
import { ChevronLeft, ChevronRight, Presentation, QrCode, Timer, X } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ---------- 발표 모드 상태 (페이지 전체 공유, 저장하지 않음) ---------- */
type State = { on: boolean; slide: number; total: number; overlay: null | 'qr' | 'timer' };
let state: State = { on: false, slide: 0, total: 0, overlay: null };
const subs = new Set<() => void>();
function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  subs.forEach((f) => f());
}
function usePresent() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}

function getContainer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#nd-page .prose');
}

/** 본문을 h2/h3 기준으로 묶어 슬라이드 번호를 매긴다 */
function buildSlides(): number {
  const root = getContainer();
  if (!root) return 0;
  let idx = -1;
  for (const el of Array.from(root.children) as HTMLElement[]) {
    if (el.tagName === 'H2' || el.tagName === 'H3' || idx === -1) idx++;
    el.dataset.slide = String(idx);
  }
  return idx + 1;
}

function clearSlides() {
  document.querySelectorAll<HTMLElement>('[data-slide]').forEach((el) => {
    delete el.dataset.slide;
    delete el.dataset.slideActive;
  });
}

function showSlide(n: number) {
  document.querySelectorAll<HTMLElement>('[data-slide]').forEach((el) => {
    if (el.dataset.slide === String(n)) el.dataset.slideActive = '';
    else delete el.dataset.slideActive;
  });
  window.scrollTo({ top: 0 });
}

function enter() {
  document.documentElement.dataset.present = '';
  const total = buildSlides();
  setState({ on: true, slide: 0, total });
  if (total) showSlide(0);
}
function exit() {
  delete document.documentElement.dataset.present;
  clearSlides();
  setState({ on: false, overlay: null });
}
function go(delta: number) {
  if (!state.total) return;
  const slide = Math.min(state.total - 1, Math.max(0, state.slide + delta));
  setState({ slide });
  showSlide(slide);
}

/* ---------- 헤더 버튼 ---------- */
export function PresentButton() {
  return (
    <button
      type="button"
      onClick={() => (state.on ? exit() : enter())}
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
      title="발표 모드 (P)"
    >
      <Presentation className="size-3.5" />
      발표 모드
    </button>
  );
}

/* ---------- 키보드·오버레이 컨트롤러 (레이아웃에 1개) ---------- */
export function PresentController() {
  const s = usePresent();
  const pathname = usePathname();

  // 페이지 이동 시 슬라이드 다시 구성
  useEffect(() => {
    if (!state.on) return;
    const t = setTimeout(() => {
      clearSlides();
      const total = buildSlides();
      setState({ slide: 0, total });
      if (total) showSlide(0);
    }, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('present')) enter();
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable="true"]') || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'p') {
        e.preventDefault();
        state.on ? exit() : enter();
        return;
      }
      if (!state.on) return;
      if (k === 'arrowright' || k === ' ' || k === 'pagedown') {
        e.preventDefault();
        go(1);
      } else if (k === 'arrowleft' || k === 'pageup') {
        e.preventDefault();
        go(-1);
      } else if (k === 'escape') {
        state.overlay ? setState({ overlay: null }) : exit();
      } else if (k === 'q') setState({ overlay: state.overlay === 'qr' ? null : 'qr' });
      else if (k === 't') setState({ overlay: state.overlay === 'timer' ? null : 'timer' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!s.on) return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 p-3 print-hide">
        <div className="flex items-center gap-1 rounded-full border bg-fd-popover/95 px-2 py-1.5 text-sm shadow-lg backdrop-blur">
          <IconBtn label="이전 (←)" onClick={() => go(-1)}>
            <ChevronLeft className="size-4" />
          </IconBtn>
          <span className="min-w-16 text-center tabular-nums text-fd-muted-foreground">
            {s.total ? `${s.slide + 1} / ${s.total}` : '—'}
          </span>
          <IconBtn label="다음 (→)" onClick={() => go(1)}>
            <ChevronRight className="size-4" />
          </IconBtn>
          <span className="mx-1 h-5 w-px bg-fd-border" />
          <IconBtn label="실습 타이머 (T)" onClick={() => setState({ overlay: s.overlay === 'timer' ? null : 'timer' })}>
            <Timer className="size-4" />
          </IconBtn>
          <IconBtn label="이 페이지 QR (Q)" onClick={() => setState({ overlay: s.overlay === 'qr' ? null : 'qr' })}>
            <QrCode className="size-4" />
          </IconBtn>
          <IconBtn label="발표 모드 끝내기 (Esc)" onClick={exit}>
            <X className="size-4" />
          </IconBtn>
        </div>
      </div>
      {s.total > 0 && (
        <div className="fixed inset-x-0 top-0 z-50 h-1 bg-fd-border">
          <div
            className="h-full bg-fd-primary transition-[width]"
            style={{ width: `${((s.slide + 1) / s.total) * 100}%` }}
          />
        </div>
      )}
      {s.overlay === 'qr' && <QROverlay />}
      {s.overlay === 'timer' && <TimerOverlay />}
    </>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-full p-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
    >
      {children}
    </button>
  );
}

function QROverlay() {
  const [svg, setSvg] = useState('');
  const url = typeof window !== 'undefined' ? window.location.href.replace(/[?&]present(=[^&]*)?/, '') : '';
  useEffect(() => {
    QRCode.toString(url, { type: 'svg', margin: 1, width: 420 }).then(setSvg);
  }, [url]);
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6"
      onClick={() => setState({ overlay: null })}
    >
      <div className="rounded-2xl bg-white p-6 text-center text-black shadow-2xl">
        <div className="mx-auto size-[min(70vw,420px)]" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="mt-3 text-base font-semibold">휴대폰 카메라로 찍으면 이 페이지가 열립니다</p>
        <p className="mt-1 break-all text-sm text-neutral-500">{url}</p>
      </div>
    </div>
  );
}

function TimerOverlay() {
  const [left, setLeft] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback((min: number) => {
    setDone(false);
    setLeft(min * 60);
    if (ref.current) clearInterval(ref.current);
    ref.current = setInterval(() => {
      setLeft((v) => {
        if (v === null) return v;
        if (v <= 1) {
          if (ref.current) clearInterval(ref.current);
          setDone(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }, []);
  useEffect(() => () => void (ref.current && clearInterval(ref.current)), []);

  const mm = left === null ? '' : String(Math.floor(left / 60)).padStart(2, '0');
  const ss = left === null ? '' : String(left % 60).padStart(2, '0');

  return (
    <div className="fixed right-4 top-4 z-[60] w-72 rounded-2xl border bg-fd-popover p-4 shadow-2xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">실습 타이머</span>
        <button aria-label="닫기" onClick={() => setState({ overlay: null })} className="text-fd-muted-foreground">
          <X className="size-4" />
        </button>
      </div>
      {left !== null && (
        <div
          className={cn(
            'my-2 text-center font-mono text-6xl font-bold tabular-nums',
            done ? 'animate-pulse text-[var(--color-danger)]' : left <= 60 ? 'text-[var(--color-warn)]' : '',
          )}
        >
          {mm}:{ss}
        </div>
      )}
      {done && <p className="text-center text-sm font-medium">시간이 끝났어요. 결과를 공유해 볼까요?</p>}
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {[3, 5, 10, 15].map((m) => (
          <button
            key={m}
            onClick={() => start(m)}
            className="rounded-lg border py-1.5 text-sm font-medium hover:bg-fd-accent"
          >
            {m}분
          </button>
        ))}
      </div>
    </div>
  );
}
