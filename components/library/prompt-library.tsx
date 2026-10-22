'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PauseCircle, Search, Star } from 'lucide-react';
import { categories, fillPrompt, levels, prompts, type Category, type Level } from '@/content/data/prompts';
import { useHydrated, useStored } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { sessions } from '@/content/data/sessions';
import { CopyButton } from '@/components/prompt/copy-button';

export function PromptLibrary() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all' | 'fav'>('all');
  const [session, setSession] = useState<number | 0>(0);
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [fav] = useStored<string[]>('fav', []);
  const hydrated = useHydrated();

  const list = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return prompts.filter((p) => {
      if (cat === 'fav' && !fav.includes(p.id)) return false;
      if (cat !== 'all' && cat !== 'fav' && p.category !== cat) return false;
      if (session && !p.sessions.includes(session)) return false;
      if (level !== 'all' && p.level !== level) return false;
      if (words.length) {
        const hay = `${p.title} ${p.text} ${p.why ?? ''}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      }
      return true;
    });
  }, [q, cat, session, level, fav]);

  const chip = (active: boolean) =>
    cn(
      'rounded-full border px-3 py-1 text-sm transition-colors',
      active ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
    );

  return (
    <div className="not-prose">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="찾을 말을 입력하세요 (예: 엑셀 검산, 커밋, 회의록)"
          className="w-full rounded-xl border bg-fd-background py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-fd-ring"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className={chip(cat === 'all')} onClick={() => setCat('all')}>
          전체 {prompts.length}
        </button>
        <button type="button" className={chip(cat === 'fav')} onClick={() => setCat('fav')}>
          <Star className="mr-1 inline size-3.5 -translate-y-px" />
          즐겨찾기 {hydrated ? fav.length : 0}
        </button>
        {(Object.keys(categories) as Category[]).map((c) => (
          <button key={c} type="button" className={chip(cat === c)} onClick={() => setCat(c)} title={categories[c].desc}>
            {categories[c].label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
        <label className="inline-flex items-center gap-1.5">
          회차
          <select
            value={session}
            onChange={(e) => setSession(Number(e.target.value))}
            className="rounded-lg border bg-fd-background px-2 py-1"
          >
            <option value={0}>전체</option>
            {sessions.map(({ n }) => (
              <option key={n} value={n}>
                {n}회
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-1.5">
          난이도
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level | 'all')}
            className="rounded-lg border bg-fd-background px-2 py-1"
          >
            <option value="all">전체</option>
            {(Object.keys(levels) as Level[]).map((l) => (
              <option key={l} value={l}>
                {levels[l]}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-auto text-fd-muted-foreground">{list.length}개</span>
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {list.map((p) => (
          <li key={p.id} className="flex flex-col rounded-xl border bg-fd-card p-4">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-fd-muted-foreground">
              <span className="rounded-full bg-fd-muted px-2 py-0.5">{categories[p.category].label}</span>
              <span>{levels[p.level]}</span>
              <span>· {p.sessions.map((s) => `${s}회`).join(', ')}</span>
              {p.plan && (
                <span className="inline-flex items-center gap-0.5 text-fd-primary">
                  <PauseCircle className="size-3" /> 플랜
                </span>
              )}
              {hydrated && fav.includes(p.id) && <Star className="ml-auto size-3.5 fill-[var(--color-warn)] text-[var(--color-warn)]" />}
            </div>
            <Link href={`/prompts/${p.id}`} className="mt-1.5 font-semibold hover:text-fd-primary">
              {p.title}
            </Link>
            <p className="mt-1 line-clamp-2 flex-1 text-sm leading-6 text-fd-muted-foreground">{fillPrompt(p.text, {}, p.vars)}</p>
            <div className="mt-3 flex items-center gap-2">
              <CopyButton text={() => fillPrompt(p.text, {}, p.vars)} size="sm" />
              <Link href={`/prompts/${p.id}`} className="text-sm text-fd-muted-foreground hover:text-fd-primary">
                {p.vars?.length ? `빈칸 ${p.vars.length}개 채우기 →` : '자세히 →'}
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="mt-8 text-center text-fd-muted-foreground">
          {cat === 'fav' ? '아직 즐겨찾기한 프롬프트가 없어요. 프롬프트 상자의 ☆를 눌러 보세요.' : '조건에 맞는 프롬프트가 없어요.'}
        </p>
      )}
    </div>
  );
}
