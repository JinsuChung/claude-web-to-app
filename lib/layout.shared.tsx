import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, FlaskConical, FolderDown, LayoutGrid, MessageSquareText } from 'lucide-react';
import { gitConfig } from './shared';
import { OSSwitch } from '@/components/ui/os';
import { PresentButton } from '@/components/present/present';

export function Brand() {
  return (
    <span className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark.svg" alt="" className="size-7" />
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium tracking-[-0.01em] text-fd-muted-foreground">클로드 & 클로드 코드로</span>
        <span className="text-[0.92rem] font-bold tracking-[-0.03em]">웹에서 앱까지</span>
      </span>
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Brand />,
      url: '/',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: '회차', url: '/sessions/1', icon: <BookOpen />, active: 'nested-url' },
      { text: '프롬프트', url: '/prompts', icon: <MessageSquareText />, active: 'nested-url' },
      { text: '아이디어', url: '/examples', icon: <LayoutGrid />, active: 'nested-url' },
      { text: '실습 도구', url: '/lab', icon: <FlaskConical />, active: 'nested-url' },
      { text: '자료실', url: '/downloads', icon: <FolderDown />, active: 'nested-url' },
      { type: 'custom', on: 'nav', secondary: true, children: <OSSwitch /> },
      { type: 'custom', on: 'nav', secondary: true, children: <PresentButton /> },
    ],
  };
}
