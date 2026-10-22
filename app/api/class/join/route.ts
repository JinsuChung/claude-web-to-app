import {
  checkPin,
  isLocked,
  issueToken,
  mergeTracks,
  newPin,
  normalizeNick,
  publicMe,
  readRecord,
  registerFail,
  sanitizeTracks,
  validPin,
  writeRecord,
  type ParticipantRecord,
} from '@/lib/server/class-store';

export const dynamic = 'force-dynamic';

/** 별명 + 4자리 PIN으로 참여(처음) 또는 로그인(다시) */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { nick?: unknown; pin?: unknown; visible?: unknown; tracks?: unknown };
  const nick = normalizeNick(body.nick);
  if (!nick) return Response.json({ error: '별명은 2~12자의 한글·영문·숫자로 써 주세요.' }, { status: 400 });
  if (!validPin(body.pin)) return Response.json({ error: 'PIN은 숫자 4자리예요.' }, { status: 400 });

  const now = new Date().toISOString();
  const existing = await readRecord(nick);

  if (existing) {
    if (isLocked(existing)) {
      return Response.json({ error: 'PIN을 여러 번 틀려서 10분 동안 잠겼어요. 잠시 뒤 다시 시도하세요.' }, { status: 429 });
    }
    if (!checkPin(existing, body.pin)) {
      registerFail(existing);
      await writeRecord(existing);
      return Response.json(
        { error: '이미 있는 별명이에요. 내 별명이 맞다면 PIN을 확인하고, 처음이라면 다른 별명을 써 주세요.' },
        { status: 401 },
      );
    }
    existing.fails = 0;
    existing.lockedUntil = undefined;
    existing.lastActive = now;
    mergeTracks(existing, sanitizeTracks(body.tracks));
    await writeRecord(existing);
    return Response.json({ token: issueToken(nick), created: false, me: publicMe(existing) });
  }

  const rec: ParticipantRecord = {
    v: 1,
    nick,
    visible: body.visible !== false,
    pin: newPin(body.pin),
    createdAt: now,
    lastActive: now,
    fails: 0,
    tracks: {},
    hw: 0,
    recent: [],
  };
  mergeTracks(rec, sanitizeTracks(body.tracks));
  await writeRecord(rec);
  return Response.json({ token: issueToken(nick), created: true, me: publicMe(rec) });
}
