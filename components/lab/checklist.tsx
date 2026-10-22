'use client';
import Link from 'next/link';
import { CheckSquare, Square } from 'lucide-react';
import { checklists } from '@/content/data/checklists';
import { useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';

export function Checklist({ list, compact }: { list: string; compact?: boolean }) {
  const data = checklists[list];
  const [checked, setChecked] = useStored<string[]>(`check:${list}`, []);
  if (!data) return null;
  const done = data.items.filter((i) => checked.includes(i.id)).length;
  const all = done === data.items.length;

  return (
    <div className="not-prose my-5 rounded-xl border bg-fd-card">
      <div className="flex items-center gap-3 border-b px-4 py-2.5">
        <span className="font-semibold">{data.title}</span>
        <span
          className={cn(
            'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
            all ? 'bg-[var(--color-ok)] text-white' : 'bg-fd-muted text-fd-muted-foreground',
          )}
        >
          {all ? '준비 완료' : `${done} / ${data.items.length}`}
        </span>
      </div>
      <ul className="divide-y">
        {data.items.map((item) => {
          const on = checked.includes(item.id);
          return (
            <li key={item.id} className="flex items-start gap-3 px-4 py-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                aria-label={item.label}
                onClick={() => setChecked((c) => (c.includes(item.id) ? c.filter((x) => x !== item.id) : [...c, item.id]))}
                className="mt-0.5 shrink-0 text-fd-muted-foreground"
              >
                {on ? <CheckSquare className="size-5 text-[var(--color-ok)]" /> : <Square className="size-5" />}
              </button>
              <div className="flex-1">
                <span className={cn('text-[0.97rem]', on && 'text-fd-muted-foreground line-through')}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      className="underline decoration-fd-border underline-offset-4 hover:decoration-fd-primary"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </span>
                {item.hint && !compact && <p className="mt-0.5 text-sm text-fd-muted-foreground">{item.hint}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
