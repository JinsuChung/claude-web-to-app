import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  const base = baseOptions();
  // 홈에서는 발표 모드 버튼을 빼고 OS 토글만 둔다
  const links = base.links?.filter((l, i, arr) => !(l.type === 'custom' && i === arr.length - 1));
  return (
    <HomeLayout {...base} links={links}>
      {children}
    </HomeLayout>
  );
}
