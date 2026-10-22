'use client';
import { useState } from 'react';
import { Lock, LockOpen, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame } from './frame';

type Role = 'visitor' | 'staff' | 'admin';
const ROLES: { key: Role; label: string; desc: string }[] = [
  { key: 'visitor', label: '방문자', desc: '로그인하지 않은 누구나' },
  { key: 'staff', label: '회원 하늘', desc: '로그인한 회원' },
  { key: 'admin', label: '관리자', desc: '모든 권한' },
];

const rows = [
  { id: 1, title: '11월 정기 모임', owner: 'staff' },
  { id: 2, title: '북토크 번개', owner: 'other' },
  { id: 3, title: '연말 모임', owner: 'staff' },
];

export function RlsDemo() {
  const [rls, setRls] = useState(false);
  const [role, setRole] = useState<Role>('visitor');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const can = (action: 'read' | 'edit' | 'delete', owner: string) => {
    if (!rls) return true;
    if (action === 'read') return true;
    if (role === 'admin') return true;
    if (role === 'staff') return action === 'edit' ? true : owner === 'staff';
    return false;
  };

  const tryAction = (action: 'edit' | 'delete', r: (typeof rows)[number]) => {
    const ok = can(action, r.owner);
    const verb = action === 'edit' ? '수정' : '삭제';
    const who = ROLES.find((x) => x.key === role)!.label;
    setMsg(
      ok
        ? { ok: !rls && role === 'visitor' ? false : true, text: `${who}이(가) "${r.title}"을(를) ${verb}했습니다.${!rls && role === 'visitor' ? ' — 로그인도 안 한 사람이 데이터를 바꿨어요!' : ''}` }
        : { ok: true, text: `차단됨: ${who}에게는 ${verb} 권한이 없습니다 (RLS 정책).` },
    );
  };

  return (
    <SimFrame
      title="RLS(행 수준 보안) 체험"
      desc="역할을 바꿔 가며 [수정]·[삭제]를 눌러 보세요. RLS를 끄면 무슨 일이 생기는지 비교해 보세요."
      onReset={() => {
        setRls(false);
        setRole('visitor');
        setMsg(null);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setRls((v) => !v);
            setMsg(null);
          }}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white',
            rls ? 'bg-[var(--color-ok)]' : 'bg-[var(--color-danger)]',
          )}
        >
          {rls ? <Lock className="size-4" /> : <LockOpen className="size-4" />} RLS {rls ? '켜짐' : '꺼짐'}
        </button>
        <div role="radiogroup" aria-label="역할" className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r.key}
              role="radio"
              aria-checked={role === r.key}
              onClick={() => {
                setRole(r.key);
                setMsg(null);
              }}
              className={cn('rounded-lg border px-3 py-1.5 text-sm', role === r.key ? 'border-fd-primary bg-fd-primary/10 font-semibold' : 'hover:bg-fd-accent')}
              title={r.desc}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {!rls && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm font-medium text-[var(--color-danger)]">
          <ShieldAlert className="size-4 shrink-0" /> RLS가 꺼져 있으면 공개 키만 있으면 누구나 모든 행을 고치고 지울 수 있습니다.
        </p>
      )}
      {rls && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-fd-muted px-3 py-2 text-xs leading-5">
{`정책 1  누구나 읽기         → using (true)
정책 2  로그인한 회원만 수정  → using (auth.role() = 'authenticated')
정책 3  삭제는 등록한 본인·관리자만`}
        </pre>
      )}

      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="border-b text-left text-fd-muted-foreground">
            <th className="py-2 font-medium">모임</th>
            <th className="py-2 font-medium">등록자</th>
            <th className="py-2 text-right font-medium">해 보기</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="py-2">{r.title}</td>
              <td className="py-2 text-fd-muted-foreground">{r.owner === 'staff' ? '하늘' : '바다'}</td>
              <td className="py-2 text-right">
                <span className="inline-flex gap-1.5">
                  <Btn variant="outline" onClick={() => tryAction('edit', r)}>수정</Btn>
                  <Btn variant="outline" onClick={() => tryAction('delete', r)}>삭제</Btn>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {msg && (
        <p
          className={cn(
            'mt-3 rounded-lg px-3 py-2 text-sm font-medium',
            msg.ok ? 'bg-[color-mix(in_oklab,var(--color-ok)_10%,transparent)]' : 'bg-[color-mix(in_oklab,var(--color-danger)_12%,transparent)] text-[var(--color-danger)]',
          )}
        >
          {msg.text}
        </p>
      )}
    </SimFrame>
  );
}
