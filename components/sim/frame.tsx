'use client';
import type { ReactNode } from 'react';
import { MousePointerClick, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

export function SimFrame({
  title,
  desc,
  onReset,
  children,
  className,
}: {
  title: string;
  desc?: string;
  onReset?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn('not-prose my-6 overflow-hidden rounded-2xl border bg-fd-card shadow-sm', className)}>
      <figcaption className="flex flex-wrap items-center gap-2 border-b bg-fd-muted/60 px-4 py-2.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#06b6d4]/15 px-2 py-0.5 text-[11px] font-bold text-[#0e7490] dark:text-[#67e8f9]">
          <MousePointerClick className="size-3" /> 직접 해 보기
        </span>
        <span className="font-semibold">{title}</span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1 text-sm text-fd-muted-foreground hover:text-fd-foreground"
          >
            <RotateCcw className="size-3.5" /> 처음부터
          </button>
        )}
        {desc && <p className="w-full text-sm leading-6 text-fd-muted-foreground">{desc}</p>}
      </figcaption>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ok';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' && 'bg-fd-primary text-fd-primary-foreground hover:opacity-90',
        variant === 'outline' && 'border bg-fd-background hover:bg-fd-accent',
        variant === 'danger' && 'bg-[var(--color-danger)] text-white hover:opacity-90',
        variant === 'ok' && 'bg-[var(--color-ok)] text-white hover:opacity-90',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Claude Code 창을 흉내 낸 어두운 패널 */
export function Terminal({ title = 'Claude Code', children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-[#2a3140] bg-[#0f1419] text-[#d6dde6]', className)}>
      <div className="flex items-center gap-1.5 border-b border-[#2a3140] px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[#8b95a5]">{title}</span>
      </div>
      <div className="space-y-2 p-3 font-mono text-[0.8rem] leading-6">{children}</div>
    </div>
  );
}
