import { buildSummary } from '@/lib/server/class-store';

export const dynamic = 'force-dynamic';

/** 우리 반 진행 현황 (공개 가능한 집계만) */
export async function GET() {
  try {
    const data = await buildSummary();
    return Response.json(data, { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60' } });
  } catch {
    return Response.json({ error: '현황을 불러오지 못했어요.' }, { status: 503 });
  }
}
