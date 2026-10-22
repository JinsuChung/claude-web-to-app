'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStored } from '@/lib/storage';
import { OSSwitch } from '@/components/ui/os';
import { PresentButton } from '@/components/present/present';
import { ProgressBar, useOverallProgress } from './progress';
import { MeCard } from '@/components/class/class-board';

export function SidebarProgress() {
  const { done, total, sessionsDone } = useOverallProgress();
  const [last] = useStored<{ path: string; title: string } | null>('last', null);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-xl border bg-fd-background p-3 text-sm">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">내 학습 진도</span>
          <span className="text-xs tabular-nums text-fd-muted-foreground">{sessionsDone}/15회 완료</span>
        </div>
        <ProgressBar pct={pct} className="mt-2" />
        {last ? (
          <Link href={last.path} data-sidebar-extra="" className="mt-2.5 flex items-center gap-1 text-xs font-medium text-fd-primary hover:underline">
            <span className="truncate">이어서: {last.title}</span>
            <ArrowRight className="size-3 shrink-0" />
          </Link>
        ) : (
          <p className="mt-2.5 text-xs text-fd-muted-foreground">실습 단계를 완료하면 여기에 쌓여요.</p>
        )}
      </div>
      <MeCard />
      <div className="flex items-center justify-between gap-2">
        <OSSwitch />
        <PresentButton />
      </div>
    </div>
  );
}
