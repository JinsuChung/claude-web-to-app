'use client';
import { useState } from 'react';
import { Globe, KeyRound, Server } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SimFrame } from './frame';

type Zone = 'browser' | 'server';
const KEYS = [
  { id: 'anon', label: 'Supabase 공개 키 (anon/publishable)', ok: ['browser', 'server'] as Zone[], why: '공개 키는 화면에 들어가도 됩니다. 단, RLS가 켜져 있어야 안전해요.' },
  { id: 'service', label: 'Supabase 비밀 키 (service_role)', ok: ['server'] as Zone[], why: '비밀 키는 RLS를 무시하는 만능 열쇠입니다. 서버에만 두세요.' },
  { id: 'claude', label: 'Claude API 키', ok: ['server'] as Zone[], why: '브라우저에 두면 누구나 내 키로 과금시킬 수 있습니다. 서버에서만 호출하세요.' },
  { id: 'dbpw', label: '데이터베이스 비밀번호', ok: ['server'] as Zone[], why: 'DB 비밀번호는 서버 환경변수에만, 가능하면 아예 앱에 넣지 않습니다.' },
];

export function KeyPlacement() {
  const [picked, setPicked] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, Zone>>({});

  const drop = (zone: Zone) => {
    if (!picked) return;
    setPlaced((p) => ({ ...p, [picked]: zone }));
    setPicked(null);
  };

  const zoneBox = (zone: Zone, title: string, sub: string, Icon: typeof Globe) => (
    <button
      type="button"
      onClick={() => drop(zone)}
      className={cn(
        'flex min-h-40 flex-col rounded-xl border-2 border-dashed p-3 text-left transition-colors',
        picked ? 'border-fd-primary bg-fd-primary/5 hover:bg-fd-primary/10' : 'border-fd-border',
      )}
    >
      <span className="flex items-center gap-1.5 font-semibold">
        <Icon className="size-4" /> {title}
      </span>
      <span className="text-xs text-fd-muted-foreground">{sub}</span>
      <span className="mt-2 flex flex-col gap-1.5">
        {KEYS.filter((k) => placed[k.id] === zone).map((k) => {
          const good = k.ok.includes(zone);
          return (
            <span
              key={k.id}
              className={cn(
                'rounded-lg px-2 py-1 text-xs font-medium',
                good ? 'bg-[color-mix(in_oklab,var(--color-ok)_14%,transparent)] text-[var(--color-ok)]' : 'bg-[color-mix(in_oklab,var(--color-danger)_14%,transparent)] text-[var(--color-danger)]',
              )}
            >
              {good ? '✓' : '✗'} {k.label}
            </span>
          );
        })}
      </span>
    </button>
  );

  const wrong = KEYS.filter((k) => placed[k.id] && !k.ok.includes(placed[k.id]));
  const allPlaced = KEYS.every((k) => placed[k.id]);

  return (
    <SimFrame
      title="열쇠는 어디에 둘까: 브라우저 vs 서버"
      desc="열쇠를 하나 누른 뒤, 둘 곳(브라우저 코드 / 서버 환경변수)을 누르세요."
      onReset={() => {
        setPlaced({});
        setPicked(null);
      }}
    >
      <div className="flex flex-wrap gap-2">
        {KEYS.filter((k) => !placed[k.id]).map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setPicked(picked === k.id ? null : k.id)}
            aria-pressed={picked === k.id}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium',
              picked === k.id ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'hover:bg-fd-accent',
            )}
          >
            <KeyRound className="size-3.5" /> {k.label}
          </button>
        ))}
        {allPlaced && <span className="text-sm text-fd-muted-foreground">모든 열쇠를 배치했어요.</span>}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {zoneBox('browser', '브라우저(화면) 코드', '방문자 누구나 개발자 도구로 볼 수 있음', Globe)}
        {zoneBox('server', '서버 환경변수', '.env.local · Vercel 환경변수 · 방문자는 볼 수 없음', Server)}
      </div>
      {Object.keys(placed).length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm leading-6">
          {KEYS.filter((k) => placed[k.id]).map((k) => (
            <li key={k.id}>
              <b>{k.label}</b> — {k.why}
            </li>
          ))}
        </ul>
      )}
      {allPlaced && (
        <p className={cn('mt-3 rounded-lg px-3 py-2 text-sm font-semibold', wrong.length ? 'text-[var(--color-danger)]' : 'text-[var(--color-ok)]')}>
          {wrong.length ? `${wrong.length}개를 잘못 배치했어요. 비밀 열쇠는 서버에만!` : '완벽해요. 공개 키만 브라우저에 둘 수 있습니다.'}
        </p>
      )}
    </SimFrame>
  );
}
