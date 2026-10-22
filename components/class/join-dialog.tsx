'use client';
import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, LogOut, Trash2, Users, X } from 'lucide-react';
import { closeJoin, deleteMe, joinClass, leave, setVisible, useJoinOpen, useMe } from '@/lib/class-client';
import { cn } from '@/lib/cn';

/** 참여하기 / 내 참여 정보 창 (레이아웃에 1개) */
export function JoinDialog() {
  const open = useJoinOpen();
  const [me] = useMe();
  const ref = useRef<HTMLDialogElement>(null);
  // 창을 연 순간 참여 전이었는지 기억한다 (참여 직후에도 완료 안내를 보여 주려고)
  const [mode, setMode] = useState<'join' | 'info'>('join');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setMode(me ? 'info' : 'join');
      d.showModal();
    }
    if (!open && d.open) d.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={closeJoin}
      onClick={(e) => e.target === ref.current && closeJoin()}
      className="m-auto w-[min(92vw,26rem)] rounded-2xl border bg-fd-popover p-0 text-fd-popover-foreground shadow-2xl backdrop:bg-black/50"
    >
      {open && (mode === 'info' && me ? <MyInfo /> : <JoinForm />)}
    </dialog>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b px-5 py-3.5">
      <Users className="size-5 text-fd-primary" />
      <span className="text-lg font-bold">{title}</span>
      <button type="button" aria-label="닫기" onClick={closeJoin} className="ml-auto rounded p-1 text-fd-muted-foreground hover:text-fd-foreground">
        <X className="size-5" />
      </button>
    </div>
  );
}

function JoinForm() {
  const [nick, setNick] = useState('');
  const [pin, setPin] = useState('');
  const [visible, setVis] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<null | 'created' | 'back'>(null);

  if (done) {
    return (
      <>
        <Header title={done === 'created' ? '참여했어요!' : '다시 오셨네요!'} />
        <div className="space-y-3 px-5 py-5 text-[0.95rem] leading-7">
          <p>
            {done === 'created'
              ? '이제 실습 단계를 체크하면 홈의 "우리 반 진행 현황"에 자동으로 모여요.'
              : '다른 기기에서 체크한 진도를 이 브라우저에도 합쳐 두었어요.'}
          </p>
          <p className="rounded-lg bg-fd-muted px-3 py-2 text-sm">
            다른 PC나 휴대폰에서는 <b>같은 별명과 PIN</b>으로 참여하면 이어서 할 수 있어요.
          </p>
          <button type="button" onClick={closeJoin} className="w-full rounded-lg bg-fd-primary py-2.5 font-semibold text-fd-primary-foreground">
            계속하기
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="우리 반 현황에 참여하기" />
      <form
        className="space-y-4 px-5 py-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          try {
            const created = await joinClass(nick, pin, visible);
            setDone(created ? 'created' : 'back');
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm leading-6 text-fd-muted-foreground">
          실습을 체크하면 반 전체 진행률에 함께 모여요. 처음이면 새로 만들어지고, 전에 참여했다면 같은 별명·PIN으로 이어집니다.
        </p>
        <label className="block text-sm">
          <span className="font-semibold">별명</span>
          <input
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            required
            minLength={2}
            maxLength={12}
            autoComplete="nickname"
            placeholder="예) 연구지원팀 다람쥐"
            className="mt-1 w-full rounded-lg border bg-fd-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-fd-ring"
          />
          <span className="mt-1 block text-xs text-fd-muted-foreground">2~12자. 실명 대신 별명을 권해요.</span>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">PIN (숫자 4자리)</span>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            required
            inputMode="numeric"
            pattern="\d{4}"
            autoComplete="off"
            placeholder="••••"
            className="mt-1 w-full rounded-lg border bg-fd-background px-3 py-2.5 text-center text-xl tracking-[0.6em] outline-none focus:ring-2 focus:ring-fd-ring"
          />
          <span className="mt-1 block text-xs text-fd-muted-foreground">다른 곳에서 쓰는 비밀번호는 쓰지 마세요. 잊으면 새 별명으로 참여하면 돼요.</span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={visible} onChange={(e) => setVis(e.target.checked)} className="mt-1 size-4" />
          <span>
            현황판에 내 별명 보이기
            <span className="block text-xs text-fd-muted-foreground">끄면 "익명"으로 집계만 돼요. 나중에 바꿀 수 있어요.</span>
          </span>
        </label>
        {error && <p className="rounded-lg bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]">{error}</p>}
        <button
          type="submit"
          disabled={busy || pin.length !== 4 || nick.trim().length < 2}
          className="w-full rounded-lg bg-fd-primary py-2.5 font-semibold text-fd-primary-foreground disabled:opacity-50"
        >
          {busy ? '확인 중…' : '참여하기'}
        </button>
        <p className="text-center text-xs text-fd-muted-foreground">
          저장되는 것: 별명, PIN(암호화), 실습 체크 현황. 과제에 쓴 글은 저장하지 않아요.
        </p>
      </form>
    </>
  );
}

function MyInfo() {
  const [me] = useMe();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!me) return null;

  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true);
    setMsg('');
    try {
      await fn();
      setMsg(ok);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header title="내 참여 정보" />
      <div className="space-y-4 px-5 py-5 text-sm">
        <div className="rounded-xl bg-fd-muted px-4 py-3">
          <p className="text-xs text-fd-muted-foreground">별명</p>
          <p className="text-lg font-bold">{me.nick}</p>
          <p className="mt-1 text-xs text-fd-muted-foreground">다른 기기에서는 같은 별명과 PIN으로 참여하면 이어서 할 수 있어요.</p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => setVisible(me, !me.visible), me.visible ? '이제 익명으로 집계돼요.' : '이제 현황판에 별명이 보여요.')}
          className="flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left hover:bg-fd-accent"
        >
          {me.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          <span className="flex-1">현황판에 별명 {me.visible ? '보이는 중' : '숨기는 중 (익명)'}</span>
          <span className="text-xs text-fd-primary">{me.visible ? '숨기기' : '보이기'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            leave();
            closeJoin();
          }}
          className="flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left hover:bg-fd-accent"
        >
          <LogOut className="size-4" />
          <span className="flex-1">이 브라우저에서 나가기</span>
          <span className="text-xs text-fd-muted-foreground">기록은 남아요</span>
        </button>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[var(--color-danger)] hover:bg-[color-mix(in_oklab,var(--color-danger)_8%,transparent)]"
          >
            <Trash2 className="size-4" /> 내 기록 지우기
          </button>
        ) : (
          <div className="rounded-lg border border-[var(--color-danger)] p-3">
            <p>현황판에서 내 기록이 지워져요. 이 브라우저의 체크 표시는 남아요.</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => run(async () => { await deleteMe(me); closeJoin(); }, '지웠어요.')}
                className={cn('rounded-lg bg-[var(--color-danger)] px-3 py-1.5 font-semibold text-white')}
              >
                지우기
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg border px-3 py-1.5">
                취소
              </button>
            </div>
          </div>
        )}
        {msg && <p className="text-fd-muted-foreground">{msg}</p>}
      </div>
    </>
  );
}
