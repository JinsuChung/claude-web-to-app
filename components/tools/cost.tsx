'use client';
import { useMemo, useState } from 'react';
import { modelPricing, pricingChecked, pricingSource } from '@/content/data/facts';
import { cn } from '@/lib/cn';

/** A4 1장 ≈ 1,500토큰(한국어), 응답 500토큰 기준의 어림 계산 */
const TOKENS_PER_PAGE = 1500;

function won(usd: number, rate: number) {
  const v = usd * rate;
  if (v < 10) return `${v.toFixed(1)}원`;
  return `${Math.round(v).toLocaleString('ko-KR')}원`;
}

export function CostTable() {
  const input = 3000;
  const output = 500;
  const rate = 1400;
  return (
    <div className="not-prose my-5 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-fd-muted text-left">
          <tr>
            <th className="px-3 py-2 font-semibold">모델</th>
            <th className="px-3 py-2 font-semibold">성격</th>
            <th className="px-3 py-2 font-semibold">입력 / 출력 (100만 토큰당)</th>
            <th className="px-3 py-2 font-semibold">글 1건 처리 어림값*</th>
          </tr>
        </thead>
        <tbody>
          {modelPricing.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="px-3 py-2 font-medium">{m.name}</td>
              <td className="px-3 py-2 text-fd-muted-foreground">{m.note}</td>
              <td className="px-3 py-2 tabular-nums">
                ${m.input} / ${m.output}
              </td>
              <td className="px-3 py-2 font-semibold tabular-nums">
                약 {won((input * m.input + output * m.output) / 1e6, rate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t px-3 py-2 text-xs leading-5 text-fd-muted-foreground">
        * 입력 3,000토큰(A4 2장 안팎의 글) + 출력 500토큰, 1달러=1,400원 가정의 간이 계산. {pricingChecked} 기준 Anthropic API 요금이며 변동될 수
        있습니다 (
        <a href={pricingSource} target="_blank" rel="noreferrer" className="underline">
          요금표
        </a>
        ).
      </p>
    </div>
  );
}

export function CostCalculator() {
  const [model, setModel] = useState<string>(modelPricing[1].id);
  const [pages, setPages] = useState(2);
  const [outTokens, setOutTokens] = useState(500);
  const [perDay, setPerDay] = useState(20);
  const [days, setDays] = useState(21);
  const [rate, setRate] = useState(1400);

  const calc = useMemo(() => {
    const inTok = pages * TOKENS_PER_PAGE;
    return modelPricing.map((m) => {
      const one = (inTok * m.input + outTokens * m.output) / 1e6;
      return { ...m, one, month: one * perDay * days };
    });
  }, [pages, outTokens, perDay, days]);
  const selected = calc.find((c) => c.id === model)!;
  const max = Math.max(...calc.map((c) => c.month));

  const num = (label: string, value: number, set: (n: number) => void, opts: { min?: number; max?: number; step?: number; unit?: string }) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-fd-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={opts.min ?? 0}
          max={opts.max}
          step={opts.step ?? 1}
          onChange={(e) => set(Math.max(opts.min ?? 0, Number(e.target.value) || 0))}
          className="w-full rounded-lg border bg-fd-background px-3 py-2 tabular-nums outline-none focus:ring-2 focus:ring-fd-ring"
        />
        {opts.unit && <span className="shrink-0 text-fd-muted-foreground">{opts.unit}</span>}
      </span>
    </label>
  );

  return (
    <div className="not-prose my-6 rounded-2xl border bg-fd-card p-5">
      <p className="mb-3 text-lg font-bold">API 비용 계산기</p>
      <div role="radiogroup" aria-label="모델" className="mb-4 grid gap-2 sm:grid-cols-3">
        {modelPricing.map((m) => (
          <button
            key={m.id}
            role="radio"
            aria-checked={model === m.id}
            onClick={() => setModel(m.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left',
              model === m.id ? 'border-fd-primary bg-fd-primary/10' : 'hover:bg-fd-accent',
            )}
          >
            <span className="block font-semibold">{m.name}</span>
            <span className="block text-xs text-fd-muted-foreground">
              ${m.input} / ${m.output} · {m.note}
            </span>
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {num('1건 입력 분량', pages, setPages, { min: 0.5, step: 0.5, unit: 'A4장' })}
        {num('1건 응답 길이', outTokens, setOutTokens, { min: 50, step: 50, unit: '토큰' })}
        {num('하루 건수', perDay, setPerDay, { min: 1, unit: '건' })}
        {num('한 달 근무일', days, setDays, { min: 1, max: 31, unit: '일' })}
        {num('환율', rate, setRate, { min: 1, step: 10, unit: '원/$' })}
      </div>
      <div className="mt-5 grid gap-4 rounded-xl bg-fd-background p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-fd-muted-foreground">1건당</p>
          <p className="text-2xl font-bold tabular-nums">{won(selected.one, rate)}</p>
          <p className="mt-2 text-sm text-fd-muted-foreground">한 달 ({perDay}건 × {days}일)</p>
          <p className="text-3xl font-bold tabular-nums text-fd-primary">{won(selected.month, rate)}</p>
          <p className="text-xs text-fd-muted-foreground tabular-nums">${selected.month.toFixed(2)}</p>
        </div>
        <div className="space-y-2" aria-label="모델별 월 비용 비교">
          {calc.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-xs">
                <span className={cn(c.id === model && 'font-semibold')}>{c.name}</span>
                <span className="tabular-nums">{won(c.month, rate)}</span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-fd-muted">
                <div
                  className={cn('h-full rounded-full', c.id === model ? 'bg-fd-primary' : 'bg-fd-muted-foreground/40')}
                  style={{ width: `${max ? (c.month / max) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-fd-muted-foreground">
        한국어 A4 1장을 약 {TOKENS_PER_PAGE.toLocaleString()}토큰으로 어림한 값입니다. 실제 비용은 Console 사용량 화면에서 확인하세요. 요금 기준일 {pricingChecked}.
      </p>
    </div>
  );
}
