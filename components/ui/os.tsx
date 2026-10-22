'use client';
import { useEffect, type ReactNode } from 'react';
import { readStored, useStored, writeStored } from '@/lib/storage';
import { cn } from '@/lib/cn';

export type OS = 'win' | 'mac';

function detect(): OS {
  if (typeof navigator === 'undefined') return 'win';
  return /Mac|iPhone|iPad/i.test(navigator.userAgent) ? 'mac' : 'win';
}

export function useOS(): [OS, (os: OS) => void] {
  const [os, setOS] = useStored<OS | null>('os', null);
  useEffect(() => {
    if (readStored<OS | null>('os', null) === null) writeStored('os', detect());
  }, []);
  return [os ?? 'win', setOS];
}

/** 상단의 Windows / macOS 전환 토글 */
export function OSSwitch({ className }: { className?: string }) {
  const [os, setOS] = useOS();
  return (
    <div
      role="radiogroup"
      aria-label="운영체제 선택"
      className={cn('inline-flex shrink-0 whitespace-nowrap rounded-full border bg-fd-muted p-0.5 text-xs font-medium', className)}
    >
      {(
        [
          ['win', 'Windows'],
          ['mac', 'macOS'],
        ] as const
      ).map(([v, label]) => (
        <button
          key={v}
          role="radio"
          aria-checked={os === v}
          onClick={() => setOS(v)}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            os === v ? 'bg-fd-background text-fd-foreground shadow-sm' : 'text-fd-muted-foreground hover:text-fd-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** 선택한 OS일 때만 보이는 내용 */
export function OSOnly({ os, children }: { os: OS; children: ReactNode }) {
  const [current] = useOS();
  if (current !== os) return null;
  return <>{children}</>;
}

/** 본문 안에서 OS 탭처럼 보여 주는 블록 */
export function OSBlock({ win, mac }: { win: ReactNode; mac: ReactNode }) {
  const [os] = useOS();
  return (
    <div className="my-5 rounded-xl border bg-fd-card">
      <div className="not-prose flex items-center justify-between gap-2 border-b px-4 py-2">
        <span className="text-xs font-medium text-fd-muted-foreground">
          {os === 'win' ? 'Windows 기준' : 'macOS 기준'}
        </span>
        <OSSwitch />
      </div>
      <div className="px-4 [&>:first-child]:mt-3 [&>:last-child]:mb-3">{os === 'win' ? win : mac}</div>
    </div>
  );
}

const KEY_LABEL: Record<string, { win: string; mac: string }> = {
  mod: { win: 'Ctrl', mac: '⌘' },
  alt: { win: 'Alt', mac: '⌥' },
  shift: { win: 'Shift', mac: '⇧' },
  enter: { win: 'Enter', mac: '↩' },
  esc: { win: 'Esc', mac: 'Esc' },
  tab: { win: 'Tab', mac: 'Tab' },
};

/** 단축키 표시. keys="mod+c" → Ctrl+C / ⌘C */
export function Kbd({ keys }: { keys: string }) {
  const [os] = useOS();
  const parts = keys.split('+').map((k) => KEY_LABEL[k.toLowerCase()]?.[os] ?? k.toUpperCase());
  return (
    <span className="inline-flex items-center gap-0.5 align-baseline">
      {parts.map((p, i) => (
        <kbd
          key={i}
          className="rounded border border-b-2 bg-fd-muted px-1.5 py-0.5 font-sans text-[0.8em] font-medium text-fd-foreground"
        >
          {p}
        </kbd>
      ))}
    </span>
  );
}
