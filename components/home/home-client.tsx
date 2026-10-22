'use client';
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { sessions } from '@/content/data/sessions';
import { useStored } from '@/lib/storage';
import { ProgressRing, useSessionProgress } from '@/components/progress/progress';

export function ContinueButton() {
  const [last] = useStored<{ path: string; title: string } | null>('last', null);
  if (!last) return null;
  return (
    <Link
      href={last.path}
      className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
    >
      <PlayCircle className="size-5" />
      <span className="max-w-[16rem] truncate">이어서: {last.title}</span>
    </Link>
  );
}

function SessionNode({ n }: { n: number }) {
  const s = sessions[n - 1];
  const p = useSessionProgress(n);
  return (
    <Link
      href={s.slug}
      className="group relative flex flex-col rounded-2xl border bg-fd-card p-4 transition-all hover:-translate-y-0.5 hover:border-fd-primary hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex size-9 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ background: s.color }}
        >
          {n}
        </span>
        <span className="relative">
          <ProgressRing pct={p.pct} size={34} stroke={3.5} color={s.color} label={`${n}회 진도 ${p.pct}%`} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums">
            {p.total ? `${p.pct}` : ''}
          </span>
        </span>
      </div>
      <span className="mt-3 text-xs font-semibold tracking-wide" style={{ color: s.color }}>
        {s.stage}
      </span>
      <span className="mt-0.5 font-bold leading-6 tracking-[-0.03em]">{s.short}</span>
      <span className="mt-1 line-clamp-2 flex-1 text-sm leading-6 text-fd-muted-foreground">{s.title}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-fd-primary opacity-0 transition-opacity group-hover:opacity-100">
        시작하기 <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

export function CourseMap() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sessions.map((s) => (
          <SessionNode key={s.n} n={s.n} />
        ))}
      </div>
    </>
  );
}
