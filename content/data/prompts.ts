import { promptsA } from './parts/prompts-a';
import { promptsB } from './parts/prompts-b';
import { promptsC } from './parts/prompts-c';
export type Category = 'chat' | 'plan' | 'web' | 'git' | 'deploy' | 'db' | 'auth' | 'feature' | 'ai' | 'app' | 'release' | 'security' | 'fix';

export const categories: Record<Category, { label: string; desc: string }> = {
  chat: { label: '채팅·질문', desc: 'Claude에게 묻고 배우기' },
  plan: { label: '기획·목업', desc: '만들기 전에 정하고 그려 보기' },
  web: { label: '웹앱', desc: '웹페이지와 웹앱 만들기' },
  git: { label: 'Git·GitHub', desc: '저장하고 되돌리기' },
  deploy: { label: '배포', desc: '인터넷에 공개하기' },
  db: { label: '데이터베이스', desc: '테이블 설계와 연결' },
  auth: { label: '로그인', desc: '회원가입과 권한' },
  feature: { label: '기능', desc: '참석·사진·검색 등' },
  ai: { label: 'AI 기능', desc: '서비스 안의 Claude API' },
  app: { label: '앱', desc: 'PWA와 Expo 앱' },
  release: { label: '출시', desc: '빌드와 스토어 준비' },
  security: { label: '보안·점검', desc: '키, 권한, 개인정보' },
  fix: { label: '오류 해결', desc: '에러 고치기, 설명 듣기' },
};

export type Level = 'intro' | 'basic' | 'applied';
export const levels: Record<Level, string> = { intro: '입문', basic: '기본', applied: '응용' };

export type PromptVar = { key: string; label: string; placeholder: string };
export type Prompt = {
  id: string;
  title: string;
  category: Category;
  sessions: number[];
  level: Level;
  plan?: boolean;
  text: string;
  vars?: PromptVar[];
  why?: string;
  bad?: string;
  variants?: { label: string; text: string }[];
  related?: string[];
};

const v = (key: string, label: string, placeholder: string): PromptVar => ({ key, label, placeholder });

