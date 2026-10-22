export type Area = '모임·커뮤니티' | '가게·소상공인' | '생활·가계' | '배움·취미' | '가족·건강' | '일·업무';
export type Kind = '웹페이지' | '웹앱' | 'DB 앱' | 'AI 기능' | '모바일 앱';

export type Example = {
  id: string;
  title: string;
  area: Area;
  kind: Kind;
  sessions: number[];
  level: '입문' | '기본' | '응용';
  minutes: number;
  situation: string;
  five: { purpose: string; input: string; output: string; rules: string; verify: string };
  steps: { title: string; prompt: string; plan?: boolean }[];
  check: string[];
  extend: string[];
};

export const areas: Area[] = ['모임·커뮤니티', '가게·소상공인', '생활·가계', '배움·취미', '가족·건강', '일·업무'];
export const kinds: Kind[] = ['웹페이지', '웹앱', 'DB 앱', 'AI 기능', '모바일 앱'];

export const examples: Example[] = [
  {
    id: 'club-intro',
    title: '모임 소개 한 장 페이지',
    area: '모임·커뮤니티',
    kind: '웹페이지',
    sessions: [2, 3],
    level: '입문',
    minutes: 20,
    situation: '새 회원을 모집할 때마다 단체 대화방에 긴 글을 붙여 넣는다. 링크 하나로 모임을 소개하고 싶다.',
    five: { purpose: '새 회원 모집', input: '모임 이름, 소개, 요일·장소, 회비, 연락 방법', output: '휴대폰에서 잘 보이는 소개 페이지 index.html', rules: '글씨는 크게, 신청 버튼은 맨 아래 크게', verify: '휴대폰 크기 화면에서 가로로 넘치는 곳이 없는지' },
    steps: [
      { title: '계획', prompt: '우리 모임 소개 웹페이지를 index.html 하나로 만들고 싶어. 모임 이름은 "책 읽는 저녁", 매달 둘째 토요일 저녁 7시, 동네 북카페, 회비 1만 원. 아직 만들지 말고 구성 계획부터 보여줘.', plan: true },
      { title: '만들기', prompt: '좋아, 계획대로 만들어줘. 휴대폰에서 보기 좋게, 따뜻한 색감으로.' },
    ],
    check: ['휴대폰에서 글씨가 충분히 큰가', '연락 방법이 정확한가'],
    extend: ['6회: 인터넷 주소로 공개', '7회: 참석 신청을 받는 웹앱으로'],
  },
  {
    id: 'moim-service',
    title: '모임 일정·참석 관리 서비스 (이 과정의 메인 실습)',
    area: '모임·커뮤니티',
    kind: 'DB 앱',
    sessions: [2, 4, 7, 8, 9],
    level: '기본',
    minutes: 120,
    situation: '모임 일정을 대화방에 올리면 묻히고, 참석 인원은 손으로 센다. 일정·참석·사진을 한곳에서 보고 싶다.',
    five: { purpose: '모임 운영을 편하게', input: '모임 일정(날짜, 장소, 정원), 회원 계정', output: '일정 목록, 참석 신청, 사진이 되는 웹앱', rules: '로그인한 사람만 신청, 만든 사람만 수정', verify: '두 계정으로 시험해 남의 모임을 고칠 수 없는지' },
    steps: [
      { title: '기획', prompt: '동네 독서 모임의 일정을 알리고 참석을 받는 서비스를 만들고 싶어. 기획자처럼 질문해서 기획서를 만들어줘.', plan: true },
      { title: '웹앱', prompt: '@기획서.md 와 목업을 바탕으로 Next.js 웹앱을 만들어줘. 먼저 계획을 보여줘.', plan: true },
      { title: '데이터', prompt: '모임과 참석 신청을 Supabase에 저장하도록 바꾸고, 보안 규칙(RLS)도 만들어줘.' },
    ],
    check: ['정원이 차면 신청이 막히는가', '로그아웃하면 수정 버튼이 사라지는가'],
    extend: ['10회: AI 후기 요약', '12–13회: 같은 데이터로 휴대폰 앱'],
  },
  {
    id: 'cafe-menu',
    title: '동네 카페 메뉴판과 오늘의 메뉴',
    area: '가게·소상공인',
    kind: '웹페이지',
    sessions: [3, 5, 6, 11],
    level: '입문',
    minutes: 30,
    situation: '메뉴가 자주 바뀌는데 종이 메뉴판을 매번 다시 뽑는다. QR로 여는 웹 메뉴판이 있으면 좋겠다.',
    five: { purpose: '메뉴 안내와 변경을 쉽게', input: '메뉴 이름, 가격, 사진 설명', output: 'QR로 여는 웹 메뉴판', rules: '가격은 원 단위 쉼표, 품절 표시 가능', verify: '휴대폰으로 QR을 찍어 열리는지' },
    steps: [
      { title: '메뉴판', prompt: '카페 메뉴판 웹페이지를 만들어줘. 커피, 차, 디저트로 나누고 품절 메뉴는 흐리게 보여줘. 메뉴는 menu.json 파일에서 읽어 오게 해서 나중에 쉽게 고칠 수 있게.' },
      { title: '공개와 QR', prompt: 'Vercel에 배포하는 방법을 알려주고, 배포 주소로 가게에 붙일 QR 코드 이미지를 만들어줘.' },
    ],
    check: ['menu.json을 고치면 화면이 바뀌는가', 'QR이 정확한 주소로 가는가'],
    extend: ['7회: 사장님이 화면에서 메뉴를 고치는 관리 페이지', '11회: 홈 화면 설치(PWA)'],
  },
  {
    id: 'shop-booking',
    title: '공방 클래스 예약 받기',
    area: '가게·소상공인',
    kind: 'DB 앱',
    sessions: [2, 7, 8, 9],
    level: '응용',
    minutes: 90,
    situation: '전화와 메시지로 클래스 예약을 받다 보니 겹치기 예약이 생긴다.',
    five: { purpose: '예약 겹침 없애기', input: '클래스 일정, 정원', output: '날짜별 남은 자리와 예약 폼', rules: '정원 초과 예약 불가, 예약자는 자기 예약만 취소', verify: '같은 시간에 정원 이상 예약을 시도해 막히는지' },
    steps: [{ title: '설계와 제작', prompt: '공방 클래스 예약 웹앱을 만들어줘. 클래스마다 정원이 있고, 남은 자리를 보여주고, 정원이 차면 예약을 막아줘. Supabase와 RLS로. 테이블 설계부터 계획을 보여줘.', plan: true }],
    check: ['겹치기 예약이 막히는가', '다른 사람 예약을 취소할 수 없는가'],
    extend: ['10회: 예약 확인 안내문 AI 초안', '14회: 앱으로 출시'],
  },
  {
    id: 'household-book',
    title: '가계부 엑셀 정리와 차트',
    area: '생활·가계',
    kind: '웹페이지',
    sessions: [1, 3],
    level: '입문',
    minutes: 20,
    situation: '카드 내역을 엑셀로 받지만 어디에 많이 썼는지 한눈에 안 보인다.',
    five: { purpose: '지출 습관 보기', input: '카드내역 엑셀', output: '항목별 합계 표와 차트', rules: '원본은 그대로 두기', verify: '항목별 합계의 합이 전체 지출과 같은지' },
    steps: [{ title: '정리', prompt: '@카드내역_9월.xlsx 를 보고 식비, 교통, 쇼핑, 기타로 나눠 합계를 내고 원형 차트가 든 새 엑셀을 만들어줘. 원본은 고치지 말고, 합계가 맞는지 검산 결과도 보여줘.' }],
    check: ['검산 결과가 맞는가', '원본 파일이 그대로인가'],
    extend: ['매달 다시 쓰는 도구로 만들기', '7회: 웹 가계부로'],
  },
  {
    id: 'grocery-share',
    title: '가족 장보기 목록 공유',
    area: '생활·가계',
    kind: 'DB 앱',
    sessions: [7, 11, 13],
    level: '기본',
    minutes: 60,
    situation: '가족끼리 장볼 것을 메시지로 보내다 보니 빠뜨리거나 두 번 산다.',
    five: { purpose: '장보기 목록을 함께', input: '품목, 수량, 누가 추가했는지', output: '가족이 같이 보는 장보기 목록', rules: '산 물건은 체크하면 아래로', verify: '두 휴대폰에서 동시에 열어 체크가 반영되는지' },
    steps: [{ title: '만들기', prompt: '가족이 함께 쓰는 장보기 목록 웹앱을 만들어줘. 품목 추가, 체크하면 줄 긋고 아래로, 가족 코드로만 들어올 수 있게. Supabase로.' }],
    check: ['다른 가족 코드로는 목록이 안 보이는가'],
    extend: ['11회: 홈 화면 설치', '실시간 갱신 붙이기'],
  },
  {
    id: 'reading-log',
    title: '독서 기록장',
    area: '배움·취미',
    kind: '웹앱',
    sessions: [4, 5, 6],
    level: '입문',
    minutes: 40,
    situation: '읽은 책을 기억하고 싶은데 메모가 흩어져 있다.',
    five: { purpose: '읽은 책과 한 줄 감상 모으기', input: '책 제목, 날짜, 별점, 한 줄 감상', output: '연도별로 보이는 독서 기록 웹앱', rules: '처음엔 내 브라우저에만 저장', verify: '새로 고침해도 기록이 남는지' },
    steps: [{ title: '만들기', prompt: '독서 기록 웹앱을 Next.js로 만들어줘. 책 제목, 날짜, 별점, 한 줄 감상을 적고 연도별로 모아 보게. 데이터는 일단 브라우저에 저장.' }],
    check: ['새로 고침 후에도 남는가'],
    extend: ['7회: 데이터베이스로 옮겨 다른 기기에서도', '10회: AI로 올해 독서 회고 쓰기'],
  },
  {
    id: 'study-quiz',
    title: '공부한 내용으로 퀴즈 만들기',
    area: '배움·취미',
    kind: 'AI 기능',
    sessions: [1, 10, 15],
    level: '기본',
    minutes: 40,
    situation: '자격증 공부 중인데 복습할 문제가 부족하다.',
    five: { purpose: '복습 문제 만들기', input: '공부한 내용 정리 글', output: '객관식 5문제와 해설', rules: '정리 글에 없는 내용은 내지 말 것', verify: '정답 근거가 정리 글에 있는지' },
    steps: [{ title: 'AI 기능', prompt: '정리 글을 붙여 넣으면 Claude API로 객관식 5문제와 해설을 만들어 주는 화면을 만들어줘. 정리 글에 없는 내용은 출제하지 말라고 지시하고, API 키는 서버에서만.' }],
    check: ['정답이 정리 글에 근거하는가', '키가 화면 코드에 없는가'],
    extend: ['틀린 문제만 다시 풀기'],
  },
  {
    id: 'walk-tracker',
    title: '가족 걷기 챌린지',
    area: '가족·건강',
    kind: '모바일 앱',
    sessions: [12, 13, 14],
    level: '응용',
    minutes: 120,
    situation: '가족끼리 하루 걸음 수를 겨루면 재미있겠다는 이야기가 나왔다.',
    five: { purpose: '함께 걷는 습관', input: '날짜별 걸음 수(직접 입력)', output: '가족 순위와 주간 그래프가 있는 앱', rules: '가족 그룹 안에서만 공개', verify: '다른 그룹 기록이 보이지 않는지' },
    steps: [
      { title: '앱 화면', prompt: 'Expo로 가족 걷기 챌린지 앱을 만들어줘. 오늘 걸음 수 입력, 가족 순위, 주간 그래프 탭. 데이터는 일단 가짜로.', plan: true },
      { title: '데이터', prompt: 'Supabase에 연결해서 가족 그룹별로 기록을 저장하고, 그룹 밖에서는 안 보이게 RLS를 설정해줘.' },
    ],
    check: ['그룹 밖에서 기록이 보이지 않는가'],
    extend: ['휴대폰 걸음 수 자동 읽기(네이티브 기능)', '14회: 출시'],
  },
  {
    id: 'medicine-reminder',
    title: '부모님 약 복용 체크',
    area: '가족·건강',
    kind: 'DB 앱',
    sessions: [7, 11, 12, 14],
    level: '기본',
    minutes: 60,
    situation: '멀리 사는 부모님이 약을 드셨는지 매번 전화로 확인한다.',
    five: { purpose: '복용 여부를 가족이 함께 확인', input: '약 이름, 복용 시간, 체크 기록', output: '큰 버튼 하나로 체크하는 화면 + 가족용 확인 화면', rules: '글씨와 버튼은 아주 크게', verify: '어르신이 설명 없이 누를 수 있는지 직접 시험' },
    steps: [{ title: '만들기', prompt: '부모님이 약을 먹고 큰 버튼 하나만 누르면 기록되고, 자녀는 다른 화면에서 오늘 복용 여부를 보는 웹앱을 만들어줘. 글씨와 버튼은 아주 크게, 홈 화면에 설치할 수 있게.' }],
    check: ['버튼이 충분히 큰가', '잘못 눌렀을 때 취소할 수 있는가'],
    extend: ['11회: PWA로 홈 화면 설치', '알림 붙이기(앱)'],
  },
  {
    id: 'meeting-minutes',
    title: '회의 메모 → 할 일 표',
    area: '일·업무',
    kind: 'AI 기능',
    sessions: [1, 10],
    level: '기본',
    minutes: 30,
    situation: '회의가 끝나면 메모를 정리해 할 일을 나누는 데 시간이 걸린다.',
    five: { purpose: '회의 후속 정리', input: '회의 메모 글', output: '결정사항과 할 일(담당·기한) 표', rules: '메모에 없는 내용은 넣지 않기', verify: '메모 원문과 대조' },
    steps: [{ title: '정리', prompt: '이 회의 메모를 결정사항과 할 일(담당·기한)로 표로 정리해줘. 담당이나 기한이 없으면 "미정", 메모에 없는 내용은 넣지 마.' }],
    check: ['빠진 할 일이 없는가'],
    extend: ['웹앱으로 만들어 팀이 함께 쓰기'],
  },
  {
    id: 'portfolio',
    title: '나를 소개하는 포트폴리오 사이트',
    area: '일·업무',
    kind: '웹페이지',
    sessions: [3, 5, 6, 15],
    level: '입문',
    minutes: 40,
    situation: '이 과정에서 만든 것들을 한곳에 모아 보여 주고 싶다.',
    five: { purpose: '내가 만든 것 소개', input: '자기소개, 만든 서비스 3개와 링크', output: '깔끔한 한 장 포트폴리오', rules: '연락처는 이메일만', verify: '모든 링크가 열리는지' },
    steps: [{ title: '만들기', prompt: '내가 만든 서비스들을 소개하는 포트폴리오 페이지를 만들어줘. 서비스마다 한 줄 설명, 화면 캡처 자리, 링크. 깔끔하고 단정하게.' }],
    check: ['모든 링크가 열리는가'],
    extend: ['15회 발표 자료로 활용'],
  },
];

export const getExample = (id: string) => examples.find((e) => e.id === id);
