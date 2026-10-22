import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/ui/page-shell';
import { glossary } from '@/content/data/glossary';
import { sessions } from '@/content/data/sessions';

export const metadata: Metadata = { title: '용어사전', description: '과정에 나오는 용어를 쉬운 비유와 함께 정리했습니다.' };

export default function Page() {
  return (
    <PageShell title="용어사전" description={`과정에 나오는 용어 ${glossary.length}개. 본문에서 점선 밑줄이 있는 단어를 누르면 여기의 설명이 뜹니다.`} full={false}>
      {sessions.map((s) => {
        const terms = glossary.filter((t) => t.session === s.n);
        if (!terms.length) return null;
        return (
          <section key={s.n}>
            <h2 id={`s${s.n}`}>
              {s.n}회 · {s.short}
            </h2>
            <dl className="not-prose divide-y rounded-xl border">
              {terms.map((t) => (
                <div key={t.id} id={t.id} className="scroll-mt-20 px-4 py-3 target:bg-fd-primary/10">
                  <dt className="font-semibold">
                    {t.term}
                    {t.en && <span className="ml-1.5 text-sm font-normal text-fd-muted-foreground">{t.en}</span>}
                  </dt>
                  <dd className="mt-1 text-[0.97rem] leading-7">{t.def}</dd>
                  {t.analogy && <dd className="text-sm text-fd-muted-foreground">비유: {t.analogy}</dd>}
                </div>
              ))}
            </dl>
            <p className="text-sm">
              <Link href={s.slug}>{s.n}회로 가기 →</Link>
            </p>
          </section>
        );
      })}
    </PageShell>
  );
}
