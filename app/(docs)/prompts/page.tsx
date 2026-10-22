import type { Metadata } from 'next';
import { PageShell } from '@/components/ui/page-shell';
import { PromptLibrary } from '@/components/library/prompt-library';
import { prompts } from '@/content/data/prompts';

export const metadata: Metadata = {
  title: '프롬프트 라이브러리',
  description: `복사해서 바로 쓰는 프롬프트 ${prompts.length}개. 카테고리·회차·난이도로 찾아보세요.`,
};

export default function Page() {
  return (
    <PageShell
      title="프롬프트 라이브러리"
      description={`복사해서 바로 쓰는 프롬프트 ${prompts.length}개. 빈칸을 채우면 내 상황에 맞게 바뀝니다.`}
    >
      <PromptLibrary />
    </PageShell>
  );
}
