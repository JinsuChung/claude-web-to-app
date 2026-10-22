export type CheckItem = { id: string; label: string; hint?: string; href?: string };
export type CheckList = { id: string; title: string; items: CheckItem[] };

export const checklists: Record<string, CheckList> = {
  'prep-1': {
    id: 'prep-1',
    title: '1회 전에 준비할 것',
    items: [
      { id: 'laptop', label: '노트북 (Windows 10 이상 또는 macOS 13 이상)', hint: '메모리 8GB 이상이면 넉넉해요. 태블릿·크롬북은 어려워요.' },
      { id: 'email', label: '자주 쓰는 이메일 주소', hint: '여러 서비스에 같은 이메일로 가입하면 관리가 편해요.' },
      { id: 'claude-pro', label: 'Claude 유료 플랜(Pro 이상)', hint: 'Claude Code는 유료 플랜에 포함돼요. 1회차에 함께 가입해도 됩니다.', href: 'https://claude.ai' },
      { id: 'phone', label: '휴대폰 (11회부터 앱 실습에 사용)' },
    ],
  },
  'prep-3': {
    id: 'prep-3',
    title: '3회 전에 준비할 것',
    items: [
      { id: 'desktop-app', label: 'Claude 데스크톱 앱 설치와 로그인', href: '/start/setup' },
      { id: 'folder', label: '실습용 폴더 하나 만들어 두기 (예: 문서/claude-practice)' },
    ],
  },
  'prep-4': {
    id: 'prep-4',
    title: '4회 전에 준비할 것',
    items: [
      { id: 'node', label: 'Node.js LTS 설치', href: '/start/setup#nodejs' },
      { id: 'mockup', label: '2회차에 만든 기획서와 목업 화면을 찾아 두기' },
    ],
  },
  'prep-5': {
    id: 'prep-5',
    title: '5회 전에 준비할 것',
    items: [
      { id: 'github', label: 'GitHub 가입', href: 'https://github.com/signup' },
      { id: 'git', label: 'Git 설치 확인 (Windows는 Git for Windows)', href: '/start/setup#git' },
    ],
  },
  'prep-6': {
    id: 'prep-6',
    title: '6회 전에 준비할 것',
    items: [{ id: 'vercel', label: 'Vercel 가입 ("Continue with GitHub")', href: 'https://vercel.com/signup' }],
  },
  'prep-7': {
    id: 'prep-7',
    title: '7회 전에 준비할 것',
    items: [{ id: 'supabase', label: 'Supabase 가입 (GitHub 계정으로)', href: 'https://supabase.com' }],
  },
  'prep-10': {
    id: 'prep-10',
    title: '10회 전에 준비할 것',
    items: [
      { id: 'console', label: 'Claude Console 가입, 크레딧, 월 사용 한도 설정', href: 'https://platform.claude.com', hint: '강사가 실습용 키를 나눠 주면 생략해도 돼요.' },
    ],
  },
  'prep-12': {
    id: 'prep-12',
    title: '12회 전에 준비할 것',
    items: [
      { id: 'expo-go', label: '휴대폰에 Expo Go 앱 설치 (앱스토어·플레이스토어에서 "Expo Go")' },
      { id: 'expo-account', label: 'Expo 계정 가입', href: 'https://expo.dev/signup' },
      { id: 'same-wifi', label: '노트북과 휴대폰을 같은 와이파이에 연결할 준비' },
    ],
  },
  'prep-14': {
    id: 'prep-14',
    title: '14회 전에 확인할 것',
    items: [
      { id: 'store-decide', label: '스토어에 실제로 올릴지 결정 (등록비가 들어요. 실습은 테스트 설치까지만 해도 충분)' },
      { id: 'icon', label: '앱 아이콘으로 쓸 이미지 아이디어' },
    ],
  },
};
