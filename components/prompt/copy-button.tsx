'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({
  text,
  label = '복사',
  className,
  size = 'md',
  onCopied,
}: {
  text: string | (() => string);
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
  onCopied?: () => void;
}) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          const ok = await copyText(typeof text === 'function' ? text() : text);
          setState(ok ? 'ok' : 'fail');
          if (ok) onCopied?.();
          setTimeout(() => setState('idle'), 2000);
        }}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-lg font-medium transition-colors',
          size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
          state === 'ok'
            ? 'bg-[var(--color-ok)] text-white'
            : 'bg-fd-primary text-fd-primary-foreground hover:opacity-90',
          className,
        )}
      >
        {state === 'ok' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {state === 'ok' ? '복사됨' : state === 'fail' ? '직접 선택해 복사하세요' : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'ok' ? '클립보드에 복사했습니다' : ''}
      </span>
    </>
  );
}
