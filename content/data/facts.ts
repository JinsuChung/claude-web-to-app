/**
 * 바뀔 수 있는 사실 정보는 모두 여기서 관리합니다.
 * 학기 시작 전에 출처를 열어 값과 checked 날짜를 갱신하세요.
 */
export type Fact = { value: string; checked: string; source: string };

export const facts = {
  'claude.plan': {
    value: 'Pro 이상 유료 플랜 (무료 플랜은 Claude Code 미포함)',
    checked: '2026-10-06',
    source: 'https://code.claude.com/docs/en/setup',
  },
  'claude.install.mac': {
    value: 'curl -fsSL https://claude.ai/install.sh | bash',
    checked: '2026-10-06',
    source: 'https://code.claude.com/docs/en/setup',
  },
  'claude.install.win': {
    value: 'irm https://claude.ai/install.ps1 | iex',
    checked: '2026-10-06',
    source: 'https://code.claude.com/docs/en/setup',
  },
  'vercel.hobby': {
    value: '무료, 프로젝트 200개, 하루 배포 100회, 비상업·개인 용도',
    checked: '2026-10-06',
    source: 'https://vercel.com/docs/plans/hobby',
  },
  'vercel.pro': {
    value: '개발자 1인당 월 20달러',
    checked: '2026-10-06',
    source: 'https://vercel.com/docs/plans/hobby',
  },
  'supabase.free': {
    value: '활성 프로젝트 2개, DB 500MB, 1주일 미사용 시 일시정지',
    checked: '2026-10-06',
    source: 'https://supabase.com/pricing',
  },
  'supabase.pro': { value: '월 25달러부터', checked: '2026-10-06', source: 'https://supabase.com/pricing' },
  'apple.dev': {
    value: '애플 개발자 프로그램 연 99달러',
    checked: '2026-10-22',
    source: 'https://developer.apple.com/programs/enroll/',
  },
  'google.dev': {
    value: '구글 플레이 개발자 등록 1회 25달러',
    checked: '2026-10-22',
    source: 'https://support.google.com/googleplay/android-developer/answer/6112435',
  },
  'expo.start': {
    value: 'npx create-expo-app@latest',
    checked: '2026-10-22',
    source: 'https://reactnative.dev/docs/environment-setup',
  },
  'neon.free': {
    value: '프로젝트 100개, 프로젝트당 1GB, 5분 미사용 시 자동 절전',
    checked: '2026-10-06',
    source: 'https://neon.com/pricing',
  },
} satisfies Record<string, Fact>;

export type FactKey = keyof typeof facts;

/** Claude API 요금 (100만 토큰당 달러) — 2026-09 기준 */
export const modelPricing = [
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', input: 1, output: 5, note: '가장 빠르고 저렴, 단순 분류·추출' },
  { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', input: 2, output: 10, note: '속도와 성능의 균형, 대부분의 기능에 무난' },
  { id: 'claude-opus-5-5', name: 'Claude Opus 5.5', input: 4, output: 20, note: '복잡한 분석·긴 문서' },
] as const;
export const pricingChecked = '2026-09-25';
export const pricingSource = 'https://claude.com/pricing';
