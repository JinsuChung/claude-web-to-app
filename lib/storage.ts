'use client';
import { useCallback, useSyncExternalStore } from 'react';

/**
 * 브라우저 저장소 래퍼.
 * - 모든 접근을 try/catch로 감싸고, 실패하면 메모리에만 보관한다 (사생활 보호 모드 등).
 * - 같은 키를 쓰는 컴포넌트끼리 즉시 동기화된다.
 */
const PREFIX = 'vc:';
const memory = new Map<string, string>();
const listeners = new Map<string, Set<() => void>>();

function rawGet(key: string): string | null {
  try {
    const v = window.localStorage.getItem(PREFIX + key);
    if (v !== null) return v;
  } catch {}
  return memory.get(key) ?? null;
}

function rawSet(key: string, value: string | null) {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  try {
    if (value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, value);
  } catch {}
  listeners.get(key)?.forEach((fn) => fn());
  anyListeners.forEach((fn) => fn());
}

const anyListeners = new Set<() => void>();

export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = rawGet(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T | null) {
  rawSet(key, value === null ? null : JSON.stringify(value));
}

function subscribe(key: string, fn: () => void) {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PREFIX + key) fn();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    set!.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}

/** 저장된 값을 상태처럼 쓰는 훅. 서버 렌더링 중에는 fallback을 돌려준다. */
export function useStored<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const raw = useSyncExternalStore(
    useCallback((fn) => subscribe(key, fn), [key]),
    () => rawGet(key),
    () => null,
  );
  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {}
  }
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const prev = readStored<T>(key, fallback);
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      writeStored(key, next);
    },
    // fallback은 호출부에서 상수로 넘긴다고 가정
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

/** 저장소의 어떤 키라도 바뀌면 다시 렌더링 (진도 합계 등). */
export function useAnyStoredChange() {
  return useSyncExternalStore(
    (fn) => {
      anyListeners.add(fn);
      window.addEventListener('storage', fn);
      return () => {
        anyListeners.delete(fn);
        window.removeEventListener('storage', fn);
      };
    },
    () => version(),
    () => 0,
  );
}

let ver = 0;
anyListeners.add(() => {
  ver++;
});
function version() {
  return ver;
}

/** 진도 백업: vc: 로 시작하는 모든 값을 문자열로 */
export function exportProgress(): string {
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = window.localStorage.getItem(k) ?? '';
    }
  } catch {
    memory.forEach((v, k) => (out[k] = v));
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(out))));
}

export function importProgress(code: string): boolean {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(code.trim())))) as Record<string, string>;
    Object.entries(data).forEach(([k, v]) => rawSet(k, v));
    return true;
  } catch {
    return false;
  }
}

export function resetProgress() {
  const keys: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(PREFIX)) keys.push(k.slice(PREFIX.length));
    }
  } catch {}
  memory.forEach((_, k) => keys.push(k));
  keys.forEach((k) => rawSet(k, null));
}

const noop = () => () => {};
/** 서버 렌더링·하이드레이션 중에는 false, 그 뒤에는 true */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
