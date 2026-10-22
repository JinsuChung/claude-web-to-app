'use client';
import { readStored, useAnyStoredChange, useHydrated } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { allTracks, sessions } from '@/content/data/sessions';

export function getSessionProgress(n: number) {
  const done = readStored<string[]>(`lab:${n}`, []).length;
  const total = readStored<number>(`labtotal:${n}`, 0);
  const quiz = Object.keys(readStored<Record<number, boolean>>(`quiz:${n}`, {})).length > 0;
  return { done, total, pct: total ? Math.min(100, Math.round((done / total) * 100)) : 0, quiz };
}

const EMPTY = { done: 0, total: 0, pct: 0, quiz: false };

export function useSessionProgress(n: number) {
  useAnyStoredChange();
  const hydrated = useHydrated();
  return hydrated ? getSessionProgress(n) : EMPTY;
}

export function useOverallProgress(count = sessions.length) {
  useAnyStoredChange();
  const hydrated = useHydrated();
  if (!hydrated) return { done: 0, total: 0, sessionsDone: 0 };
  let done = 0;
  let total = 0;
  for (const t of allTracks) {
    const p = getSessionProgress(t);
    done += p.done;
    total += p.total;
  }
  const sessionsDone = Array.from({ length: count }, (_, i) => getSessionProgress(i + 1)).filter(
    (p) => p.total > 0 && p.done >= p.total,
  ).length;
  return { done, total, sessionsDone };
}

export function ProgressRing({
  pct,
  size = 36,
  stroke = 4,
  color = 'var(--color-fd-primary)',
  label,
  className,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label ?? `진도 ${pct}%`}
      className={cn('-rotate-90', className)}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-fd-border)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={pct >= 100 ? 'var(--color-ok)' : color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        strokeLinecap="round"
        className="transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}

export function ProgressBar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-fd-muted', className)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', pct >= 100 ? 'bg-[var(--color-ok)]' : 'bg-fd-primary')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