export const basePrompts: Prompt[] = [
  /* ---------- 채팅·질문 ---------- */
  {
    id: 'explain-like-beginner',
    title: '어려운 말 쉽게 설명 듣기',
    category: 'chat',
    sessions: [1, 3, 4, 7],
    level: 'intro',
    text: '{{term}}이(가) 뭔지 코딩을 전혀 모르는 사람도 알 수 있게 일상생활 비유로 설명해줘. 3문장 이내로, 마지막에 한 줄 예시를 붙여줘.',
    vars: [v('term', '궁금한 말', 'API')],
    why: '"코딩을 모르는 사람도", "비유로", "3문장"처럼 듣는 사람과 길이를 정해 주면 설명이 훨씬 쉬워집니다.',
    bad: 'API가 뭐야?',
    variants: [{ label: '더 짧게', text: '방금 설명을 초등학생도 알 수 있게 한 문장으로 다시 말해줘.' }],
  },
  {
    id: 'first-chat',
    title: 'Claude와 첫 대화: 나에 대해 알려 주기',
    category: 'chat',
    sessions: [1],
    level: 'intro',
    text: '나는 코딩을 처음 배우는 {{who}}이야. 앞으로 {{goal}}을(를) 만들어 보고 싶어. 내가 15번의 수업에서 무엇을 배우게 될지 순서대로 쉽게 설명해 주고, 처음 1주일 동안 하면 좋은 연습 3가지를 추천해줘.',
    vars: [v('who', '나는 어떤 사람', '50대 직장인'), v('goal', '만들고 싶은 것', '동네 모임을 관리하는 앱')],
    why: '내가 누구이고 무엇을 원하는지 먼저 알려 주면, Claude가 수준과 예시를 나에게 맞춥니다. 사람에게 처음 도움을 청할 때와 같습니다.',
  },
  {
    id: 'trend-briefing',
    title: '요즘 AI 동향 브리핑 받기',
    category: 'chat',
    sessions: [1, 15],
    level: 'intro',
    text: '요즘 "바이브 코딩"과 "에이전틱 엔지니어링"이라는 말이 많이 나오던데, 둘의 차이와 초보자에게 어떤 의미인지 쉽게 설명해줘. 확실하지 않은 내용은 확실하지 않다고 말해줘.',
    why: '"확실하지 않으면 그렇다고 말해줘"는 AI가 그럴듯하게 지어내는 것(환각)을 줄이는 간단한 습관입니다.',
  },
  {
    id: 'check-answer',
    title: 'AI 답이 맞는지 다시 확인하기',
    category: 'chat',
    sessions: [1, 2],
    level: 'intro',
    text: '방금 답에서 사실이 틀렸을 수 있는 부분을 스스로 찾아서 표시해줘. 확인하려면 어디를 찾아보면 되는지도 알려줘.',
    why: 'AI는 틀린 내용도 자신 있게 말할 수 있습니다. 스스로 의심해 보게 하고, 확인할 곳을 받아 두는 습관이 중요합니다.',
  },

  /* ---------- 기획·목업 ---------- */
  {
    id: 'idea-interview',
    title: '인터뷰 받고 기획서 만들기',
    category: 'plan',
    sessions: [2],
    level: 'basic',
    text: '나는 {{idea}}을(를) 만들고 싶어. 기획자처럼 나에게 질문을 해서 누가 쓰는지, 꼭 필요한 기능, 없어도 되는 기능, 화면 구성을 정해줘. 질문은 한 번에 3개 이하로 하고, 다 정해지면 한 장짜리 기획서로 정리해줘.',
    vars: [v('idea', '아이디어', '동네 독서 모임의 일정을 알리고 참석을 받는 서비스')],
    why: '무엇이 필요한지 처음부터 다 알 수는 없습니다. 질문에 답하다 보면 생각이 정리되고, 그 결과가 곧 설계도가 됩니다.',
    bad: '모임 앱 만들어줘',
    related: ['scope-mvp', 'mockup-artifact'],
  },
  {
    id: 'scope-mvp',
    title: '첫 버전 범위 줄이기',
    category: 'plan',
    sessions: [2, 4],
    level: 'basic',
    text: '기획서의 기능 중에서 첫 버전에 꼭 필요한 것 {{n}}개만 골라줘. 나머지는 "다음에 할 일"로 따로 적어줘. 왜 그렇게 골랐는지도 한 줄씩.',
    vars: [v('n', '기능 개수', '3')],
    why: '처음부터 모든 기능을 넣으면 끝까지 가기 어렵습니다. 작은 첫 버전을 완성하는 것이 가장 빨리 배우는 길입니다.',
  },
  {
    id: 'mockup-artifact',
    title: '클릭되는 화면 목업 만들기',
    category: 'plan',
    sessions: [2],
    level: 'basic',
    text: '이 기획서로 휴대폰 화면 크기의 목업을 아티팩트로 만들어줘. 화면은 {{screens}}. 버튼을 누르면 화면이 바뀌게 하고, 데이터는 가짜로 넣어줘. 색은 {{tone}} 느낌으로.',
    vars: [v('screens', '화면 목록', '모임 목록, 모임 상세, 참석 신청 완료'), v('tone', '분위기', '따뜻하고 차분한')],
    why: '말로 설명하는 것보다 눌러 볼 수 있는 화면 하나가 훨씬 많은 것을 알려 줍니다. 이 목업이 4회차(웹앱)와 12회차(앱)의 출발점이 됩니다.',
    related: ['mockup-revise'],
  },
  {
    id: 'mockup-revise',
    title: '목업 고치기',
    category: 'plan',
    sessions: [2],
    level: 'intro',
    text: '{{change}}',
    vars: [v('change', '고칠 점', '모임 카드에 날짜를 크게 보여 주고, 참석 인원이 다 찬 모임은 흐리게 해줘.')],
    why: '보이는 것을 그대로 말하면 됩니다. 한 번에 하나씩 고치면 결과를 확인하기 쉽습니다.',
  },
  {
    id: 'mockup-to-spec',
    title: '목업에서 개발 메모 뽑기',
    category: 'plan',
    sessions: [2, 4, 12],
    level: 'basic',
    text: '이 목업을 실제로 만들 사람에게 넘길 메모를 써줘. 화면별로 보여 줄 정보, 버튼이 하는 일, 필요한 데이터 항목을 표로 정리해줘. 기획서.md 파일로 저장할 수 있게 마크다운으로.',
    why: '목업과 함께 이 메모를 Claude Code에 주면, "그림"을 "동작하는 웹앱"으로 정확히 옮길 수 있습니다.',
  },

  /* ---------- 웹앱 ---------- */
  {
    id: 'folder-look',
    title: '폴더 살펴보게 하기',
    category: 'web',
    sessions: [3, 4],
    level: 'intro',
    text: '이 폴더에 어떤 파일이 있는지 보고, 각각 무엇인지 쉽게 설명해줘.',
    why: 'Claude Code는 내 컴퓨터의 폴더를 직접 엽니다. 무엇을 시키기 전에 먼저 보게 하는 것이 좋은 시작입니다.',
  },
  {
    id: 'first-page',
    title: '첫 웹페이지 만들기',
    category: 'web',
    sessions: [3],
    level: 'intro',
    plan: true,
    text: '{{what}}을(를) 소개하는 웹페이지를 index.html 파일 하나로 만들어줘. 휴대폰에서도 보기 좋게, 글씨는 크게. 아직 만들지 말고 어떤 구성으로 만들지 계획부터 보여줘.',
    vars: [v('what', '소개할 것', '우리 독서 모임 "책 읽는 저녁"')],
    why: '"아직 만들지 말고 계획부터"는 이 과정 내내 쓰는 습관입니다. 계획을 보고 고칠 기회가 생깁니다.',
  },
  {
    id: 'explain-html',
    title: '만든 파일 한 줄씩 설명 듣기',
    category: 'web',
    sessions: [3],
    level: 'intro',
    text: 'index.html을 처음 보는 사람에게 설명하듯, HTML·CSS·JavaScript 부분을 나눠서 각각 무슨 일을 하는지 알려줘.',
  },
  {
    id: 'next-from-mockup',
    title: '목업을 Next.js 웹앱으로',
    category: 'web',
    sessions: [4],
    level: 'basic',
    plan: true,
    text: '@기획서.md 와 목업 화면을 바탕으로 Next.js 웹앱을 만들어줘. 데이터는 일단 코드 안에 가짜로 넣고, 내 컴퓨터에서 실행해서 브라우저로 볼 수 있게 해줘. 먼저 만들 화면과 파일 구성을 계획으로 보여줘.',
    why: '2회차의 목업과 기획서가 그대로 설계도가 됩니다. 목업 화면은 캡처해서 끌어다 놓으면 됩니다.',
    related: ['claude-md-web'],
  },
  {
    id: 'claude-md-web',
    title: '프로젝트 규칙(CLAUDE.md) 만들기',
    category: 'web',
    sessions: [4],
    level: 'basic',
    text: '이 프로젝트에 CLAUDE.md를 만들어줘. 내용은 짧게: 답변과 화면 글자는 한국어로, 초보자에게 설명하듯 말하기, 큰 변경 전에는 계획부터 보여주기, 기능 하나를 마치면 알려주기.',
    why: 'CLAUDE.md는 Claude가 대화를 시작할 때마다 읽는 규칙 메모입니다. 매번 같은 말을 반복하지 않아도 됩니다.',
  },
  {
    id: 'ui-tweak',
    title: '화면 말로 고치기',
    category: 'web',
    sessions: [4, 9],
    level: 'intro',
    text: '{{change}}',
    vars: [v('change', '고칠 점', '모임 목록을 날짜 순으로 정렬하고, 오늘 이후 모임만 보여줘.')],
  },
  {
    id: 'mobile-check',
    title: '휴대폰 화면 점검',
    category: 'web',
    sessions: [4, 11],
    level: 'intro',
    text: '휴대폰 화면 크기에서 글자가 너무 작거나 버튼이 누르기 어려운 곳, 옆으로 넘치는 곳이 있는지 점검하고 고쳐줘.',
  },

  /* ---------- Git ---------- */
  {
    id: 'git-start',
    title: 'Git 저장소 시작하기',
    category: 'git',
    sessions: [5],
    level: 'intro',
    text: '이 폴더를 Git 저장소로 만들고 첫 커밋해줘. 비밀번호나 키가 담길 .env 파일은 올라가지 않게 .gitignore에 넣어줘.',
    why: '.gitignore에 비밀 파일을 처음부터 넣어 두는 것이 가장 중요한 보안 습관입니다.',
  },
  { id: 'git-commit', title: '바뀐 내용 커밋하기', category: 'git', sessions: [5, 6, 7, 8, 9, 10], level: 'intro', text: '지금까지 바뀐 내용을 한글 메시지로 커밋해줘.', why: '잘 돌아갈 때마다 커밋하면, 언제든 그때로 돌아갈 수 있습니다.' },
  { id: 'git-log', title: '커밋 이력 보기', category: 'git', sessions: [5], level: 'intro', text: '커밋 이력을 날짜, 메시지와 함께 표로 보여줘.' },
  { id: 'git-restore', title: '이전 상태로 되돌리기', category: 'git', sessions: [5], level: 'basic', text: '{{when}} 커밋 상태로 되돌려줘. 지금 상태는 따로 보관해 두고.', vars: [v('when', '되돌릴 시점', '마지막')] },
  {
    id: 'git-push',
    title: 'GitHub에 올리기',
    category: 'git',
    sessions: [5],
    level: 'basic',
    text: 'GitHub에 \'{{repo}}\'라는 저장소를 만들고 푸시해줘. 공개(public)로 할지 비공개(private)로 할지 먼저 물어봐줘. 로그인이 필요하면 방법만 알려줘, 로그인은 내가 할게.',
    vars: [v('repo', '저장소 이름', 'our-moim')],
    why: '비밀번호와 인증 코드는 언제나 본인이 직접 입력합니다. AI에게는 안내만 맡깁니다.',
  },

  /* ---------- 배포 ---------- */
  { id: 'deploy-push', title: '고치고 배포까지', category: 'deploy', sessions: [6], level: 'intro', text: '제목을 \'{{title}}\'(으)로 바꾸고 커밋·푸시해줘.', vars: [v('title', '새 제목', '우리 모임 · 책 읽는 저녁')], why: 'Vercel과 연결해 두면 푸시가 곧 업데이트 버튼입니다. 1~2분 뒤 배포 주소에 반영됩니다.' },
  {
    id: 'build-error',
    title: '배포 에러 고치기',
    category: 'deploy',
    sessions: [6, 9],
    level: 'basic',
    text: 'Vercel 배포가 실패했어. 에러는 이거야:\n{{log}}\n원인을 쉽게 설명하고, 고친 뒤 내 컴퓨터에서 먼저 빌드가 되는지 확인하고 푸시해줘.',
    vars: [v('log', '에러 로그', '(Vercel 화면의 빨간 에러 부분을 복사해 붙여 넣기)')],
  },

  /* ---------- 데이터베이스 ---------- */
  {
    id: 'db-design',
    title: '테이블 설계 받기',
    category: 'db',
    sessions: [7],
    level: 'basic',
    plan: true,
    text: '@기획서.md 를 보고 필요한 데이터베이스 테이블을 설계해줘. 테이블마다 칸(컬럼)과 그 이유를 표로 보여주고, Supabase SQL Editor에 붙여 넣을 SQL도 만들어줘. 아직 실행하지는 마.',
    why: 'SQL을 직접 쓸 필요는 없지만, AI가 만든 설계를 표로 읽고 이상한 점을 묻는 것은 사람의 몫입니다.',
  },
  { id: 'sql-explain', title: 'SQL 한 줄씩 설명 듣기', category: 'db', sessions: [7, 8], level: 'intro', text: '이 SQL을 한 줄씩 엑셀에 빗대어 설명해줘. 데이터를 지우거나 바꾸는 줄이 있으면 따로 표시해줘.' },
  {
    id: 'db-connect',
    title: '웹앱을 데이터베이스에 연결',
    category: 'db',
    sessions: [7],
    level: 'basic',
    text: '.env.local 파일을 만들어 두면 내가 Supabase 주소와 공개 키를 넣을게. 그다음 가짜 데이터 대신 Supabase에서 모임 목록을 읽어 오고, 모임 만들기 폼으로 저장되게 바꿔줘.',
    why: '키는 채팅창이 아니라 파일에 직접 넣는 습관을 들입니다.',
  },

  /* ---------- 로그인 ---------- */
  {
    id: 'auth-add',
    title: '회원가입·로그인 붙이기',
    category: 'auth',
    sessions: [8],
    level: 'basic',
    plan: true,
    text: 'Supabase 로그인으로 이메일 회원가입·로그인·로그아웃을 붙여줘. 로그인한 사람만 모임을 만들 수 있게 하고, 계획부터 보여줘.',
  },
  {
    id: 'rls-policy',
    title: '보안 규칙(RLS) 만들기',
    category: 'auth',
    sessions: [8],
    level: 'basic',
    text: '모임 테이블에 RLS 정책을 만들어줘. 누구나 읽기 가능, 로그인한 사람만 만들기, 만든 사람만 고치고 지우기. 각 정책이 무슨 뜻인지 표로 설명해주고 SQL을 줘.',
    why: '바이브 코딩으로 만든 앱에서 개인정보가 새는 사고는 대부분 이 규칙을 빠뜨려서 생깁니다.',
  },

  /* ---------- 기능 ---------- */
  { id: 'feature-rsvp', title: '참석 신청 기능', category: 'feature', sessions: [9], level: 'basic', plan: true, text: '모임마다 참석 신청·취소 버튼을 만들어줘. 정원이 다 차면 신청을 막고, 내가 신청한 모임은 표시해줘. 필요한 테이블과 보안 규칙부터 계획으로 보여줘.' },
  { id: 'feature-photo', title: '사진 올리기', category: 'feature', sessions: [9], level: 'applied', text: '모임 상세 화면에 사진을 올리는 기능을 Supabase Storage로 만들어줘. 로그인한 사람만 올리고, 사진은 5MB 이하만 받아줘.' },
  { id: 'feature-search', title: '검색·필터', category: 'feature', sessions: [9], level: 'basic', text: '모임 목록 위에 검색창과 "이번 주", "참석 가능" 필터를 넣어줘.' },
  {
    id: 'test-checklist',
    title: '테스트 체크리스트 받기',
    category: 'feature',
    sessions: [9, 13],
    level: 'basic',
    text: '지금까지 만든 기능을 사람이 직접 확인할 수 있는 테스트 체크리스트를 만들어줘. 로그인 안 한 사람, 로그인한 사람, 다른 사람 입장에서 각각 해 볼 것을 나눠서.',
    why: 'AI가 "다 됐어요"라고 해도 확인은 사람의 몫입니다. 무엇을 확인할지부터 받아 두면 검증이 쉬워집니다.',
  },

  /* ---------- AI ---------- */
  {
    id: 'ai-summary',
    title: '모임 후기 AI 요약',
    category: 'ai',
    sessions: [10],
    level: 'applied',
    text: '모임 상세 화면에 "후기 요약" 버튼을 만들어줘. 그 모임에 달린 후기들을 Claude API로 3줄 요약해서 보여줘. API 키는 서버 쪽에서만 쓰고, 모델은 {{model}}로.',
    vars: [v('model', '모델', 'Claude Haiku 4.5')],
    why: '요약처럼 단순한 일은 빠르고 저렴한 모델로 충분합니다. 키를 서버에서만 쓰는 것이 핵심입니다.',
  },
  {
    id: 'ai-notice',
    title: '안내문 초안 자동 작성',
    category: 'ai',
    sessions: [10],
    level: 'applied',
    text: '모임 만들기 화면에 "안내문 초안 만들기" 버튼을 넣어줘. 입력한 모임 정보로 단체 대화방에 올릴 안내문 초안을 써 주고, 내가 고친 뒤 복사할 수 있게. 저장이나 발송은 자동으로 하지 마.',
    why: 'AI는 초안을, 사람은 확인과 발송을. 이 설계가 AI를 안전하게 쓰는 기본입니다.',
  },
  { id: 'ai-cost', title: '비용 어림해 보기', category: 'ai', sessions: [10], level: 'basic', text: '이 AI 기능을 하루 {{n}}번 쓴다면 한 달 비용이 대략 얼마인지, 모델별로 비교해서 알려줘. 비용을 줄이는 방법도.', vars: [v('n', '하루 사용 횟수', '30')] },

  /* ---------- 앱 ---------- */
  { id: 'pwa', title: '웹앱을 PWA로', category: 'app', sessions: [11], level: 'basic', text: '이 Next.js 웹앱을 PWA로 만들어줘. 휴대폰 홈 화면에 추가했을 때 앱 이름, 아이콘, 시작 화면 색이 제대로 나오게 해줘. 아이콘은 임시로 만들어줘.' },
  {
    id: 'expo-start',
    title: 'Expo 앱 시작하기',
    category: 'app',
    sessions: [12],
    level: 'basic',
    plan: true,
    text: '새 폴더에 Expo 앱을 만들어줘. @기획서.md 와 목업 화면을 보고 모임 목록, 모임 상세, 내 정보 탭을 만들고, 데이터는 일단 가짜로. 내 휴대폰의 Expo Go로 볼 수 있게 실행 방법까지 알려줘.',
    why: '2회차 목업이 다시 설계도가 됩니다. 웹을 만들 때 쓴 기획서를 그대로 재사용하는 것이 이 과정의 흐름입니다.',
  },
  { id: 'expo-supabase', title: '앱에 Supabase 연결', category: 'app', sessions: [13], level: 'applied', text: 'Expo 앱에 Supabase를 연결해줘. 웹앱과 같은 프로젝트를 쓰고, 공개 키만 앱에 넣어줘. 로그인 상태는 앱을 껐다 켜도 유지되게, 모임 목록은 Supabase에서 읽어오게 해줘.' },
  { id: 'app-same-data', title: '웹과 앱 데이터 확인', category: 'app', sessions: [13], level: 'intro', text: '웹에서 만든 모임이 앱에도 보이는지, 앱에서 참석 신청한 것이 웹에도 반영되는지 확인하는 순서를 알려줘.' },

  /* ---------- 출시 ---------- */
  { id: 'eas-build', title: '테스트용 설치 파일 만들기', category: 'release', sessions: [14], level: 'applied', text: 'EAS로 이 앱의 안드로이드 테스트용 설치 파일을 만드는 방법을 단계별로 알려주고, 필요한 설정 파일을 준비해줘. 로그인은 내가 직접 할게.' },
  { id: 'store-checklist', title: '스토어 등록 준비물 정리', category: 'release', sessions: [14], level: 'basic', text: '앱을 구글 플레이와 앱스토어에 올리려면 필요한 준비물(아이콘, 스크린샷, 설명, 개인정보처리방침 등)을 표로 정리하고, 심사에서 자주 걸리는 점도 알려줘.' },
  { id: 'privacy-policy', title: '개인정보처리방침 초안', category: 'release', sessions: [14], level: 'basic', text: '우리 앱이 모으는 정보(이메일, 모임 참석 기록, 사진)를 기준으로 개인정보처리방침 초안을 써줘. 실제 게시 전에 확인이 필요한 부분은 [확인 필요]로 표시해줘.', why: '법적 문서는 AI 초안을 그대로 쓰지 말고, 반드시 사람이 검토해야 합니다.' },

  /* ---------- 보안 ---------- */
  { id: 'sec-audit', title: '보안 점검', category: 'security', sessions: [8, 10, 13], level: 'basic', text: '이 프로젝트의 보안을 점검해줘. 키가 코드에 노출돼 있거나, 보안 규칙(RLS) 없이 누구나 쓸 수 있는 테이블, 앱 안에 들어간 비밀 키가 있는지 확인해서 목록으로 보여줘.', why: 'AI에게 만들게 했으면, 점검도 AI에게 시키는 습관을 들이세요. 판단은 사람이 합니다.' },
  { id: 'sec-leak', title: '키가 새어 나갔을 때', category: 'security', sessions: [5, 8], level: 'applied', text: '.env 파일이 GitHub에 올라간 것 같아. 저장소에서 지우고 .gitignore에 추가해줘. 그리고 다시 발급해야 할 키 목록과 방법을 알려줘.', why: '한 번 올라간 키는 지워도 기록에 남습니다. 반드시 다시 발급해야 합니다.' },

  /* ---------- 오류 해결 ---------- */
  { id: 'fix-error', title: '에러 고치기', category: 'fix', sessions: [3, 4, 6, 7, 9, 12, 13], level: 'intro', text: '이 에러가 났어:\n{{error}}\n원인을 쉽게 설명하고, 고친 뒤 다시 실행해서 확인해줘.', vars: [v('error', '에러 메시지', '(에러 메시지를 복사해 붙여 넣기)')], why: '에러 메시지는 그대로 붙여 넣는 것이 가장 좋습니다. "다시 실행해서 확인"까지 시켜야 고쳐졌는지 알 수 있습니다.' },
  { id: 'explain-simple', title: '방금 만든 것 설명 듣기', category: 'fix', sessions: [3, 4, 7, 10, 12], level: 'intro', text: '방금 만든 것이 어떻게 동작하는지 처음 배우는 사람이 알아듣게 5줄로 설명해줘.' },
  { id: 'restart-fresh', title: '꼬였을 때 새로 시작', category: 'fix', sessions: [4], level: 'intro', text: '/clear', why: '같은 문제를 두 번 넘게 고쳐도 안 되면, 대화를 비우고 배운 점을 넣어 더 구체적으로 다시 요청하는 편이 빠릅니다.' },
  { id: 'node-check', title: 'Node.js 설치 확인', category: 'fix', sessions: [4], level: 'intro', text: 'Node.js가 설치돼 있는지 확인하고, 없으면 LTS 버전 설치 방법을 안내해줘.' },
];

export const prompts: Prompt[] = [...basePrompts, ...promptsA, ...promptsB, ...promptsC];

export const getPrompt = (id: string) => prompts.find((p) => p.id === id);

export function fillPrompt(text: string, values: Record<string, string>, vars: PromptVar[] = []) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
    const val = values[k]?.trim();
    if (val) return val;
    return vars.find((x) => x.key === k)?.placeholder ?? k;
  });
}
