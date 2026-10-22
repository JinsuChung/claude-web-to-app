'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';
import { ClassSync } from '@/components/class/class-sync';
import { JoinDialog } from '@/components/class/join-dialog';

const ko: Record<string, string> = {
  displayName: '한국어',
  'Search(search trigger)': '검색',
  'Search(search dialog)': '검색어를 입력하세요',
  'No results found(search dialog)': '검색 결과가 없어요',
  'On this page(table of contents)': '이 페이지 목차',
  'Table of Contents(inline table of contents)': '목차',
  'No Headings(table of contents)': '목차 없음',
  'Next Page(pagination)': '다음',
  'Previous Page(pagination)': '이전',
  'Last updated on(page footer)': '최종 수정',
  'Edit on GitHub(edit page)': 'GitHub에서 수정',
  'Back to Home(404 not found page)': '홈으로',
  'Page Not Found(404 not found page)': '페이지를 찾을 수 없어요',
  'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
    '주소가 바뀌었거나 없는 페이지예요. 왼쪽 메뉴에서 찾아보세요.',
  'Theme(site menu)': '테마',
  'Open Search(search trigger)(aria-label)': '검색 열기',
  'Close Search(search dialog)(aria-label)': '검색 닫기',
  'Open Sidebar(aria-label)': '메뉴 열기',
  'Close Sidebar(aria-label)': '메뉴 닫기',
  'Open Sidebar(sidebar)(aria-label)': '메뉴 열기',
  'Close Sidebar(sidebar)(aria-label)': '메뉴 닫기',
  'Collapse Sidebar(sidebar)(aria-label)': '사이드바 접기',
  'Hide Sidebar(sidebar)': '사이드바 숨기기',
  'Show Sidebar(sidebar)': '사이드바 보이기',
  'Toggle Theme(theme switcher)(aria-label)': '테마 바꾸기',
  'Light(theme switcher)(aria-label)': '밝게',
  'Dark(theme switcher)(aria-label)': '어둡게',
  'System(theme switcher)(aria-label)': '시스템 설정',
  'Toggle Menu(home layout header)(aria-label)': '메뉴',
  'Copy Text(code block)(aria-label)': '코드 복사',
  'Copied Text(code block)(aria-label)': '복사됨',
  'Copy Anchor Link(heading anchor)(aria-label)': '링크 복사',
  'Copied Anchor Link(heading anchor)(aria-label)': '링크 복사됨',
};

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} i18n={{ locale: 'ko', translations: ko }}>
      {children}
      <ClassSync />
      <JoinDialog />
    </RootProvider>
  );
}
