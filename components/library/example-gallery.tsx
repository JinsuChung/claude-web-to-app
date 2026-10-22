'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { areas, examples, kinds, type Area, type Kind } from '@/content/data/examples';
import { cn } from '@/lib/cn';

const KIND_COLOR: Record<Kind, string> = {
  웹페이지: '#4f46e5',
  웹앱: '#0891b2',
  'DB 앱': '#059669',
  'AI 기능': '#d97706',
  '모바일 앱': '#db2777',
};

export function ExampleGallery() {
  const [area, setArea] = useState<Area | 'all'>('all');
  const [kind, setKind] = useState<Kind | 'all'>('all');
  const list = useMemo(
    () => examples.filter((e) => (area === 'all' || e.area === area) && (kind === 'all' || e.kind === kind)),
    [area, kind],
  );
  const chip = (active: boolean) =>
    cn(
      'rounded-full border px-3 py-1 text-sm transition-colors',
      active ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
    );

  return (
    <div className="not-prose">
      <p className="mb-1.5 text-sm font-semibold text-fd-muted-foreground">분야</p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={chip(area === 'all')} onClick={() => setArea('all')}>
          전체
        </button>
        {areas.map((a) => (
          <button key={a} type="button" className={chip(area === a)} onClick={() => setArea(a)}>
            {a}
          </button>
        ))}
      </div>
      <p className="mb-1.5 mt-3 text-sm font-semibold text-fd-muted-foreground">만드는 것</p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={chip(kind === 'all')} onClick={() => setKind('all')}>
          전체
        </button>
        {kinds.map((k) => (
          <button key={k} type="button" className={chip(kind === k)} onClick={() => setKind(k)}>
            {k}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-fd-muted-foreground">{list.length}개</p>
      <ul className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((e) => (
          <li key={e.id}>
            <Link
              href={`/examples/${e.id}`}
              className="flex h-full flex-col rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary"
            >
              <span className="flex items-center gap-1.5 text-xs">
                <span className="rounded-full px-2 py-0.5 font-semibold text-white" style={{ background: KIND_COLOR[e.kind] }}>
                  {e.kind}
                </span>
                <span className="text-fd-muted-foreground">{e.area}</span>
              </span>
              <span className="mt-2 font-semibold leading-6">{e.title}</span>
              <span className="mt-1 line-clamp-2 flex-1 text-sm leading-6 text-fd-muted-foreground">{e.situation}</span>
              <span className="mt-3 flex items-center gap-2 text-xs text-fd-muted-foreground">
                <Clock className="size-3" /> 약 {e.minutes}분 · {e.level} · {e.sessions.map((s) => `${s}회`).join(', ')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
