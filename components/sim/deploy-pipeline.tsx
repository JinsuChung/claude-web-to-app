'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Cloud, GitBranch, Laptop, Loader2, Smartphone, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame, Terminal } from './frame';

type Stage = 'idle' | 'push' | 'github' | 'build' | 'fail' | 'ready';

export function DeployPipeline() {
  const [title, setTitle] = useState('우리 모임 · 책 읽는 저녁');
  const [live, setLive] = useState('우리 모임');
  const [stage, setStage] = useState<Stage>('idle');
  const [failMode, setFailMode] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const run = (fixed = false) => {
    timers.current.forEach(clearTimeout);
    setLogs([]);
    setStage('push');
    later(600, () => setStage('github'));
    later(1200, () => {
      setStage('build');
      setLogs(['Cloning github.com/me/our-moim (main)', 'Installing dependencies…']);
    });
    later(2000, () => setLogs((l) => [...l, 'Running "next build"']));
    if (failMode && !fixed) {
      later(2800, () => {
        setLogs((l) => [...l, "Type error: Property 'date' does not exist on type 'Meetup'.", 'Error: Command "next build" exited with 1']);
        setStage('fail');
      });
    } else {
      later(2800, () => setLogs((l) => [...l, '✓ Compiled successfully', '✓ Generating static pages (5/5)']));
      later(3400, () => {
        setLogs((l) => [...l, 'Deployment ready → https://our-moim.vercel.app']);
        setStage('ready');
        setLive(title);
      });
    }
  };

  const steps = [
    { key: 'push', icon: Laptop, label: '커밋·푸시' },
    { key: 'github', icon: GitBranch, label: 'GitHub' },
    { key: 'build', icon: Cloud, label: 'Vercel 빌드' },
    { key: 'ready', icon: Smartphone, label: '동료 화면' },
  ] as const;
  const order: Stage[] = ['push', 'github', 'build', 'ready'];
  const idx = stage === 'fail' ? 2 : order.indexOf(stage);

  return (
    <SimFrame
      title="배포 파이프라인: 푸시 한 번이면 동료 화면까지"
      desc="제목을 바꾸고 [커밋·푸시]를 눌러 보세요. '빌드 실패 상황'을 켜면 에러를 고치는 흐름도 체험할 수 있어요."
      onReset={() => {
        timers.current.forEach(clearTimeout);
        setStage('idle');
        setLogs([]);
        setLive('우리 모임');
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-fd-muted-foreground">내 PC에서 바꾼 제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border bg-fd-background px-3 py-2 outline-none focus:ring-2 focus:ring-fd-ring"
          />
        </label>
        <label className="inline-flex items-center gap-2 pb-2 text-sm font-medium">
          <input type="checkbox" checked={failMode} onChange={(e) => setFailMode(e.target.checked)} className="size-4" />
          빌드 실패 상황
        </label>
        <Btn onClick={() => run()} disabled={stage !== 'idle' && stage !== 'ready' && stage !== 'fail'}>
          커밋·푸시
        </Btn>
      </div>

      <ol className="my-5 grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = idx > i || stage === 'ready';
          const active = idx === i && stage !== 'ready';
          const failed = stage === 'fail' && i === 2;
          return (
            <li key={s.key} className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  'flex size-11 items-center justify-center rounded-full border-2 transition-colors',
                  done && 'border-[var(--color-ok)] bg-[var(--color-ok)] text-white',
                  active && !failed && 'border-fd-primary text-fd-primary',
                  failed && 'border-[var(--color-danger)] bg-[var(--color-danger)] text-white',
                  !done && !active && !failed && 'text-fd-muted-foreground',
                )}
              >
                {failed ? <X className="size-5" /> : done ? <Check className="size-5" /> : active ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
              </span>
              <span className="text-xs font-medium sm:text-sm">{s.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <Terminal title="Vercel 빌드 로그">
          {logs.length === 0 ? <p className="text-[#8b95a5]">푸시하면 로그가 나타납니다.</p> : null}
          {logs.map((l, i) => (
            <p key={i} className={cn(l.startsWith('✓') && 'text-[#7ee2a8]', /Error|error/.test(l) && 'text-[#ff8a80]', l.startsWith('Deployment') && 'text-[#8fb8ff]')}>
              {l}
            </p>
          ))}
          {stage === 'fail' && (
            <div className="space-y-2 pt-1 font-sans">
              <p className="text-[#ffe2a8]">→ 빨간 에러 부분을 복사해 Claude Code에 붙여 넣고 "고치고 다시 푸시해줘"</p>
              <Btn variant="ok" onClick={() => run(true)}>Claude Code에 붙여 넣고 고치기</Btn>
            </div>
          )}
        </Terminal>
        <div className="mx-auto w-48 rounded-[1.6rem] border-4 border-fd-foreground/80 bg-fd-background p-2 shadow-lg">
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-fd-foreground/30" />
          <div className="rounded-lg bg-[#14123a] px-2 py-2 text-center text-xs font-bold text-white">{live}</div>
          <div className="mt-2 space-y-1.5">
            {['11월 정기 모임 · D-3', '북토크 번개 · D-9', '연말 모임 · D-21'].map((t, i) => (
              <div key={t} className={cn('rounded-md border px-2 py-1 text-[11px]', i === 0 && 'border-[var(--color-danger)] text-[var(--color-danger)]')}>
                {t}
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-fd-muted-foreground">동료의 휴대폰</p>
        </div>
      </div>
    </SimFrame>
  );
}
