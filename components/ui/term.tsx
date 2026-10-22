'use client';
import { useId, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { getTerm } from '@/content/data/glossary';

/** 본문 용어 툴팁: <Term id="commit">커밋</Term> */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const t = getTerm(id);
  const [open, setOpen] = useState(false);
  const tipId = useId();
  if (!t) return <>{children}</>;
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="term"
        aria-describedby={open ? tipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        {children ?? t.term}
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-40 mb-2 block w-72 -translate-x-1/2 rounded-xl border bg-fd-popover p-3 text-left text-sm leading-6 font-normal text-fd-popover-foreground shadow-xl"
        >
          <span className="block font-semibold">
            {t.term}
            {t.en && <span className="ml-1 font-normal text-fd-muted-foreground">{t.en}</span>}
          </span>
          <span className="mt-1 block">{t.def}</span>
          {t.analogy && <span className="mt-1 block text-fd-muted-foreground">비유: {t.analogy}</span>}
          <Link href={`/glossary#${t.id}`} className="mt-1.5 block text-xs text-fd-primary">
            용어사전에서 보기 →
          </Link>
        </span>
      )}
    </span>
  );
}
