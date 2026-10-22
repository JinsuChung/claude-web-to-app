'use client';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { ArrowRight, Clock, Target, Wrench, XCircle, CheckCircle2, NotebookPen, Lightbulb } from 'lucide-react';
import { getSession, getSelfStudy, sessions } from '@/content/data/sessions';
import { prompts, fillPrompt } from '@/content/data/prompts';
import { examples } from '@/content/data/examples';
import { facts, type FactKey } from '@/content/data/facts';
import { useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { CopyButton } from '@/components/prompt/copy-button';
import { ProgressBar, useSessionProgress } from '@/components/progress/progress';
import { ClassStat } from '@/components/class/class-board';

/** 회차 머리말: 한 문장, 학습 목표, 진도 */
export function SessionHeader({ n }: { n: number }) {
  const s = getSession(n);
  const p = useSessionProgress(n);
  return (
    <div className="not-prose mb-8 overflow-hidden rounded-2xl border">
      <div className="relative px-6 py-5 text-white" style={{ background: `linear-gradient(135deg, #14123a, ${s.color})` }}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-semibold text-white">{n}회 · {s.stage}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {s.minutes}분
          </span>
        </div>
        <p className="mt-3 text-[1.35rem] font-bold leading-snug tracking-[-0.035em]">“{s.oneLiner}”</p>
      </div>
      <div className="grid gap-5 bg-fd-card px-6 py-5 md:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-fd-muted-foreground">
            <Target className="size-4" /> 학습 목표
          </p>
          <ul className="space-y-1.5">
            {s.goals.map((g) => (
              <li key={g} className="flex gap-2 text-[0.98rem] leading-7">
                <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-fd-primary" />
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-fd-muted-foreground">
            <Wrench className="size-4" /> 오늘 만드는 것: <span className="font-medium text-fd-foreground">{s.output}</span>
          </p>
        </div>
        <div className="min-w-44 rounded-xl border bg-fd-background p-4 md:self-start">
          <p className="text-sm font-semibold">실습 진도</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{p.total ? `${p.pct}%` : '—'}</p>
          <ProgressBar pct={p.pct} className="mt-2" />
          <p className="mt-2 text-xs text-fd-muted-foreground">
            {p.total ? `${p.done} / ${p.total} 단계` : '실습 단계를 체크하면 표시돼요'}
          </p>
          <ClassStat track={n} />
        </div>
      </div>
    </div>
  );
}

/** 이 회차의 프롬프트 모두 보기 + 한 번에 복사 */
export function SessionPrompts({ n }: { n: number }) {
  const list = prompts.filter((p) => p.sessions.includes(n));
  const all = () =>
    list.map((p, i) => `${i + 1}. ${p.title}\n${fillPrompt(p.text, {}, p.vars)}`).join('\n\n');
  return (
    <div className="not-prose my-5 rounded-xl border">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
        <span className="font-semibold">이 회 프롬프트 {list.length}개</span>
        <CopyButton text={all} label="모두 복사" size="sm" />
      </div>
      <ul className="divide-y">
        {list.map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-4 py-2">
            <Link href={`/prompts/${p.id}`} className="flex-1 text-[0.95rem] hover:text-fd-primary">
              {p.title}
            </Link>
            <CopyButton text={() => fillPrompt(p.text, {}, p.vars)} size="sm" label="복사" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 과제 입력: 브라우저에만 저장되고 복사해서 제출 */
export function Assignment({ id, title, children, placeholder }: { id: string; title: string; children?: ReactNode; placeholder?: string }) {
  const [text, setText] = useStored<string>(`hw:${id}`, '');
  return (
    <div className="not-prose my-5 rounded-xl border-2 border-dashed border-fd-primary/30 bg-fd-secondary/30 p-4">
      <p className="flex items-center gap-1.5 font-semibold">
        <NotebookPen className="size-4 text-fd-primary" /> 과제 · {title}
      </p>
      {children && <div className="mt-1 text-[0.95rem] leading-7 text-fd-muted-foreground">{children}</div>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={placeholder}
        className="mt-3 w-full rounded-lg border bg-fd-background px-3 py-2 text-[0.95rem] leading-7 outline-none focus:ring-2 focus:ring-fd-ring"
      />
      <div className="mt-2 flex items-center gap-2">
        <CopyButton text={() => text} label="내용 복사" size="sm" />
        <span className="text-xs text-fd-muted-foreground">이 브라우저에만 저장돼요. 제출은 복사해서 붙여 넣으세요.</span>
      </div>
    </div>
  );
}

/** 나쁜 예 vs 좋은 예 */
export function Compare({ bad, good, badNote, goodNote }: { bad: string; good: string; badNote?: string; goodNote?: string }) {
  return (
    <div className="not-prose my-5 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-[color-mix(in_oklab,var(--color-danger)_35%,transparent)] p-4">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[var(--color-danger)]">
          <XCircle className="size-4" /> 아쉬운 요청
        </p>
        <p className="whitespace-pre-wrap font-medium leading-7">{bad}</p>
        {badNote && <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{badNote}</p>}
      </div>
      <div className="rounded-xl border border-[color-mix(in_oklab,var(--color-ok)_40%,transparent)] p-4">
        <p className="mb-2 flex items-center justify-between gap-1.5 text-sm font-bold text-[var(--color-ok)]">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4" /> 좋은 요청
          </span>
          <CopyButton text={good} size="sm" />
        </p>
        <p className="whitespace-pre-wrap font-medium leading-7">{good}</p>
        {goodNote && <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{goodNote}</p>}
      </div>
    </div>
  );
}

/** 바뀔 수 있는 사실 + 확인일 */
export function Fact({ k }: { k: FactKey }) {
  const f = facts[k];
  return (
    <span>
      {f.value}{' '}
      <a href={f.source} target="_blank" rel="noreferrer" className="text-xs text-fd-muted-foreground no-underline hover:underline">
        ({f.checked} 확인)
      </a>
    </span>
  );
}

/** 관련 아이디어 카드 */
export function RelatedExamples({ n, limit = 3 }: { n: number; limit?: number }) {
  const list = examples.filter((e) => e.sessions.includes(n)).slice(0, limit);
  return (
    <div className="not-prose my-5 grid gap-3 sm:grid-cols-3">
      {list.map((e) => (
        <Link key={e.id} href={`/examples/${e.id}`} className="rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary">
          <span className="text-xs font-medium text-fd-muted-foreground">{e.area} · {e.kind}</span>
          <p className="mt-1 font-semibold leading-6">{e.title}</p>
        </Link>
      ))}
    </div>
  );
}

/** 다음 회차 안내 */
export function NextSession({ n }: { n: number }) {
  // 회차(정수) 다음에는 n.5 혼자 해 보기를 먼저 안내한다
  const self = Number.isInteger(n) ? getSelfStudy(n + 0.5) : undefined;
  if (self) {
    return (
      <Link href={self.slug} className="not-prose my-6 flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-fd-primary/40 bg-fd-secondary/40 p-5 hover:border-fd-primary">
        <span>
          <span className="text-sm text-fd-muted-foreground">다음 수업 전까지 · 혼자 해 보기 (약 {self.minutes}분)</span>
          <span className="block text-lg font-bold">{self.title}</span>
          <span className="mt-1 block text-sm text-fd-muted-foreground">{self.focus}</span>
        </span>
        <ArrowRight className="size-5 shrink-0" />
      </Link>
    );
  }
  const next = sessions.find((s) => s.n === Math.floor(n) + 1);
  if (!next) {
    return (
      <Link href="/examples" className="not-prose my-6 flex items-center justify-between rounded-2xl border bg-fd-card p-5 hover:border-fd-primary">
        <span>
          <span className="text-sm text-fd-muted-foreground">과정을 마쳤어요</span>
          <span className="block text-lg font-bold">아이디어 갤러리에서 다음 서비스 골라 보기</span>
        </span>
        <ArrowRight className="size-5" />
      </Link>
    );
  }
  return (
    <Link href={next.slug} className="not-prose my-6 flex items-center justify-between rounded-2xl border bg-fd-card p-5 hover:border-fd-primary">
      <span>
        <span className="text-sm text-fd-muted-foreground">다음 수업 · {next.n}회</span>
        <span className="block text-lg font-bold">{next.title}</span>
      </span>
      <ArrowRight className="size-5" />
    </Link>
  );
}

/** 핵심 요약 상자 */
export function KeyPoints({ items }: { items: string[] }) {
  return (
    <div className="not-prose my-5 rounded-xl bg-[#14123a] p-5 text-white dark:bg-[#1e1b4b]">
      <p className="mb-2 text-sm font-semibold text-white/70">핵심 정리</p>
      <ol className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2.5 leading-7">
            <span className="font-bold text-[#67e8f9]">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 비유 카드 */
export function Analogy({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={cn('not-prose my-5 flex gap-3 rounded-xl border-l-4 border-[#06b6d4] bg-fd-card px-4 py-3')}>
      <Lightbulb className="mt-1 size-5 shrink-0 text-[#06b6d4]" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-0.5 text-[0.97rem] leading-7 text-fd-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

/** n.5 혼자 해 보기 머리말: 이번 주 계획과 진도 */
export function SelfStudyHeader({ n }: { n: number }) {
  const s = getSelfStudy(n)!;
  const p = useSessionProgress(n);
  const [doneDays, setDoneDays] = useStored<string[]>(`days:${n}`, []);
  return (
    <div className="not-prose mb-8 overflow-hidden rounded-2xl border">
      <div className="bg-[linear-gradient(135deg,#1e1b4b,#06b6d4)] px-6 py-5 text-white">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/85">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-semibold text-white">혼자 해 보기 · {n}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> 일주일 동안 약 {s.minutes}분
          </span>
        </div>
        <p className="mt-3 text-[1.25rem] font-bold leading-snug tracking-[-0.035em]">{s.focus}</p>
        <p className="mt-2 text-sm text-white/75">
          수업이 일주일에 한 번이라 감각을 잃지 않도록, 하루 15~25분씩 나눠서 해 보세요. 한 번에 다 해도 괜찮아요.
        </p>
      </div>
      <div className="grid gap-5 bg-fd-card px-6 py-5 md:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-fd-muted-foreground">
            <Target className="size-4" /> 이번 주 계획 (끝낸 날은 체크)
          </p>
          <ul className="divide-y rounded-xl border bg-fd-background">
            {s.plan.map((d) => {
              const on = doneDays.includes(d.day);
              return (
                <li key={d.day} className="flex items-center gap-3 px-3 py-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`${d.day} 완료`}
                    onClick={() => setDoneDays((x) => (x.includes(d.day) ? x.filter((v) => v !== d.day) : [...x, d.day]))}
                    className="shrink-0 text-fd-muted-foreground"
                  >
                    <CheckCircle2 className={cn('size-5', on ? 'text-[var(--color-ok)]' : 'opacity-40')} />
                  </button>
                  <span className="w-12 shrink-0 text-sm font-semibold">{d.day}</span>
                  <a href={d.href} className={cn('flex-1 text-[0.95rem] hover:text-fd-primary', on && 'text-fd-muted-foreground line-through')}>
                    {d.what}
                  </a>
                  <span className="shrink-0 text-xs tabular-nums text-fd-muted-foreground">{d.minutes}분</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="min-w-44 rounded-xl border bg-fd-background p-4 md:self-start">
          <p className="text-sm font-semibold">미션 진도</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{p.total ? `${p.pct}%` : '—'}</p>
          <ProgressBar pct={p.pct} className="mt-2" />
          <p className="mt-2 text-xs text-fd-muted-foreground">
            {p.total ? `${p.done} / ${p.total} 단계` : '미션 단계를 체크하면 표시돼요'}
          </p>
          <ClassStat track={n} />
        </div>
      </div>
    </div>
  );
}

/** 상세 설명 상자: 수업에서 다 못 한 이야기 */
export function DeepDive({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group not-prose my-5 rounded-xl border bg-fd-card open:shadow-sm" open>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold">
        <span className="rounded-md bg-fd-primary/10 px-1.5 py-0.5 text-xs font-bold text-fd-primary">자세히</span>
        {title}
        <span className="ml-auto text-sm text-fd-muted-foreground group-open:hidden">펼치기</span>
      </summary>
      <div className="prose max-w-none border-t px-4 pb-4 pt-1">{children}</div>
    </details>
  );
}
