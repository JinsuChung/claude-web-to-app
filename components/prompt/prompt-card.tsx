'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ClipboardEdit, ExternalLink, Lightbulb, PauseCircle, Star } from 'lucide-react';
import { categories, fillPrompt, getPrompt, levels, type Prompt, type PromptVar } from '@/content/data/prompts';
import { useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { CopyButton } from './copy-button';

type Props = {
  id?: string;
  /** 데이터에 없는 프롬프트를 직접 쓸 때 */
  text?: string;
  title?: string;
  vars?: PromptVar[];
  plan?: boolean;
  /** 해설 펼침 표시 */
  showWhy?: boolean;
  compact?: boolean;
  className?: string;
};

/** 프롬프트 본문을 렌더링: {{key}} 자리는 강조된 빈칸 */
function PromptText({ text, values, vars }: { text: string; values: Record<string, string>; vars: PromptVar[] }) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\{\{(\w+)\}\}$/);
        if (!m) return <span key={i}>{part}</span>;
        const key = m[1];
        const filled = values[key]?.trim();
        const def = vars.find((x) => x.key === key);
        return (
          <mark
            key={i}
            title={def?.label}
            className={cn(
              'rounded px-1 py-0.5 font-semibold',
              filled
                ? 'bg-fd-primary/12 text-fd-primary'
                : 'bg-[color-mix(in_oklab,var(--color-warn)_16%,transparent)] text-[var(--color-warn)]',
            )}
          >
            {filled || def?.placeholder || key}
          </mark>
        );
      })}
    </>
  );
}

export function PromptCard({ id, text: rawText, title: rawTitle, vars: rawVars, plan: rawPlan, showWhy, compact, className }: Props) {
  const data: Prompt | undefined = id ? getPrompt(id) : undefined;
  const text = data?.text ?? rawText ?? '';
  const title = rawTitle ?? data?.title;
  const vars = data?.vars ?? rawVars ?? [];
  const plan = data?.plan ?? rawPlan;

  const [values, setValues] = useStored<Record<string, string>>(`vars:${id ?? title ?? text.slice(0, 20)}`, {});
  const [open, setOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(!!showWhy);
  const [fav, setFav] = useStored<string[]>('fav', []);

  const filled = useMemo(() => fillPrompt(text, values, vars), [text, values, vars]);
  const emptyCount = vars.filter((x) => !values[x.key]?.trim()).length;

  if (!text) return <div className="text-[var(--color-danger)]">프롬프트를 찾을 수 없음: {id}</div>;

  return (
    <div className={cn('prompt-card not-prose my-5 overflow-hidden rounded-xl border bg-fd-card shadow-sm', className)}>
      <div className="flex flex-wrap items-center gap-2 border-b bg-fd-muted/60 px-4 py-2">
        <span className="text-xs font-bold tracking-wide text-fd-primary">PROMPT</span>
        {title && <span className="text-sm font-semibold">{title}</span>}
        {plan && (
          <span className="inline-flex items-center gap-1 rounded-full bg-fd-secondary px-2 py-0.5 text-[11px] font-medium text-fd-secondary-foreground">
            <PauseCircle className="size-3" /> 플랜 모드 권장
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          {id && (
            <button
              type="button"
              aria-label={fav.includes(id) ? '즐겨찾기 해제' : '즐겨찾기'}
              onClick={() => setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))}
              className="rounded p-1 text-fd-muted-foreground hover:text-[var(--color-warn)]"
            >
              <Star className={cn('size-4', fav.includes(id) && 'fill-[var(--color-warn)] text-[var(--color-warn)]')} />
            </button>
          )}
        </span>
      </div>

      <div className="px-4 py-3.5">
        <p className="whitespace-pre-wrap text-[1.02rem] font-medium leading-7 tracking-[-0.015em]">
          <PromptText text={text} values={values} vars={vars} />
        </p>
      </div>

      {open && vars.length > 0 && (
        <div className="grid gap-3 border-t bg-fd-background px-4 py-3 sm:grid-cols-2">
          {vars.map((x) => (
            <label key={x.key} className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-fd-muted-foreground">{x.label}</span>
              {x.placeholder.length > 40 ? (
                <textarea
                  rows={2}
                  value={values[x.key] ?? ''}
                  placeholder={x.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [x.key]: e.target.value }))}
                  className="rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring"
                />
              ) : (
                <input
                  value={values[x.key] ?? ''}
                  placeholder={x.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [x.key]: e.target.value }))}
                  className="rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring"
                />
              )}
            </label>
          ))}
          <p className="text-xs text-fd-muted-foreground sm:col-span-2">
            비워 두면 주황색 예시 값이 그대로 복사됩니다. 입력한 값은 이 브라우저에 저장돼요.
            {Object.keys(values).length > 0 && (
              <button type="button" onClick={() => setValues({})} className="ml-2 underline">
                지우기
              </button>
            )}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t px-4 py-2.5">
        <CopyButton text={() => filled} />
        {vars.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-fd-accent"
          >
            <ClipboardEdit className="size-3.5" />
            빈칸 채우기 {emptyCount > 0 && <span className="text-fd-muted-foreground">({vars.length - emptyCount}/{vars.length})</span>}
          </button>
        )}
        {data?.why && !compact && (
          <button
            type="button"
            onClick={() => setWhyOpen((o) => !o)}
            aria-expanded={whyOpen}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground"
          >
            <Lightbulb className="size-3.5" />왜 이렇게 쓰나요?
            <ChevronDown className={cn('size-3.5 transition-transform', whyOpen && 'rotate-180')} />
          </button>
        )}
        {data && !compact && (
          <Link
            href={`/prompts/${data.id}`}
            className="ml-auto inline-flex items-center gap-1 text-xs text-fd-muted-foreground hover:text-fd-primary"
          >
            {categories[data.category].label} · {levels[data.level]}
            <ExternalLink className="size-3" />
          </Link>
        )}
      </div>

      {whyOpen && data?.why && (
        <div className="border-t bg-fd-secondary/50 px-4 py-3 text-[0.95rem] leading-7">
          <p>{data.why}</p>
          {data.bad && (
            <p className="mt-2 text-sm">
              <span className="font-semibold text-[var(--color-danger)]">이렇게만 쓰면 아쉬워요 · </span>
              <span className="text-fd-muted-foreground line-through decoration-1">{data.bad}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
