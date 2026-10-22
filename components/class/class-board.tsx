'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, CircleDot, Settings2, Sparkles, Users } from 'lucide-react';
import { useHydrated, useStored } from '@/lib/storage';
import { openJoin, timeAgo, trackLabel, useClassSummary, useMe } from '@/lib/class-client';
import { getSessionProgress } from '@/components/progress/progress';
import { cn } from '@/lib/cn';

/* 검사 도구로 확인한 두 단계 색 (완료·진행 중), 밝은/어두운 화면 각각 */
const DONE = 'bg-[#1f5fd1] dark:bg-[#4f8ff0]';
const DOING = 'bg-[#6fa0f0] dark:bg-[#2a5bbd]';

/** 사이드바: 참여 상태 */
export function MeCard() {
  const [me] = useMe();
  const [sync] = useStored<{ at: string; ok: boolean } | null>('sync', null);
  const hydrated = useHydrated();
  if (!hydrated) return null;
  if (!me) {
    return (
      <button
        type="button"
        onClick={openJoin}
        className="flex w-full items-center gap-2 rounded-xl border border-dashed border-fd-primary/50 px-3 py-2 text-left text-xs font-semibold text-fd-primary hover:bg-fd-primary/5"
      >
        <Users className="size-4 shrink-0" />
        <span className="flex-1">별명으로 우리 반 현황에 참여하기</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openJoin}
      className="flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs hover:bg-fd-accent"
      title="내 참여 정보"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fd-primary text-[11px] font-bold text-fd-primary-foreground">
        {me.nick.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{me.nick}</span>
        <span className={cn('block text-[11px]', sync && !sync.ok ? 'text-[var(--color-danger)]' : 'text-fd-muted-foreground')}>
          {sync ? (sync.ok ? `동기화됨 · ${timeAgo(sync.at)}` : '동기화 실패 · 다시 시도 중') : '동기화 준비 중'}
        </span>
      </span>
      <Settings2 className="size-3.5 shrink-0 text-fd-muted-foreground" />
    </button>
  );
}

/** 회차 머리말 안의 작은 반 현황 */
export function ClassStat({ track }: { track: number }) {
  const { summary } = useClassSummary();
  const [me] = useMe();
  if (!summary || summary.participants === 0) {
    return (
      <button type="button" onClick={openJoin} className="mt-2 text-left text-xs text-fd-primary hover:underline">
        {me ? '우리 반 현황 불러오는 중…' : '우리 반 현황에 참여하기 →'}
      </button>
    );
  }
  const t = summary.tracks.find((x) => x.track === String(track));
  return (
    <Link href="/#우리-반-진행-현황" className="mt-2 block text-xs text-fd-muted-foreground hover:text-fd-primary">
      <Users className="mr-1 inline size-3 -translate-y-px" />
      우리 반 {summary.participants}명 중 <b className="text-fd-foreground">{t?.completed ?? 0}명 완료</b>
      {t?.inProgress ? ` · ${t.inProgress}명 진행 중` : ''}
    </Link>
  );
}

/** 홈: 우리 반 진행 현황 */
export function ClassBoard() {
  const { summary, error } = useClassSummary();
  const [me] = useMe();
  const hydrated = useHydrated();
  const [hover, setHover] = useState<string | null>(null);

  // 주소 끝이 #우리-반-진행-현황이면, 현황이 그려진 뒤 다시 그 위치로 맞춘다
  useEffect(() => {
    if (summary && decodeURIComponent(location.hash) === '#우리-반-진행-현황') {
      document.getElementById('우리-반-진행-현황')?.scrollIntoView();
    }
  }, [summary]);

  const n = summary?.participants ?? 0;
  const mine = (track: string) => {
    if (!hydrated) return 'none';
    const p = getSessionProgress(Number(track));
    if (p.total && p.done >= p.total) return 'done';
    if (p.done > 0) return 'doing';
    return 'none';
  };

  return (
    <section id="우리-반-진행-현황" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pt-14 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">우리 반 진행 현황</h2>
          <p className="mt-1 text-fd-muted-foreground">별명으로 참여하면 실습 체크가 여기에 모여요. 함께 가면 끝까지 갑니다.</p>
        </div>
        {hydrated &&
          (me ? (
            <button type="button" onClick={openJoin} className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-fd-accent">
              {me.nick}님으로 참여 중
            </button>
          ) : (
            <button
              type="button"
              onClick={openJoin}
              className="inline-flex items-center gap-2 rounded-xl bg-fd-primary px-4 py-2.5 text-sm font-semibold text-fd-primary-foreground hover:opacity-90"
            >
              <Users className="size-4" /> 별명으로 참여하기
            </button>
          ))}
      </div>

      {error && !summary && <p className="rounded-xl border px-4 py-6 text-center text-fd-muted-foreground">현황을 잠시 불러오지 못했어요. 조금 뒤 다시 보여 드릴게요.</p>}

      {summary && n === 0 && (
        <div className="rounded-2xl border border-dashed px-6 py-10 text-center">
          <Sparkles className="mx-auto size-8 text-fd-primary" />
          <p className="mt-3 text-lg font-bold">아직 참여한 사람이 없어요</p>
          <p className="mt-1 text-fd-muted-foreground">첫 번째 참여자가 되어 보세요. 별명과 숫자 4자리면 끝이에요.</p>
          {!me && (
            <button type="button" onClick={openJoin} className="mt-4 rounded-xl bg-fd-primary px-5 py-2.5 font-semibold text-fd-primary-foreground">
              참여하기
            </button>
          )}
        </div>
      )}

      {summary && n > 0 && (
        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-2xl border bg-fd-card p-5">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="참여" value={`${n}`} unit="명" />
              <Stat label="이번 주 활동" value={`${summary.activeWeek}`} unit="명" sub={summary.activeNow ? `지금 ${summary.activeNow}명 학습 중` : undefined} live={summary.activeNow > 0} />
              <Stat label="평균 진도" value={`${summary.avgPct}`} unit="%" sub="전체 과정 기준" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">과정별 완료한 사람</p>
              <div className="flex items-center gap-3 text-xs text-fd-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className={cn('size-2.5 rounded-sm', DONE)} /> 완료
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className={cn('size-2.5 rounded-sm', DOING)} /> 진행 중
                </span>
                {me && (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-[var(--color-ok)]" /> 나
                  </span>
                )}
              </div>
            </div>

            <ul className="mt-3 space-y-1.5" aria-label="과정별 완료 인원">
              {summary.tracks.map((t) => {
                const self = t.track.includes('.');
                const doneW = (t.completed / n) * 100;
                const doingW = (t.inProgress / n) * 100;
                const m = mine(t.track);
                return (
                  <li
                    key={t.track}
                    className="relative grid grid-cols-[3rem_1fr_4.5rem] items-center gap-2"
                    onMouseEnter={() => setHover(t.track)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <span className={cn('flex items-center gap-1 text-xs', self ? 'pl-2 text-fd-muted-foreground' : 'font-semibold')}>
                      {me && m === 'done' && <CheckCircle2 className="size-3 shrink-0 text-[var(--color-ok)]" />}
                      {me && m === 'doing' && <CircleDot className="size-3 shrink-0 text-fd-muted-foreground" />}
                      {trackLabel(t.track)}
                    </span>
                    <span className={cn('flex overflow-hidden rounded-[4px] bg-fd-muted', self ? 'h-2' : 'h-3')}>
                      <span className={cn('h-full', DONE)} style={{ width: `${doneW}%` }} />
                      {t.inProgress > 0 && <span className={cn('h-full border-l-2 border-fd-card', DOING)} style={{ width: `${doingW}%` }} />}
                    </span>
                    <span className="text-right text-xs tabular-nums">
                      <b>{t.completed}</b>
                      <span className="text-fd-muted-foreground">/{n}명</span>
                    </span>
                    {hover === t.track && (
                      <span className="pointer-events-none absolute -top-9 left-20 z-10 whitespace-nowrap rounded-lg border bg-fd-popover px-2.5 py-1 text-xs shadow-lg">
                        {trackLabel(t.track)} · 완료 {t.completed}명 · 진행 중 {t.inProgress}명 · 아직 {n - t.completed - t.inProgress}명
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border bg-fd-card p-5">
              <p className="text-sm font-semibold">최근 소식</p>
              {summary.feed.length ? (
                <ul className="mt-2 space-y-2 text-sm">
                  {summary.feed.map((f, i) => (
                    <li key={i} className="flex gap-2 leading-6">
                      <Sparkles className="mt-1 size-3.5 shrink-0 text-[#06b6d4]" />
                      <span className="flex-1">
                        <b>{f.name}</b>님이 {f.track}회 실습을 완료했어요
                      </span>
                      <span className="shrink-0 text-xs text-fd-muted-foreground">{timeAgo(f.at)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-fd-muted-foreground">과정을 처음 완료한 사람이 여기 소개돼요.</p>
              )}
            </div>
            <div className="rounded-2xl border bg-fd-card p-5">
              <p className="text-sm font-semibold">함께하는 사람들</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {summary.people
                  .filter((p) => p.name)
                  .slice(0, 40)
                  .map((p) => {
                    const live = Date.now() - Date.parse(p.lastActive) < 15 * 60_000;
                    const isMe = me && p.name === me.nick;
                    return (
                      <li
                        key={p.name}
                        title={`${p.name} · 전체 진도 ${p.pct}% · 완료한 과정 ${p.completed}개 · ${timeAgo(p.lastActive)}`}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs',
                          isMe && 'border-fd-primary bg-fd-primary/10 font-semibold',
                        )}
                      >
                        {live && <span className="size-1.5 rounded-full bg-[var(--color-ok)]" aria-label="학습 중" />}
                        {p.name}
                        <span className="tabular-nums text-fd-muted-foreground">{p.pct}%</span>
                      </li>
                    );
                  })}
                {summary.people.some((p) => !p.name) && (
                  <li className="inline-flex items-center rounded-full border border-dashed px-2.5 py-1 text-xs text-fd-muted-foreground">
                    익명 {summary.people.filter((p) => !p.name).length}명
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, unit, sub, live }: { label: string; value: string; unit: string; sub?: string; live?: boolean }) {
  return (
    <div className="rounded-xl bg-fd-background px-3 py-3 sm:px-4">
      <p className="text-xs text-fd-muted-foreground">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-[-0.03em] sm:text-3xl">
        {value}
        <span className="ml-0.5 text-base font-semibold text-fd-muted-foreground">{unit}</span>
      </p>
      {sub && (
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-fd-muted-foreground">
          {live && <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-ok)]" />}
          {sub}
        </p>
      )}
    </div>
  );
}
