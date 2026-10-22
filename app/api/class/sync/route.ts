import { mergeTracks, publicMe, readRecord, readToken, sanitizeTracks, writeRecord } from '@/lib/server/class-store';

export const dynamic = 'force-dynamic';

/** 로그인한 참가자의 진도 올리기 (완료한 단계는 합집합으로 합쳐짐) */
export async function POST(req: Request) {
  const who = readToken(req.headers.get('authorization'));
  if (!who) return Response.json({ error: '다시 참여(로그인)해 주세요.' }, { status: 401 });
  const rec = await readRecord(who.key);
  if (!rec) return Response.json({ error: '기록을 찾을 수 없어요. 다시 참여해 주세요.' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { tracks?: unknown };
  mergeTracks(rec, sanitizeTracks(body.tracks));
  rec.lastActive = new Date().toISOString();
  await writeRecord(rec);
  return Response.json({ me: publicMe(rec) });
}
