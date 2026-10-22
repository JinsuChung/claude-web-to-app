'use client';
import { useState } from 'react';
import { PauseCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame, Terminal } from './frame';

type Phase = 'idle' | 'explore' | 'plan' | 'ask' | 'denied' | 'run' | 'verify' | 'done' | 'revise';

const PHASES = [
  { key: 'explore', label: '탐색' },
  { key: 'plan', label: '계획' },
  { key: 'run', label: '실행' },
  { key: 'verify', label: '검증' },
] as const;

function activeOf(p: Phase) {
  if (p === 'explore') return 'explore';
  if (p === 'plan' || p === 'ask' || p === 'revise' || p === 'denied') return 'plan';
  if (p === 'run') return 'run';
  if (p === 'verify' || p === 'done') return 'verify';
  return null;
}

export function AgentLoop() {
  const [planMode, setPlanMode] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [log, setLog] = useState<{ k: string; t: string }[]>([]);

  const push = (k: string, t: string) => setLog((l) => [...l, { k, t }]);
  const reset = () => {
    setPhase('idle');
    setLog([]);
  };

  const start = () => {
    reset();
    push('you', '> 다운로드 폴더 파일을 종류별 폴더로 정리해줘');
    setPhase('explore');
    setTimeout(() => {
      push('tool', '● 폴더 읽는 중… 파일 32개 (사진 12, PDF 6, 문서 4, 영수증 5, 기타 5)');
      if (planMode) {
        setPhase('plan');
        push('ai', '계획: 사진/ 문서/ 영수증/ 기타/ 폴더 4개를 만들고 32개 파일을 옮기겠습니다.\n  - 사진/: IMG_*.jpg 12개\n  - 문서/: *.pdf, *.docx 10개 …');
        push('sys', '⏸ 플랜 모드: 승인 전까지 파일을 고치지 않습니다.');
      } else {
        setPhase('ask');
        push('ask', '파일 32개를 이동하려 합니다. 허용할까요?');
      }
    }, 700);
  };

  const approvePlan = () => {
    setPhase('ask');
    push('you', '> 좋아, 진행해');
    push('ask', '파일 32개를 이동하려 합니다. 허용할까요?');
  };
  const revisePlan = () => {
    setPhase('revise');
    push('you', '> 사진은 날짜별 하위 폴더로 나눠줘');
    setTimeout(() => {
      push('ai', '수정한 계획: 사진/2026-09/, 사진/2026-10/ 로 나눠 담겠습니다. 나머지는 동일합니다.');
      setPhase('plan');
    }, 500);
  };
  const allow = () => {
    setPhase('run');
    push('you', '[허용]');
    push('tool', '● 폴더 4개 만들기 · 파일 32개 이동 중…');
    setTimeout(() => {
      setPhase('verify');
      push('tool', '● 확인: 원래 32개 = 옮긴 후 32개, 누락 0');
      setTimeout(() => {
        setPhase('done');
        push('ai', '정리를 마쳤습니다. 결과를 폴더현황보고.md로 저장해 둘까요?');
      }, 600);
    }, 800);
  };
  const deny = () => {
    setPhase('denied');
    push('you', '[거부]');
    push('ai', '알겠습니다. 아무 파일도 옮기지 않았습니다. 어떻게 바꿀지 알려 주세요.');
  };

  const act = activeOf(phase);

  return (
    <SimFrame
      title="에이전트의 일하는 순서와 권한 승인"
      desc="플랜 모드를 켜고 끄며 시작해 보세요. 에이전트가 파일을 고치기 전에 무엇을 묻는지 보세요."
      onReset={reset}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={planMode}
            onChange={(e) => {
              setPlanMode(e.target.checked);
              reset();
            }}
            className="size-4 accent-[var(--color-fd-primary)]"
          />
          <PauseCircle className="size-4" /> 플랜 모드
        </label>
        <Btn onClick={start}>요청 보내기</Btn>
        <div className="ml-auto flex items-center gap-1 text-xs">
          {PHASES.map((p, i) => (
            <span key={p.key} className="flex items-center gap-1">
              <span
                className={cn(
                  'rounded-full border px-2.5 py-1 font-semibold transition-colors',
                  act === p.key ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : 'text-fd-muted-foreground',
                )}
              >
                {p.label}
              </span>
              {i < PHASES.length - 1 && <span className="text-fd-muted-foreground">→</span>}
            </span>
          ))}
        </div>
      </div>

      <Terminal className="min-h-56">
        {log.length === 0 && <p className="text-[#8b95a5]">[요청 보내기]를 누르면 시작합니다.</p>}
        {log.map((l, i) => (
          <p
            key={i}
            className={cn(
              'whitespace-pre-wrap',
              l.k === 'you' && 'text-[#f5c26b]',
              l.k === 'tool' && 'text-[#8fb8ff]',
              l.k === 'sys' && 'text-[#8b95a5]',
              l.k === 'ask' && 'rounded border border-[#f5c26b]/50 bg-[#f5c26b]/10 px-2 py-1 text-[#ffe2a8]',
            )}
          >
            {l.t}
          </p>
        ))}
        {phase === 'plan' && (
          <div className="flex flex-wrap gap-2 pt-1 font-sans">
            <Btn variant="ok" onClick={approvePlan}>계획 승인</Btn>
            <Btn variant="outline" onClick={revisePlan} className="text-fd-foreground">계획 수정 요청</Btn>
          </div>
        )}
        {phase === 'ask' && (
          <div className="flex gap-2 pt-1 font-sans">
            <Btn variant="ok" onClick={allow}>허용</Btn>
            <Btn variant="danger" onClick={deny}>거부</Btn>
          </div>
        )}
      </Terminal>

      {phase === 'done' && (
        <p className="mt-3 text-sm leading-6">
          {planMode
            ? '플랜 모드에서는 계획을 먼저 보고 고칠 수 있었습니다. 사람은 계획 승인과 실행 허용, 두 번만 결정했어요.'
            : '플랜 모드 없이도 실행 전 허용을 묻지만, 무엇을 할지 미리 고칠 기회는 없었습니다. 큰 작업은 플랜 모드를 켜세요.'}
        </p>
      )}
      {phase === 'denied' && (
        <p className="mt-3 text-sm leading-6">거부하면 아무것도 바뀌지 않습니다. 권한 승인 창은 "무엇을 하려는지 읽고 누르는" 결재 버튼입니다.</p>
      )}
    </SimFrame>
  );
}
