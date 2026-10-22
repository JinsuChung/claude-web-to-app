export type SessionMeta = {
  n: number;
  slug: string;
  title: string;
  short: string;
  minutes: number;
  stage: string;
  oneLiner: string;
  goals: string[];
  output: string;
  tools: string[];
  color: string;
};

const PHASE = {
  start: '#4f46e5',
  web: '#0891b2',
  data: '#059669',
  ai: '#d97706',
  app: '#db2777',
  finish: '#7c3aed',
};

export const phases = [
  { key: 'start', label: '시작하기', range: '1–3회', color: PHASE.start, desc: '요즘 흐름을 알고, 아이디어를 기획서와 목업으로, 첫 웹페이지' },
  { key: 'web', label: '웹앱 만들기', range: '4–6회', color: PHASE.web, desc: '목업을 진짜 웹앱으로, 저장하고, 인터넷에 공개' },
  { key: 'data', label: '데이터와 로그인', range: '7–9회', color: PHASE.data, desc: '데이터베이스, 회원가입, 실제로 쓰이는 기능' },
  { key: 'ai', label: 'AI 기능', range: '10회', color: PHASE.ai, desc: '내 서비스 안에서 일하는 AI' },
  { key: 'app', label: '앱으로', range: '11–14회', color: PHASE.app, desc: 'PWA, Expo 앱, 데이터 연결, 출시 준비' },
  { key: 'finish', label: '마무리', range: '15회', color: PHASE.finish, desc: '운영, 다음 단계, 발표' },
] as const;

