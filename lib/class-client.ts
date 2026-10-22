'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { allTracks } from '@/content/data/sessions';
import { readStored, useStored, writeStored } from '@/lib/storage';

export type Me = { nick: string; token: string; visible: boolean };
export type TrackProgress = { ids: string[]; total: number; quiz: boolean };
export type Tracks = Record<string, TrackProgress>;
export type ClassSummary = {
  updatedAt: string;
  participants: number;
  activeWeek: number;
  activeNow: number;
  avgPct: number;
  tracks: { track: string; completed: number; inProgress: number }[];
  people: { name: string | null; completed: number; pct: number; lastActive: string }[];
  feed: { name: string; track: string; at: string }[];
};

export function useMe() {
  return useStored<Me | null>('me', null);
}

/** 이 브라우저에 저장된 실습 진도를 서버로 보낼 모양으로 모은다 */
export function collectTracks(): Tracks {
  const out: Tracks = {};
  for (const t of allTracks) {
    const key = String(t);
    const ids = readStored<string[]>(`lab:${key}`, []);
    const total = readStored<number>(`labtotal:${key}`, 0);
    const quiz = Object.keys(readStored<Record<string, boolean>>(`quiz:${key}`, {})).length > 0;
    if (ids.length || total || quiz) out[key] = { ids, total, quiz };
  }
  return out;
}

/** 다른 기기에서 쌓은 진도를 이 브라우저에 합친다 (지우지 않고 더하기만) */
export function applyServerTracks(tracks: Tracks) {
  for (const [key, t] of Object.entries(tracks ?? {})) {
    const local = readStored<string[]>(`lab:${key}`, []);
    const merged = [...new Set([...local, ...t.ids])];
    if (merged.length !== local.length) writeStored(`lab:${key}`, merged);
    if (t.total > readStored<number>(`labtotal:${key}`, 0)) writeStored(`labtotal:${key}`, t.total);
  }
}

/* ---------- 참여 창 열기/닫기 (페이지 전체 공유) ---------- */
let dialogOpen = false;
const dialogSubs = new Set<() => void>();
export function openJoin() {
  dialogOpen = true;
  dialogSubs.forEach((f) => f());
}
export function closeJoin() {
  dialogOpen = false;
  dialogSubs.forEach((f) => f());
}
export function useJoinOpen() {
  return useSyncExternalStore(
    (f) => {
      dialogSubs.add(f);
      return () => dialogSubs.delete(f);
    },
    () => dialogOpen,
    () => false,
  );
}

/* ---------- 현황 요약 불러오기 (30초마다, 여러 컴포넌트가 공유) ---------- */
let summary: ClassSummary | null = null;
let summaryError = false;
let fetchedAt = 0;
let inflight: Promise<void> | null = null;
const summarySubs = new Set<() => void>();
const notify = () => summarySubs.forEach((f) => f());

export async function refreshSummary(force = false) {
  if (!force && Date.now() - fetchedAt < 20_000) return;
  if (inflight) return inflight;
  inflight = fetch('/api/class/summary', { cache: 'no-store' })
    .then(async (r) => {
      if (!r.ok) throw new Error();
      summary = (await r.json()) as ClassSummary;
      summaryError = false;
    })
    .catch(() => {
      summaryError = true;
    })
    .finally(() => {
      fetchedAt = Date.now();
      inflight = null;
      notify();
    });
  return inflight;
}

let snapshot: { summary: ClassSummary | null; error: boolean } = { summary, error: summaryError };
export function useClassSummary() {
  useEffect(() => {
    refreshSummary();
    const id = setInterval(() => refreshSummary(true), 30_000);
    return () => clearInterval(id);
  }, []);
  return useSyncExternalStore(
    (f) => {
      summarySubs.add(f);
      return () => summarySubs.delete(f);
    },
    () => {
      if (snapshot.summary !== summary || snapshot.error !== summaryError) snapshot = { summary, error: summaryError };
      return snapshot;
    },
    () => snapshot,
  );
}

/* ---------- API 호출 ---------- */
async function call<T>(path: string, init: RequestInit & { token?: string }): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw Object.assign(new Error(data.error ?? '잠시 뒤 다시 시도해 주세요.'), { status: res.status });
  return data;
}

export async function joinClass(nick: string, pin: string, visible: boolean) {
  const data = await call<{ token: string; created: boolean; me: { nick: string; visible: boolean; tracks: Tracks } }>(
    '/api/class/join',
    { method: 'POST', body: JSON.stringify({ nick, pin, visible, tracks: collectTracks() }) },
  );
  applyServerTracks(data.me.tracks);
  writeStored<Me>('me', { nick: data.me.nick, token: data.token, visible: data.me.visible });
  writeStored('sync', { at: new Date().toISOString(), ok: true });
  refreshSummary(true);
  return data.created;
}

export async function syncNow(me: Me) {
  await call('/api/class/sync', { method: 'POST', token: me.token, body: JSON.stringify({ tracks: collectTracks() }) });
  writeStored('sync', { at: new Date().toISOString(), ok: true });
  refreshSummary(true);
}

export async function setVisible(me: Me, visible: boolean) {
  await call('/api/class/me', { method: 'PATCH', token: me.token, body: JSON.stringify({ visible }) });
  writeStored<Me>('me', { ...me, visible });
  refreshSummary(true);
}

export async function deleteMe(me: Me) {
  await call('/api/class/me', { method: 'DELETE', token: me.token });
  writeStored('me', null);
  writeStored('sync', null);
  refreshSummary(true);
}

export function leave() {
  writeStored('me', null);
  writeStored('sync', null);
}

export function trackLabel(track: string) {
  return `${track}회`;
}

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return '방금';
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  return `${Math.floor(s / 86400)}일 전`;
}
