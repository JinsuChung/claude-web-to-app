'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Circle, LifeBuoy, MonitorCheck } from 'lucide-react';
import { readStored, useStored, writeStored } from '@/lib/storage';
import { cn } from '@/lib/cn';

const LabCtx = createContext<{ session: number } | null>(null);
const registry = new Map<number, Set<string>>();

function register(session: number, id: string) {
  let set = registry.get(session);
  if (!set) registry.set(session, (set = new Set()));
  set.add(id);
  if (readStored<number>(`labtotal:${session}`, 0) < set.size) writeStored(`labtotal:${session}`, set.size);
}

const LEVEL_STYLE: Record<string, string> = {
  필수: 'bg-fd-primary text-fd-primary-foreground',
  선택: 'bg-fd-secondary text-fd-secondary-foreground',
  심화: 'bg-[color-mix(in_oklab,var(--color-warn)_20%,transparent)] text-[var(--color-warn)]',
};

/** 실습 묶음. 안에 <Step>을 넣는다 */
export function Lab({
  session,
  title,
  level = '필수',
  minutes,
  goal,
  children,
}: {
  session: number;
  title: string;
  level?: '필수' | '선택' | '심화';
  minutes?: number;
  goal?: string;
  children: ReactNode;
}) {
  return (
    <LabCtx.Provider value={{ session }}>
      <section className="not-prose my-8 rounded-2xl border-2 border-fd-primary/15 bg-fd-background">
        <header className="flex flex-wrap items-center gap-2 rounded-t-2xl border-b bg-fd-secondary/40 px-5 py-3">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', LEVEL_STYLE[level])}>{level}</span>
          <h4 className="text-lg font-bold tracking-[-0.03em]">{title}</h4>
          {minutes && <span className="ml-auto text-sm text-fd-muted-foreground">약 {minutes}분</span>}
          {goal && <p className="w-full text-[0.95rem] text-fd-muted-foreground">{goal}</p>}
        </header>
        <ol className="flex flex-col">{children}</ol>
      </section>
    </LabCtx.Provider>
  );
}

/** 실습 한 단계 */
export function Step({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const ctx = useContext(LabCtx);
  const session = ctx?.session ?? 0;
  const [done, setDone] = useStored<string[]>(`lab:${session}`, []);
  const isDone = done.includes(id);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    register(session, id);
  }, [session, id]);
  useEffect(() => {
    if (isDone) setOpen(false);
  }, [isDone]);

  return (
    <li id={`step-${id}`} className="lab-step border-b last:border-b-0">
      <div className="flex items-start gap-3 px-5 py-3.5">
        <button
          type="button"
          aria-label={isDone ? '완료 취소' : '완료로 표시'}
          onClick={() => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))}
          className="mt-0.5 shrink-0 text-fd-muted-foreground hover:text-[var(--color-ok)]"
        >
          {isDone ? <CheckCircle2 className="size-6 text-[var(--color-ok)]" /> : <Circle className="size-6" />}
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className={cn('text-[1.02rem] font-semibold', isDone && 'text-fd-muted-foreground line-through')}>
            {title}
          </span>
          <ChevronDown className={cn('ml-auto size-4 shrink-0 text-fd-muted-foreground transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && (
        <div className="prose max-w-none px-5 pb-5 pl-14 [&_.prompt-card]:my-3">
          {children}
          {!isDone && (
            <button
              type="button"
              onClick={() => setDone((d) => [...d, id])}
              className="not-prose mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:border-[var(--color-ok)] hover:text-[var(--color-ok)]"
            >
              <CheckCircle2 className="size-4" /> 이 단계 완료
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** "이렇게 되면 성공" — Claude Code 화면을 흉내 낸 상자 */
export function Expected({ title = '이렇게 되면 성공', children }: { title?: string; children: ReactNode }) {
  return (
    <div className="not-prose my-3 overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--color-ok)_35%,transparent)]">
      <div className="flex items-center gap-1.5 bg-[color-mix(in_oklab,var(--color-ok)_10%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ok)]">
        <MonitorCheck className="size-3.5" /> {title}
      </div>
      <div className="overflow-x-auto bg-[#0f1419] px-4 py-3 font-mono text-[0.82rem] leading-6 whitespace-pre text-[#d6dde6]">
        {typeof children === 'string'
          ? children
              .replace(/^\n+|\s+$/g, '')
              .split('\n')
              .map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    /^\s*●/.test(line) && 'text-[#8fb8ff]',
                    /^\s*✓/.test(line) && 'text-[#7ee2a8]',
                    /^\s*>/.test(line) && 'text-[#f5c26b]',
                    /^\s*(⚠|✗|Error)/.test(line) && 'text-[#ff8a80]',
                  )}
                >
                  {line || ' '}
                </div>
              ))
          : children}
      </div>
    </div>
  );
}

/** 막혔을 때 — 증상별 펼침 */
export function Trouble({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-3 rounded-xl border border-dashed">
      <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-fd-muted-foreground">
        <LifeBuoy className="size-4" /> 막혔을 때
      </div>
      <div className="divide-y border-t">{children}</div>
    </div>
  );
}

export function Issue({ q, children }: { q: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-fd-accent/50"
      >
        <AlertTriangle className="size-3.5 shrink-0 text-[var(--color-warn)]" />
        <span className="font-medium">{q}</span>
        <ChevronDown className={cn('ml-auto size-4 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="prose prose-sm max-w-none px-3 pb-3 pl-8 text-[0.93rem]">{children}</div>}
    </div>
  );
}
