import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, MousePointerClick, Wand2 } from 'lucide-react';
import { PageShell } from '@/components/ui/page-shell';
import { simMeta as simulators } from '@/components/sim/meta';

export const metadata: Metadata = { title: '실습 도구', description: '프롬프트 빌더, API 비용 계산기, 개념 시뮬레이터 7종.' };

export default function Page() {
  return (
    <PageShell title="실습 도구" description="수업 중에도, 혼자 만들 때도 꺼내 쓰는 도구 모음입니다.">
      <div className="not-prose grid gap-3 sm:grid-cols-3">
        <Card href="/lab/prompt-builder" icon={<Wand2 className="size-5" />} title="프롬프트 빌더" desc="목적·입력·출력·조건·검증 다섯 칸을 채우면 완성된 프롬프트가 나옵니다." />
        <Card href="/lab/cost-calculator" icon={<Calculator className="size-5" />} title="API 비용 계산기" desc="모델과 분량, 하루 건수로 월 비용을 어림합니다." />
        <Card href="/lab/simulators" icon={<MousePointerClick className="size-5" />} title="개념 시뮬레이터 7종" desc="에이전트, 커밋, 배포, 보안을 눌러 보며 이해합니다." />
      </div>
      <h2>시뮬레이터 목록</h2>
      <ul>
        {Object.entries(simulators).map(([k, s]) => (
          <li key={k}>
            <Link href={`/lab/simulators#${k}`}>{s.title}</Link> — {s.session}회
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

function Card({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href} className="flex flex-col gap-2 rounded-2xl border bg-fd-card p-5 transition-colors hover:border-fd-primary">
      <span className="flex size-10 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">{icon}</span>
      <span className="text-lg font-bold">{title}</span>
      <span className="text-sm leading-6 text-fd-muted-foreground">{desc}</span>
    </Link>
  );
}
