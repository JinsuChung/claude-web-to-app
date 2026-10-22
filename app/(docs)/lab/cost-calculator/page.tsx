import type { Metadata } from 'next';
import { PageShell } from '@/components/ui/page-shell';
import { CostCalculator, CostTable } from '@/components/tools/cost';

export const metadata: Metadata = { title: 'API 비용 계산기', description: 'Claude API 모델별 월 비용을 어림합니다.' };

export default function Page() {
  return (
    <PageShell
      title="API 비용 계산기"
      description="10회처럼 내 앱 안에서 Claude API를 부를 때 드는 비용을 어림합니다. Claude Code 구독료와는 별개입니다."
      full={false}
    >
      <CostCalculator />
      <h2>모델별 요금</h2>
      <CostTable />
    </PageShell>
  );
}
