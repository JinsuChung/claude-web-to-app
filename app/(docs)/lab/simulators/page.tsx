import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/ui/page-shell';
import { Sim } from '@/components/sim';
import { simMeta as simulators, type SimName } from '@/components/sim/meta';

export const metadata: Metadata = { title: '개념 시뮬레이터', description: '에이전트, 커밋, 배포, 보안 개념을 직접 눌러 보며 이해합니다.' };

export default function Page() {
  return (
    <PageShell
      title="개념 시뮬레이터 7종"
      description="실제 AI를 부르지 않는 체험용 화면입니다. 비용도 들지 않고, 인터넷이 불안정해도 동작합니다."
      full={false}
    >
      {(Object.keys(simulators) as SimName[]).map((k) => (
        <section key={k} id={k} className="scroll-mt-20">
          <h2>
            {simulators[k].title}{' '}
            <Link href={`/sessions/${simulators[k].session}`} className="text-sm font-normal">
              ({simulators[k].session}회)
            </Link>
          </h2>
          <Sim name={k} />
        </section>
      ))}
    </PageShell>
  );
}
