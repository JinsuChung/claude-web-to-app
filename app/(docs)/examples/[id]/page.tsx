import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Callout } from 'fumadocs-ui/components/callout';
import { PageShell } from '@/components/ui/page-shell';
import { PromptCard } from '@/components/prompt/prompt-card';
import { examples, getExample } from '@/content/data/examples';
import { getSession } from '@/content/data/sessions';

export function generateStaticParams() {
  return examples.map((e) => ({ id: e.id }));
}

export async function generateMetadata(props: PageProps<'/examples/[id]'>): Promise<Metadata> {
  const { id } = await props.params;
  const e = getExample(id);
  if (!e) return {};
  return { title: e.title, description: e.situation.slice(0, 120) };
}

export default async function Page(props: PageProps<'/examples/[id]'>) {
  const { id } = await props.params;
  const e = getExample(id);
  if (!e) notFound();
  const idx = examples.findIndex((x) => x.id === e.id);
  const prev = examples[idx - 1];
  const next = examples[idx + 1];

  return (
    <PageShell title={e.title} description={`${e.area} · ${e.kind} · ${e.level} · 약 ${e.minutes}분`} full={false}>
      <h2>이런 상황에서</h2>
      <p>{e.situation}</p>

      <h2>기획: 프롬프트 5요소</h2>
      <table>
        <tbody>
          <tr>
            <th>목적</th>
            <td>{e.five.purpose}</td>
          </tr>
          <tr>
            <th>입력</th>
            <td>{e.five.input}</td>
          </tr>
          <tr>
            <th>출력</th>
            <td>{e.five.output}</td>
          </tr>
          <tr>
            <th>조건</th>
            <td>{e.five.rules}</td>
          </tr>
          <tr>
            <th>검증</th>
            <td>{e.five.verify}</td>
          </tr>
        </tbody>
      </table>

      <h2>따라 하기</h2>
      {e.steps.map((s, i) => (
        <div key={i}>
          <h3>
            {i + 1}. {s.title}
          </h3>
          <PromptCard title={s.title} text={s.prompt} plan={s.plan} compact />
        </div>
      ))}

      <h2>이건 꼭 확인하세요</h2>
      <ul>
        {e.check.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <h2>더 키워 보기</h2>
      <ul>
        {e.extend.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <Callout title="관련 회차">
        {e.sessions.map((n, i) => (
          <span key={n}>
            {i > 0 && ', '}
            <Link href={`/sessions/${n}`}>
              {n}회 · {getSession(n).short}
            </Link>
          </span>
        ))}
        . 실제 개인정보 대신 가상 데이터로 먼저 연습하세요.
      </Callout>

      <div className="not-prose mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/examples/${prev.id}`} className="rounded-xl border p-4 hover:border-fd-primary">
            <span className="text-xs text-fd-muted-foreground">← 이전 예시</span>
            <span className="block font-semibold">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/examples/${next.id}`} className="rounded-xl border p-4 text-right hover:border-fd-primary">
            <span className="text-xs text-fd-muted-foreground">다음 예시 →</span>
            <span className="block font-semibold">{next.title}</span>
          </Link>
        )}
      </div>
    </PageShell>
  );
}
