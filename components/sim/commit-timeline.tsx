'use client';
import { useState } from 'react';
import { Cloud, GitCommitHorizontal, Laptop, Upload, Undo2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame } from './frame';

type Snap = { title: string; features: string[]; color: string; broken: boolean };
type Commit = { id: number; msg: string; snap: Snap };

const initial: Snap = { title: '우리 모임', features: ['모임 일정 목록', '참석 인원 표시'], color: '#4338ca', broken: false };

export function CommitTimeline() {
  const [work, setWork] = useState<Snap>(initial);
  const [commits, setCommits] = useState<Commit[]>([{ id: 1, msg: '첫 버전: 우리 모임', snap: initial }]);
  const [remote, setRemote] = useState<number>(0);
  const [note, setNote] = useState('작업 내용을 바꾸고 [커밋]으로 세이브 포인트를 만들어 보세요.');
  const head = commits[commits.length - 1];
  const dirty = JSON.stringify(work) !== JSON.stringify(head.snap);

  const edit = (kind: 'feature' | 'design' | 'break') => {
    if (kind === 'feature') {
      const next = ['참석 신청 버튼', '모임 사진 올리기', '휴대폰 화면'].find((f) => !work.features.includes(f));
      if (next) setWork({ ...work, features: [...work.features, next] });
      setNote(next ? `"${next}" 기능을 추가했어요. 아직 커밋 전입니다.` : '추가할 기능이 더 없어요.');
    } else if (kind === 'design') {
      setWork({ ...work, color: work.color === '#4338ca' ? '#047857' : '#4338ca' });
      setNote('디자인 색을 바꿨어요.');
    } else {
      setWork({ ...work, broken: true });
      setNote('AI가 다른 요청을 처리하다 참석 인원 표시를 망가뜨렸어요! 마지막 커밋으로 되돌려 볼까요?');
    }
  };

  const commit = () => {
    const msg = work.broken
      ? '디자인 수정 (오류 포함)'
      : work.features.length > head.snap.features.length
        ? `${work.features[work.features.length - 1]} 추가`
        : '디자인 색 변경';
    setCommits((c) => [...c, { id: c.length + 1, msg, snap: work }]);
    setNote(`커밋 #${commits.length + 1} "${msg}" 저장. 이제 이 시점으로 언제든 돌아올 수 있어요.`);
  };

  const restore = (c: Commit) => {
    setWork(c.snap);
    setNote(`커밋 #${c.id} 상태로 파일을 되돌렸어요. 이후 커밋 기록은 그대로 남아 있습니다.`);
  };

  return (
    <SimFrame
      title="커밋 타임라인: 세이브하고 되돌리기"
      desc="파일을 바꾸고, 커밋하고, 망가뜨린 뒤 과거 커밋을 눌러 되살려 보세요. [푸시]하면 GitHub에도 복사됩니다."
      onReset={() => {
        setWork(initial);
        setCommits([{ id: 1, msg: '첫 버전: 우리 모임', snap: initial }]);
        setRemote(0);
        setNote('작업 내용을 바꾸고 [커밋]으로 세이브 포인트를 만들어 보세요.');
      }}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-fd-muted-foreground">지금 내 PC의 파일 {dirty && <span className="text-[var(--color-warn)]">· 커밋 안 된 변경 있음</span>}</p>
          <div className="rounded-xl border bg-fd-background p-3">
            <div className="rounded-lg px-3 py-2 text-white" style={{ background: work.color }}>
              <p className="font-bold">{work.title}</p>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {work.features.map((f) => (
                <li key={f} className={cn(work.broken && f === '참석 인원 표시' && 'text-[var(--color-danger)] line-through')}>
                  · {f}
                </li>
              ))}
            </ul>
            {work.broken && <p className="mt-2 rounded bg-[color-mix(in_oklab,var(--color-danger)_12%,transparent)] px-2 py-1 text-xs font-semibold text-[var(--color-danger)]">오류: 참석 인원이 NaN명으로 표시됨</p>}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Btn variant="outline" onClick={() => edit('feature')}>기능 추가</Btn>
            <Btn variant="outline" onClick={() => edit('design')}>디자인 변경</Btn>
            <Btn variant="outline" onClick={() => edit('break')} className="text-[var(--color-danger)]">망가뜨리기</Btn>
          </div>
          <div className="mt-2 flex gap-1.5">
            <Btn onClick={commit} disabled={!dirty}>
              <GitCommitHorizontal className="size-4" /> 커밋
            </Btn>
            <Btn variant="outline" onClick={() => { setRemote(commits.length); setNote('푸시 완료! GitHub에 지금까지의 커밋이 모두 올라갔어요.'); }} disabled={remote === commits.length}>
              <Upload className="size-4" /> 푸시
            </Btn>
          </div>
        </div>

        <div>
          <Lane icon={<Laptop className="size-4" />} label="내 PC (로컬 저장소)">
            {commits.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => restore(c)}
                title="이 커밋으로 되돌리기"
                className={cn(
                  'group flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-sm hover:border-fd-primary',
                  c.snap.broken && 'border-[color-mix(in_oklab,var(--color-danger)_40%,transparent)]',
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fd-primary text-[11px] font-bold text-fd-primary-foreground">
                  {c.id}
                </span>
                <span className="flex-1 truncate">{c.msg}</span>
                <Undo2 className="size-3.5 text-fd-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </Lane>
          <Lane icon={<Cloud className="size-4" />} label="GitHub (원격 저장소)" className="mt-3">
            {remote === 0 ? (
              <p className="text-sm text-fd-muted-foreground">아직 푸시하지 않았어요.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {commits.slice(0, remote).map((c) => (
                  <span key={c.id} className="flex size-6 items-center justify-center rounded-full bg-[var(--color-ok)] text-[11px] font-bold text-white">
                    {c.id}
                  </span>
                ))}
              </div>
            )}
          </Lane>
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-fd-secondary/60 px-3 py-2 text-sm leading-6">{note}</p>
    </SimFrame>
  );
}

function Lane({ icon, label, children, className }: { icon: React.ReactNode; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border bg-fd-background p-3', className)}>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-fd-muted-foreground">
        {icon} {label}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
