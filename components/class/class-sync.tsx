'use client';
import { useEffect, useRef } from 'react';
import { useAnyStoredChange, writeStored } from '@/lib/storage';
import { collectTracks, syncNow, useMe } from '@/lib/class-client';

/** 참여한 사람의 실습 체크를 2초 뒤에 자동으로 서버에 올린다 (레이아웃에 1개) */
export function ClassSync() {
  const [me, setMe] = useMe();
  const version = useAnyStoredChange();
  const lastSent = useRef('');

  useEffect(() => {
    if (!me) {
      lastSent.current = '';
      return;
    }
    const payload = JSON.stringify(collectTracks());
    if (payload === lastSent.current) return;
    const t = setTimeout(async () => {
      lastSent.current = payload; // 먼저 표시해 두어 같은 내용을 두 번 보내지 않게
      try {
        await syncNow(me);
      } catch (e) {
        lastSent.current = '';
        if ((e as { status?: number }).status === 401) setMe(null);
        writeStored('sync', { at: new Date().toISOString(), ok: false });
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [me, version, setMe]);

  return null;
}
