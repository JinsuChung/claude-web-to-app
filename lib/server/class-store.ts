import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { BlobNotFoundError, get, list, put, del } from '@vercel/blob';

/**
 * 우리 반 진행 현황 저장소 (Vercel Blob, 비공개).
 * - 참가자 1명 = JSON 파일 1개. 파일명은 별명의 해시라 한글·공백 문제가 없다.
 * - PIN은 scrypt 해시로만 저장한다.
 * - 운영/미리보기/로컬 개발 기록은 폴더를 나눠 섞이지 않게 한다.
 */

export const TRACKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'] as const;
export type Track = (typeof TRACKS)[number];
export type TrackProgress = { ids: string[]; total: number; quiz: boolean };
export type Tracks = Partial<Record<Track, TrackProgress>>;

export type ParticipantRecord = {
  v: 1;
  nick: string;
  visible: boolean;
  pin: { salt: string; hash: string };
  createdAt: string;
  lastActive: string;
  fails: number;
  lockedUntil?: string;
  tracks: Tracks;
  hw: number;
  recent: { track: Track; at: string }[];
};

const ENV = process.env.VERCEL_ENV ?? 'dev';
const PREFIX = `class/${ENV}/participants/`;
const MAX_FAILS = 5;
const LOCK_MINUTES = 10;

/* ---------- 별명·PIN ---------- */
export function normalizeNick(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const nick = raw.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (nick.length < 2 || nick.length > 12) return null;
  if (!/^[\p{L}\p{N} _.-]+$/u.test(nick)) return null;
  return nick;
}

export function validPin(raw: unknown): raw is string {
  return typeof raw === 'string' && /^\d{4}$/.test(raw);
}

function keyOf(nick: string) {
  const h = createHash('sha256').update(nick.toLowerCase()).digest('hex').slice(0, 32);
  return `${PREFIX}${h}.json`;
}

function hashPin(pin: string, salt: string) {
  return scryptSync(pin, salt, 32).toString('hex');
}

