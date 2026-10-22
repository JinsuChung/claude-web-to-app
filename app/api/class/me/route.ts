import { deleteRecord, publicMe, readRecord, readToken, writeRecord } from '@/lib/server/class-store';

export const dynamic = 'force-dynamic';

/** 현황판에 별명 표시 여부 바꾸기 */
export async function PATCH(req: Request) {
  const who = readToken(req.headers.get('authorization'));
  if (!who) return Response.json({ error: '다시 참여(로그인)해 주세요.' }, { status: 401 });
  const rec = await readRecord(who.key);
  if (!rec) return Response.json({ error: '기록을 찾을 수 없어요.' }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { visible?: unknown };
  if (typeof body.visible === 'boolean') rec.visible = body.visible;
  await writeRecord(rec);
  return Response.json({ me: publicMe(rec) });
}

/** 내 기록 지우기 (현황판에서 빠짐, 이 브라우저의 진도는 남음) */
export async function DELETE(req: Request) {
  const who = readToken(req.headers.get('authorization'));
  if (!who) return Response.json({ error: '다시 참여(로그인)해 주세요.' }, { status: 401 });
  await deleteRecord(who.nick);
  return Response.json({ ok: true });
}
