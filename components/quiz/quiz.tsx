'use client';
import { useState } from 'react';
import { ArrowDown, ArrowUp, Award, Check, RotateCcw, X } from 'lucide-react';
import { quizzes, type Question } from '@/content/data/quizzes';
import { useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';

type Result = Record<number, boolean>;

export function Quiz({ session }: { session: number }) {
  const list = quizzes[session] ?? [];
  const [result, setResult] = useStored<Result>(`quiz:${session}`, {});
  const [round, setRound] = useState(0);
  const answered = Object.keys(result).length;
  const correct = Object.values(result).filter(Boolean).length;

  return (
    <div className="not-prose my-6 rounded-2xl border bg-fd-card">
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
        <span className="text-lg font-bold">복습 퀴즈</span>
        <span className="text-sm text-fd-muted-foreground">{list.length}문항 · 점수는 기록되지 않아요</span>
        {answered === list.length && list.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--color-ok)] px-2.5 py-0.5 text-xs font-semibold text-white">
            <Award className="size-3.5" /> 복습 완료 {correct}/{list.length}
          </span>
        )}
        {answered > 0 && (
          <button
            type="button"
            onClick={() => {
              setResult({});
              setRound((r) => r + 1);
            }}
            className={cn(
              'inline-flex items-center gap-1 text-sm text-fd-muted-foreground hover:text-fd-foreground',
              answered !== list.length && 'ml-auto',
            )}
          >
            <RotateCcw className="size-3.5" /> 다시 풀기
          </button>
        )}
      </div>
      <ol className="divide-y">
        {list.map((q, i) => (
          <QuestionItem
            key={`${round}-${i}`}
            n={i + 1}
            q={q}
            saved={result[i]}
            onAnswer={(ok) => setResult((r) => ({ ...r, [i]: ok }))}
          />
        ))}
      </ol>
    </div>
  );
}

function QuestionItem({
  n,
  q,
  saved,
  onAnswer,
}: {
  n: number;
  q: Question;
  saved?: boolean;
  onAnswer: (ok: boolean) => void;
}) {
  const [pick, setPick] = useState<number | boolean | null>(null);
  const [order, setOrder] = useState<number[]>(() =>
    q.type === 'order' ? shuffle(q.items.map((_, i) => i)) : [],
  );
  const [submitted, setSubmitted] = useState(saved !== undefined);
  const ok =
    saved ??
    (q.type === 'single'
      ? pick === q.answer
      : q.type === 'ox'
        ? pick === q.answer
        : order.every((v, i) => v === i));

  const submit = (value?: number | boolean) => {
    const v = value ?? pick;
    let good = false;
    if (q.type === 'single') good = v === q.answer;
    else if (q.type === 'ox') good = v === q.answer;
    else good = order.every((x, i) => x === i);
    setSubmitted(true);
    onAnswer(good);
  };

  return (
    <li className="px-5 py-4">
      <p className="mb-3 font-semibold leading-7">
        <span className="mr-2 text-fd-primary">Q{n}.</span>
        {q.q}
        {q.type === 'order' && <span className="ml-1 text-sm font-normal text-fd-muted-foreground">(순서대로 정렬)</span>}
      </p>

      {q.type === 'single' && (
        <div className="grid gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              disabled={submitted}
              onClick={() => {
                setPick(i);
                submit(i);
              }}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-[0.97rem] transition-colors',
                !submitted && 'hover:border-fd-primary hover:bg-fd-accent/40',
                submitted && i === q.answer && 'border-[var(--color-ok)] bg-[color-mix(in_oklab,var(--color-ok)_10%,transparent)]',
                submitted && pick === i && i !== q.answer && 'border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_8%,transparent)]',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {q.type === 'ox' && (
        <div className="flex gap-2">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              disabled={submitted}
              onClick={() => {
                setPick(val);
                submit(val);
              }}
              className={cn(
                'w-24 rounded-lg border py-2 text-xl font-bold transition-colors',
                !submitted && 'hover:border-fd-primary',
                submitted && val === q.answer && 'border-[var(--color-ok)] text-[var(--color-ok)]',
                submitted && pick === val && val !== q.answer && 'border-[var(--color-danger)] text-[var(--color-danger)]',
              )}
            >
              {val ? 'O' : 'X'}
            </button>
          ))}
        </div>
      )}

      {q.type === 'order' && (
        <div>
          <ul className="grid gap-1.5">
            {(submitted ? q.items.map((_, i) => i) : order).map((idx, pos, arr) => (
              <li key={idx} className="flex items-center gap-2 rounded-lg border bg-fd-background px-3 py-2">
                <span className="w-5 text-sm font-semibold text-fd-muted-foreground">{pos + 1}</span>
                <span className="flex-1">{q.items[idx]}</span>
                {!submitted && (
                  <>
                    <button
                      type="button"
                      aria-label="위로"
                      disabled={pos === 0}
                      onClick={() => setOrder(swap(arr, pos, pos - 1))}
                      className="rounded p-1 hover:bg-fd-accent disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="아래로"
                      disabled={pos === arr.length - 1}
                      onClick={() => setOrder(swap(arr, pos, pos + 1))}
                      className="rounded p-1 hover:bg-fd-accent disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {!submitted && (
            <button
              type="button"
              onClick={() => submit()}
              className="mt-2 rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground"
            >
              정답 확인
            </button>
          )}
        </div>
      )}

      {submitted && (
        <div
          className={cn(
            'mt-3 rounded-lg px-3 py-2 text-[0.95rem] leading-7',
            ok
              ? 'bg-[color-mix(in_oklab,var(--color-ok)_10%,transparent)]'
              : 'bg-[color-mix(in_oklab,var(--color-danger)_8%,transparent)]',
          )}
        >
          <span className={cn('mr-1 inline-flex items-center gap-1 font-bold', ok ? 'text-[var(--color-ok)]' : 'text-[var(--color-danger)]')}>
            {ok ? <Check className="size-4" /> : <X className="size-4" />}
            {ok ? '정답' : '아쉬워요'}
          </span>
          {q.explain}
          {q.ref && (
            <a href={q.ref} className="ml-1 text-sm text-fd-primary underline underline-offset-4">
              다시 보기
            </a>
          )}
        </div>
      )}
    </li>
  );
}

function swap(arr: number[], a: number, b: number) {
  const next = [...arr];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}
function shuffle(a: number[]) {
  // 같은 순서로 시작하지 않도록 고정된 섞기 (렌더링마다 바뀌지 않게)
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.every((v, i) => v === i)) out.reverse();
  return out;
}