export function checkPin(rec: ParticipantRecord, pin: string) {
  const a = Buffer.from(hashPin(pin, rec.pin.salt), 'hex');
  const b = Buffer.from(rec.pin.hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

export function newPin(pin: string) {
  const salt = randomBytes(16).toString('hex');
  return { salt, hash: hashPin(pin, salt) };
}

/* ---------- 로그인 토큰 (서명만, 서버에 세션 저장 없음) ---------- */
function secret() {
  const s = process.env.SESSION_SECRET ?? process.env.BLOB_READ_WRITE_TOKEN;
  if (!s) throw new Error('SESSION_SECRET 또는 BLOB_READ_WRITE_TOKEN이 필요합니다');
  return createHash('sha256').update(`class-session:${s}`).digest();
}

export function issueToken(nick: string) {
  const payload = Buffer.from(JSON.stringify({ n: nick, k: keyOf(nick), t: Date.now() })).toString('base64url');
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function readToken(header: string | null): { nick: string; key: string } | null {
  const token = header?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expect = createHmac('sha256', secret()).update(payload).digest('base64url');
  if (expect.length !== sig.length || !timingSafeEqual(Buffer.from(expect), Buffer.from(sig))) return null;
  try {
    const { n, k } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { n: string; k: string };
    return k === keyOf(n) ? { nick: n, key: k } : null;
  } catch {
    return null;
  }
}

/* ---------- 읽기·쓰기 ---------- */
export async function readRecord(nickOrKey: string): Promise<ParticipantRecord | null> {
  const key = nickOrKey.startsWith(PREFIX) ? nickOrKey : keyOf(nickOrKey);
  try {
    const res = await get(key, { access: 'private', useCache: false });
    if (!res) return null;
    return JSON.parse(await new Response(res.stream).text()) as ParticipantRecord;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null;
    throw e;
  }
}

export async function writeRecord(rec: ParticipantRecord) {
  await put(keyOf(rec.nick), JSON.stringify(rec), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
  summaryCache = null;
}

export async function deleteRecord(nick: string) {
  await del(keyOf(nick));
  summaryCache = null;
}

export function isLocked(rec: ParticipantRecord) {
  return rec.lockedUntil ? Date.parse(rec.lockedUntil) > Date.now() : false;
}

export function registerFail(rec: ParticipantRecord) {
  rec.fails = (rec.fails ?? 0) + 1;
  if (rec.fails >= MAX_FAILS) {
    rec.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString();
    rec.fails = 0;
  }
}

/* ---------- 진도 합치기 ---------- */
export function isComplete(t?: TrackProgress) {
  return !!t && t.total > 0 && t.ids.length >= t.total;
}

/** 클라이언트가 보낸 값을 믿지 않고 모양·크기를 정리한다 */
export function sanitizeTracks(input: unknown): Tracks {
  const out: Tracks = {};
  if (!input || typeof input !== 'object') return out;
  for (const track of TRACKS) {
    const t = (input as Record<string, unknown>)[track] as Partial<TrackProgress> | undefined;
    if (!t || typeof t !== 'object') continue;
    const ids = Array.isArray(t.ids)
      ? [...new Set(t.ids.filter((x): x is string => typeof x === 'string' && x.length <= 24))].slice(0, 60)
      : [];
    const total = Math.max(0, Math.min(60, Math.floor(Number(t.total) || 0)));
    out[track] = { ids, total, quiz: t.quiz === true };
  }
  return out;
}

/** 서버 기록에 새 진도를 합친다 (완료한 단계는 지워지지 않게 합집합) */
export function mergeTracks(rec: ParticipantRecord, incoming: Tracks, replace = false) {
  const now = new Date().toISOString();
  for (const track of TRACKS) {
    const inc = incoming[track];
    if (!inc) continue;
    const prev = rec.tracks[track];
    const next: TrackProgress = replace
      ? inc
      : {
          ids: [...new Set([...(prev?.ids ?? []), ...inc.ids])].slice(0, 60),
          total: Math.max(prev?.total ?? 0, inc.total),
          quiz: (prev?.quiz ?? false) || inc.quiz,
        };
    if (!isComplete(prev) && isComplete(next)) {
      rec.recent = [{ track, at: now }, ...(rec.recent ?? [])].slice(0, 3);
    }
    rec.tracks[track] = next;
  }
}

/* ---------- 현황판 요약 ---------- */
export type ClassSummary = {
  updatedAt: string;
  participants: number;
  activeWeek: number;
  activeNow: number;
  avgPct: number;
  tracks: { track: Track; completed: number; inProgress: number }[];
  people: { name: string | null; completed: number; pct: number; lastActive: string }[];
  feed: { name: string; track: Track; at: string }[];
};

let summaryCache: { at: number; data: ClassSummary } | null = null;
const SUMMARY_TTL = 15_000;

async function listAll() {
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    keys.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return keys;
}

export async function buildSummary(): Promise<ClassSummary> {
  if (summaryCache && Date.now() - summaryCache.at < SUMMARY_TTL) return summaryCache.data;
  const keys = await listAll();
  const recs = (await Promise.all(keys.slice(0, 300).map((k) => readRecord(k).catch(() => null)))).filter(
    (r): r is ParticipantRecord => !!r,
  );
  const now = Date.now();
  const tracks = TRACKS.map((track) => {
    let completed = 0;
    let inProgress = 0;
    for (const r of recs) {
      const t = r.tracks[track];
      if (isComplete(t)) completed++;
      else if (t && t.ids.length > 0) inProgress++;
    }
    return { track, completed, inProgress };
  });
  // 과정별 단계 수는 누군가 그 페이지를 열어 본 값 중 가장 큰 값을 쓴다 → 모두 같은 분모
  const trackTotals = Object.fromEntries(
    TRACKS.map((track) => [track, Math.max(0, ...recs.map((r) => r.tracks[track]?.total ?? 0))]),
  ) as Record<Track, number>;
  const grand = TRACKS.reduce((s, t) => s + trackTotals[t], 0);
  const people = recs
    .map((r) => {
      let done = 0;
      let completed = 0;
      for (const track of TRACKS) {
        const t = r.tracks[track];
        if (!t) continue;
        done += Math.min(t.ids.length, trackTotals[track]);
        if (isComplete(t)) completed++;
      }
      return { name: r.visible ? r.nick : null, completed, pct: grand ? Math.round((done / grand) * 100) : 0, lastActive: r.lastActive };
    })
    .sort((a, b) => b.lastActive.localeCompare(a.lastActive));
  const feed = recs
    .filter((r) => r.visible)
    .flatMap((r) => (r.recent ?? []).map((e) => ({ name: r.nick, track: e.track, at: e.at })))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);
  const data: ClassSummary = {
    updatedAt: new Date().toISOString(),
    participants: recs.length,
    activeWeek: recs.filter((r) => now - Date.parse(r.lastActive) < 7 * 86_400_000).length,
    activeNow: recs.filter((r) => now - Date.parse(r.lastActive) < 15 * 60_000).length,
    avgPct: people.length ? Math.round(people.reduce((s, p) => s + p.pct, 0) / people.length) : 0,
    tracks,
    people,
    feed,
  };
  summaryCache = { at: Date.now(), data };
  return data;
}

/** 로그인한 본인에게 돌려줄 공개 가능한 정보 */
export function publicMe(rec: ParticipantRecord) {
  return { nick: rec.nick, visible: rec.visible, tracks: rec.tracks };
}
