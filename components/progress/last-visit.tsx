'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { writeStored } from '@/lib/storage';

/** 마지막으로 본 페이지를 기억해 "이어서 학습하기"에 쓴다 */
export function LastVisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const t = setTimeout(() => {
      const h1 = document.querySelector('#nd-page h1')?.textContent?.trim();
      if (h1) writeStored('last', { path: pathname, title: h1 });
    }, 300);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}