export const sessions: SessionMeta[] = [
  {
    n: 1,
    slug: '/sessions/1',
    title: 'AI로 누구나 만드는 시대: 요즘 흐름과 첫 만남',
    short: '요즘 흐름과 첫 만남',
    minutes: 120,
    stage: '시작하기',
    oneLiner: '코드를 몰라도 만들 수 있는 시대. 대신 무엇을 만들지 정하고 확인하는 힘이 실력이 된다.',
    goals: [
      '생성형 AI, 바이브 코딩, 에이전틱 엔지니어링이 무엇인지 내 말로 설명한다',
      'Claude(채팅)와 Claude Code(만드는 에이전트)의 차이를 안다',
      'Claude 계정과 데스크톱 앱을 준비하고 첫 대화와 첫 파일을 만든다',
    ],
    output: 'Claude 데스크톱 앱 설치, 첫 대화, AI가 만든 첫 파일',
    tools: ['Claude', 'Claude Code 데스크톱 앱'],
    color: PHASE.start,
  },
  {
    n: 2,
    slug: '/sessions/2',
    title: 'Claude로 아이디어를 기획서와 목업으로',
    short: '기획서와 목업',
    minutes: 120,
    stage: '시작하기',
    oneLiner: '만들기 전에 그려 본다. 목업 한 장이 회의 열 번보다 빠르다.',
    goals: [
      '좋은 프롬프트의 구조(목적·상황·결과물·조건·확인)를 안다',
      'Claude에게 인터뷰를 받아 "우리 모임" 서비스 기획서를 완성한다',
      'Claude 아티팩트로 클릭해 볼 수 있는 화면 목업을 만든다',
    ],
    output: '우리 모임 기획서, 클릭되는 화면 목업',
    tools: ['Claude 채팅', '아티팩트', '프로젝트'],
    color: PHASE.start,
  },
  {
    n: 3,
    slug: '/sessions/3',
    title: '웹은 어떻게 움직일까: Claude Code로 첫 웹페이지',
    short: '첫 웹페이지',
    minutes: 120,
    stage: '시작하기',
    oneLiner: '웹페이지는 글(HTML)에 옷(CSS)을 입히고 움직임(JavaScript)을 더한 것이다.',
    goals: [
      '브라우저, HTML·CSS·JavaScript, 파일과 폴더의 관계를 비유로 설명한다',
      'Claude Code에게 폴더를 열어 주고 웹페이지를 만들게 한다',
      '계획 먼저 보기(플랜 모드)와 되돌리기를 써 본다',
    ],
    output: '휴대폰에서도 잘 보이는 모임 소개 웹페이지 한 장',
    tools: ['Claude Code', '플랜 모드', '브라우저'],
    color: PHASE.start,
  },
  {
    n: 4,
    slug: '/sessions/4',
    title: '목업을 진짜 웹앱으로: Next.js 시작',
    short: '진짜 웹앱으로',
    minutes: 120,
    stage: '웹앱 만들기',
    oneLiner: '목업은 그림, 웹앱은 기계. Claude Code가 그림을 기계로 바꾼다.',
    goals: [
      '웹사이트와 웹앱, 프레임워크, 컴포넌트가 무엇인지 안다',
      '2회차 목업과 기획서를 바탕으로 Next.js 웹앱을 만든다',
      'CLAUDE.md로 프로젝트 규칙을 정하고, 말로 화면을 고친다',
    ],
    output: '내 PC에서 돌아가는 "우리 모임" 웹앱 (가짜 데이터)',
    tools: ['Next.js', 'Node.js', 'CLAUDE.md'],
    color: PHASE.web,
  },
  {
    n: 5,
    slug: '/sessions/5',
    title: 'Git과 GitHub: 실수해도 괜찮은 안전망',
    short: 'Git과 GitHub',
    minutes: 120,
    stage: '웹앱 만들기',
    oneLiner: 'Git은 게임의 세이브 포인트, GitHub는 그 세이브를 올려 두는 클라우드다.',
    goals: [
      '저장소·커밋·푸시·.gitignore를 설명한다',
      'Claude Code에게 커밋과 되돌리기를 말로 시킨다',
      '내 웹앱을 GitHub 저장소에 올린다',
    ],
    output: '커밋 이력이 쌓인 GitHub 저장소',
    tools: ['Git', 'GitHub'],
    color: PHASE.web,
  },
  {
    n: 6,
    slug: '/sessions/6',
    title: 'Vercel로 세상에 공개하기',
    short: '인터넷에 공개',
    minutes: 120,
    stage: '웹앱 만들기',
    oneLiner: '내 PC에만 있던 웹앱이 링크 하나로 세상에 나간다.',
    goals: [
      '서버, 호스팅, 배포, 도메인이 무엇인지 안다',
      'GitHub와 Vercel을 연결해 배포하고, 고칠 때마다 자동 반영되는 것을 확인한다',
      '빌드 에러를 Claude Code로 고치는 흐름을 익힌다',
    ],
    output: '내 주소(….vercel.app)로 열리는 웹앱',
    tools: ['Vercel'],
    color: PHASE.web,
  },
  {
    n: 7,
    slug: '/sessions/7',
    title: '데이터베이스 첫걸음: Supabase',
    short: '데이터베이스',
    minutes: 120,
    stage: '데이터와 로그인',
    oneLiner: '데이터베이스는 여러 사람이 동시에 쓰는 똑똑한 엑셀이다.',
    goals: [
      '테이블·행·열, 그리고 SQL의 기본 문장을 엑셀에 빗대어 읽는다',
      'Supabase 프로젝트를 만들고 모임 일정 테이블을 설계한다',
      '웹앱이 가짜 데이터 대신 데이터베이스에서 읽고 쓰게 만든다',
    ],
    output: '화면에서 모임 일정을 추가하면 저장되는 웹앱',
    tools: ['Supabase', 'SQL'],
    color: PHASE.data,
  },
  {
    n: 8,
    slug: '/sessions/8',
    title: '로그인과 보안: 내 글은 나만 고치게',
    short: '로그인과 보안',
    minutes: 120,
    stage: '데이터와 로그인',
    oneLiner: '로그인은 문, 보안 규칙(RLS)은 자물쇠, 키는 금고에.',
    goals: [
      '인증(누구인가)과 권한(무엇을 할 수 있나)의 차이를 안다',
      'Supabase 로그인과 행 수준 보안(RLS)을 설정한다',
      '환경변수와 공개 키·비밀 키를 올바르게 다룬다',
    ],
    output: '회원가입·로그인, 내가 만든 모임만 고칠 수 있는 웹앱',
    tools: ['Supabase Auth', 'RLS', '환경변수'],
    color: PHASE.data,
  },
  {
    n: 9,
    slug: '/sessions/9',
    title: '기능 완성하기: 참석 신청, 사진, 검색',
    short: '기능 완성',
    minutes: 120,
    stage: '데이터와 로그인',
    oneLiner: '쓸 만한 서비스는 큰 기능 하나보다 작은 기능 여럿이 매끄럽게 이어진 것이다.',
    goals: [
      '테이블 사이의 관계(모임 ↔ 참석)를 이해한다',
      '참석 신청, 사진 올리기, 검색·필터 기능을 붙인다',
      '테스트 체크리스트로 직접 확인하고 버그를 고친다',
    ],
    output: '참석 신청·사진·검색이 되는 완성된 웹 서비스',
    tools: ['Supabase Storage', '관계형 데이터'],
    color: PHASE.data,
  },
  {
    n: 10,
    slug: '/sessions/10',
    title: 'AI 기능 넣기: 내 서비스 안에서 일하는 Claude',
    short: 'AI 기능',
    minutes: 120,
    stage: 'AI 기능',
    oneLiner: 'Claude Code는 만드는 AI, Claude API는 내 서비스 안에서 일하는 AI다.',
    goals: [
      'API, API 키, 토큰과 비용을 이해한다',
      '모임 후기 요약과 안내문 자동 작성 기능을 넣는다',
      'AI 결과를 사람이 확인하는 설계와 프롬프트 인젝션 대비를 익힌다',
    ],
    output: 'AI 후기 요약·안내문 초안 기능이 들어간 웹앱',
    tools: ['Claude API', '서버 함수'],
    color: PHASE.ai,
  },
  {
    n: 11,
    slug: '/sessions/11',
    title: '앱의 세계: 웹·PWA·네이티브, 그리고 홈 화면에 설치',
    short: '웹·PWA·네이티브',
    minutes: 120,
    stage: '앱으로',
    oneLiner: '모든 서비스가 스토어 앱일 필요는 없다. 먼저 홈 화면에 올려 보자.',
    goals: [
      '웹앱·PWA·네이티브 앱의 차이와 고르는 기준을 안다',
      '내 웹앱을 PWA로 만들어 휴대폰 홈 화면에 설치한다',
      '모바일 화면에 맞는 사용성(터치, 글자 크기)을 다듬는다',
    ],
    output: '휴대폰 홈 화면에 설치되는 웹앱',
    tools: ['PWA', '웹 앱 매니페스트'],
    color: PHASE.app,
  },
  {
    n: 12,
    slug: '/sessions/12',
    title: 'Expo로 첫 앱: 내 휴대폰에서 실행하기',
    short: 'Expo 첫 앱',
    minutes: 120,
    stage: '앱으로',
    oneLiner: '목업 → Expo → 내 손 안의 앱. 생각보다 가깝다.',
    goals: [
      'React Native와 Expo가 무엇이고 왜 많이 쓰는지 안다',
      'Expo 프로젝트를 만들고 Expo Go로 내 휴대폰에서 실행한다',
      '2회차 목업을 바탕으로 앱 화면과 이동(탭·화면 전환)을 만든다',
    ],
    output: '내 휴대폰에서 돌아가는 "우리 모임" 앱 화면',
    tools: ['Expo', 'Expo Go', 'Expo Router'],
    color: PHASE.app,
  },
  {
    n: 13,
    slug: '/sessions/13',
    title: '앱에 데이터 연결: 웹과 앱이 같은 데이터를',
    short: '앱 + 데이터',
    minutes: 120,
    stage: '앱으로',
    oneLiner: '웹에서 만든 모임이 앱에도 바로 뜬다. 데이터베이스 하나, 화면 둘.',
    goals: [
      '앱이 데이터베이스와 통신하는 구조와 보안 원칙을 안다',
      'Expo 앱에 Supabase를 연결해 로그인과 모임 목록을 붙인다',
      '웹과 앱에서 같은 데이터가 보이는 것을 확인한다',
    ],
    output: '웹과 데이터를 함께 쓰는 Expo 앱',
    tools: ['Expo', 'Supabase'],
    color: PHASE.app,
  },
  {
    n: 14,
    slug: '/sessions/14',
    title: '앱 빌드와 출시 준비: EAS와 스토어',
    short: '빌드와 출시',
    minutes: 120,
    stage: '앱으로',
    oneLiner: '출시는 코드보다 준비물이다. 아이콘, 설명, 개인정보처리방침, 그리고 심사.',
    goals: [
      '빌드·서명·스토어 심사가 무엇인지 안다',
      'EAS로 설치 파일을 만들고 테스트 배포를 해 본다',
      '스토어 등록 준비물과 심사에서 자주 걸리는 점을 정리한다',
    ],
    output: '테스트 설치 파일, 스토어 등록 준비물 목록',
    tools: ['EAS Build', 'EAS Submit', 'EAS Update'],
    color: PHASE.app,
  },
  {
    n: 15,
    slug: '/sessions/15',
    title: '운영과 다음 단계: 만든 것을 키우는 법',
    short: '운영과 다음 단계',
    minutes: 120,
    stage: '마무리',
    oneLiner: '출시는 끝이 아니라 시작. 쓰는 사람의 목소리로 계속 고친다.',
    goals: [
      '사용자 피드백·분석·비용 관리 등 운영의 기본을 안다',
      '내 서비스를 3분 데모로 발표한다',
      '다음에 만들 것과 계속 배울 길을 정한다',
    ],
    output: '운영 체크리스트, 3분 데모 발표, 다음 30일 계획',
    tools: ['피드백', '분석', '포트폴리오'],
    color: PHASE.finish,
  },
];

export const getSession = (n: number) => sessions.find((s) => s.n === n)!;

/** (이 과정에는 회차 사이 별도 페이지가 없음 — 각 회차 끝의 복습 과제로 대신) */
export type SelfStudyMeta = {
  n: number;
  slug: string;
  title: string;
  short: string;
  minutes: number;
  focus: string;
  plan: { day: string; minutes: number; what: string; href: string }[];
};
export const selfStudies: SelfStudyMeta[] = [];
export const getSelfStudy = (n: number) => selfStudies.find((s) => s.n === n);

/** 진도 합계에 쓰는 모든 과정 번호 */
export const allTracks = sessions.map((s) => s.n);
