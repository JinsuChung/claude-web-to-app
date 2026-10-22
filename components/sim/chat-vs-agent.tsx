'use client';
import { useEffect, useState } from 'react';
import { Bot, Hand, Play, StepForward, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Btn, SimFrame } from './frame';

type Line = { who: 'human' | 'ai'; text: string; hand?: boolean };

const chat: Line[] = [
  { who: 'human', text: '폴더 안 파일 이름 32개를 복사해서 채팅창에 붙여 넣는다', hand: true },
  { who: 'ai', text: '"사진, 문서, 영수증, 기타 폴더로 나누면 좋겠습니다" 라고 답한다' },
  { who: 'human', text: '파일 탐색기에서 폴더 4개를 직접 만든다', hand: true },
  { who: 'human', text: '32개 파일을 하나씩 끌어다 옮긴다', hand: true },
  { who: 'human', text: '빠진 파일이 없는지 눈으로 확인한다', hand: true },
  { who: 'human', text: '정리 결과를 문서로 다시 정리한다', hand: true },
];

const agent: Line[] = [
  { who: 'human', text: '"이 폴더를 종류별로 정리해줘. 계획 먼저 보여줘"', hand: true },
  { who: 'ai', text: '폴더를 직접 열어 32개 파일의 내용을 읽는다' },
  { who: 'ai', text: '분류 계획을 표로 보여 준다 (어떤 파일이 어디로)' },
  { who: 'human', text: '계획을 읽고 "좋아, 진행해" 승인', hand: true },
  { who: 'ai', text: '폴더 4개를 만들고 파일 32개를 옮긴다' },
  { who: 'ai', text: '옮긴 뒤 개수를 세어 빠진 파일이 없는지 검증한다' },
  { who: 'ai', text: '정리 결과를 폴더현황보고.md 파일로 저장한다' },
];

export function ChatVsAgent() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const max = Math.max(chat.length, agent.length);

  useEffect(() => {
    if (!auto) return;
    if (step >= max) {
      setAuto(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [auto, step, max]);

  const hands = (lines: Line[]) => lines.slice(0, step).filter((l) => l.hand).length;

  return (
    <SimFrame
      title="챗봇 vs 에이전트: 다운로드 폴더 정리를 시키면"
      desc="같은 일을 두 방식으로 시켜 봅니다. [다음]을 누르며 사람이 손을 쓰는 횟수를 비교해 보세요."
      onReset={() => {
        setStep(0);
        setAuto(false);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Column title="챗봇 (웹 채팅)" lines={chat} step={step} hands={hands(chat)} tone="muted" />
        <Column title="에이전트 (Claude Code)" lines={agent} step={step} hands={hands(agent)} tone="primary" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Btn onClick={() => setStep((s) => Math.min(max, s + 1))} disabled={step >= max}>
          <StepForward className="size-4" /> 다음
        </Btn>
        <Btn variant="outline" onClick={() => setAuto(true)} disabled={auto || step >= max}>
          <Play className="size-4" /> 자동 재생
        </Btn>
        {step >= max && (
          <p className="text-sm font-medium">
            챗봇은 사람이 <b>{hands(chat)}번</b>, 에이전트는 <b>{hands(agent)}번</b> 손을 썼어요. 사람은 지시와 승인만 합니다.
          </p>
        )}
      </div>
    </SimFrame>
  );
}

function Column({
  title,
  lines,
  step,
  hands,
  tone,
}: {
  title: string;
  lines: Line[];
  step: number;
  hands: number;
  tone: 'muted' | 'primary';
}) {
  return (
    <div className={cn('rounded-xl border p-3', tone === 'primary' && 'border-fd-primary/40')}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-fd-muted px-2 py-0.5 text-xs font-semibold tabular-nums">
          <Hand className="size-3" /> 사람 손 {hands}
        </span>
      </div>
      <ol className="space-y-1.5">
        {lines.map((l, i) => (
          <li
            key={i}
            className={cn(
              'flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm leading-6 transition-all duration-300',
              i < step ? 'opacity-100' : 'opacity-25',
              i === step - 1 && 'ring-2 ring-fd-primary/40',
              l.who === 'human' ? 'bg-[color-mix(in_oklab,var(--color-warn)_10%,transparent)]' : 'bg-fd-secondary/60',
            )}
          >
            {l.who === 'human' ? (
              <User className="mt-1 size-3.5 shrink-0 text-[var(--color-warn)]" />
            ) : (
              <Bot className="mt-1 size-3.5 shrink-0 text-fd-primary" />
            )}
            {l.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
