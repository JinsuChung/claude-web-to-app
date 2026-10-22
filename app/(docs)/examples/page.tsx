import type { Metadata } from 'next';
import { PageShell } from '@/components/ui/page-shell';
import { ExampleGallery } from '@/components/library/example-gallery';

export const metadata: Metadata = {
  title: '아이디어 갤러리',
  description: '모임, 가게, 생활, 배움, 가족, 일 — 바로 만들어 볼 수 있는 아이디어 모음.',
};

export default function Page() {
  return (
    <PageShell
      title="아이디어 갤러리"
      description="생활 속 장면별로 기획 → 따라 하기 프롬프트 → 확인할 것 → 더 키워 보기를 담았습니다. 어느 회차에서 만들 수 있는지도 표시했어요."
    >
      <ExampleGallery />
    </PageShell>
  );
}
