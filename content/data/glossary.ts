export type Term = { id: string; term: string; en?: string; def: string; analogy?: string; session?: number };

export const glossary: Term[] = [
  // 1회
  { id: 'gen-ai', term: '생성형 AI', en: 'Generative AI', def: '글·그림·코드처럼 새로운 결과물을 만들어 내는 AI.', analogy: '말귀를 알아듣는 만능 조수', session: 1 },
  { id: 'llm', term: 'LLM', en: 'Large Language Model', def: '엄청난 양의 글로 학습해 사람처럼 글을 읽고 쓰는 AI 모델. Claude도 LLM이다.', session: 1 },
  { id: 'claude', term: 'Claude', def: 'Anthropic이 만든 AI. 웹·데스크톱·휴대폰 앱에서 대화로 쓴다.', session: 1 },
  { id: 'claude-code', term: 'Claude Code', def: '내 컴퓨터 폴더에서 파일을 읽고 만들고 실행하며 프로그램을 만드는 Claude. 데스크톱 앱의 Code 탭에서 쓴다.', analogy: '옆자리의 유능한 개발자 동료', session: 1 },
  { id: 'agent', term: '에이전트', en: 'Agent', def: '스스로 계획하고, 도구를 쓰고, 결과를 확인하며 일을 끝까지 하는 AI.', analogy: '답만 주는 상담원이 아니라 일을 끝내는 담당자', session: 1 },
  { id: 'vibe-coding', term: '바이브 코딩', en: 'Vibe coding', def: '코드를 직접 쓰지 않고 말로 설명해 AI가 소프트웨어를 만들게 하는 방식.', session: 1 },
  { id: 'agentic-engineering', term: '에이전틱 엔지니어링', en: 'Agentic engineering', def: 'AI 에이전트가 만들고, 사람은 요구사항을 정하고 계획을 검토하고 결과를 검증하는 일하는 방식.', session: 1 },
  { id: 'hallucination', term: '환각', en: 'Hallucination', def: 'AI가 사실이 아닌 내용을 그럴듯하게 지어내는 현상.', session: 1 },
  { id: 'prompt', term: '프롬프트', en: 'Prompt', def: 'AI에게 주는 지시문.', analogy: '일을 맡길 때 쓰는 메모', session: 1 },
  // 2회
  { id: 'mockup', term: '목업', en: 'Mockup', def: '실제로 만들기 전에 화면이 어떻게 생길지 보여 주는 시안.', analogy: '집 짓기 전의 모형', session: 2 },
  { id: 'artifact', term: '아티팩트', en: 'Artifact', def: 'Claude 대화창 옆에 만들어지는 결과물(문서, 화면, 작은 앱). 눌러 보고 고칠 수 있다.', session: 2 },
  { id: 'mvp', term: 'MVP', en: 'Minimum Viable Product', def: '꼭 필요한 기능만 넣은 첫 버전. 빨리 만들어 써 보고 고치기 위해 만든다.', session: 2 },
  { id: 'context', term: '컨텍스트', en: 'Context', def: 'AI가 지금 대화에서 기억하고 있는 내용 전체. 너무 길어지면 앞부분을 덜 정확하게 기억한다.', session: 2 },
  // 3회
  { id: 'browser', term: '브라우저', def: '웹페이지를 보여 주는 프로그램. 크롬, 엣지, 사파리 등.', session: 3 },
  { id: 'html', term: 'HTML', def: '웹페이지의 내용과 뼈대를 적는 언어.', analogy: '집의 뼈대와 방 배치', session: 3 },
  { id: 'css', term: 'CSS', def: '웹페이지의 색, 글꼴, 배치를 꾸미는 언어.', analogy: '벽지와 가구', session: 3 },
  { id: 'javascript', term: 'JavaScript', def: '웹페이지를 움직이게 하는 프로그래밍 언어. 버튼을 누르면 일어나는 일을 정한다.', analogy: '전기와 스위치', session: 3 },
  { id: 'plan-mode', term: '플랜 모드', en: 'Plan mode', def: '파일을 고치지 않고 계획만 세우는 Claude Code의 모드.', session: 3 },
  { id: 'terminal', term: '터미널', def: '글자로 명령을 입력해 컴퓨터를 다루는 창. 이 과정에서는 거의 Claude Code가 대신 쓴다.', session: 3 },
  // 4회
  { id: 'web-app', term: '웹앱', def: '브라우저에서 돌아가지만 로그인·저장 등 앱처럼 동작하는 웹사이트.', session: 4 },
  { id: 'framework', term: '프레임워크', def: '프로그램의 기본 뼈대와 규칙을 미리 갖춘 도구 모음.', analogy: '조립식 가구의 기본 틀', session: 4 },
  { id: 'react', term: 'React', def: '화면을 작은 부품(컴포넌트)으로 나눠 만드는 방식. Next.js와 Expo 모두 React를 쓴다.', session: 4 },
  { id: 'component', term: '컴포넌트', def: '버튼, 카드처럼 화면을 이루는 재사용 가능한 부품.', analogy: '레고 블록', session: 4 },
  { id: 'nextjs', term: 'Next.js', def: 'React로 웹앱을 만드는 대표 프레임워크.', session: 4 },
  { id: 'nodejs', term: 'Node.js', def: '내 컴퓨터에서 JavaScript 프로그램을 실행하게 해 주는 도구. 웹앱 개발에 필요하다.', session: 4 },
  { id: 'localhost', term: 'localhost', def: '내 컴퓨터에서만 열리는 시험용 주소.', session: 4 },
  { id: 'claude-md', term: 'CLAUDE.md', def: '프로젝트 폴더에 두는 규칙 메모. Claude가 대화를 시작할 때마다 읽는다.', session: 4 },
  // 5회
  { id: 'git', term: 'Git', def: '파일이 바뀐 기록을 남기고 되돌릴 수 있게 해 주는 도구.', session: 5 },
  { id: 'repository', term: '저장소', en: 'Repository', def: 'Git이 기록을 남기는 프로젝트 폴더.', session: 5 },
  { id: 'commit', term: '커밋', en: 'Commit', def: '지금 상태를 메모와 함께 저장한 세이브 포인트.', analogy: '게임 세이브', session: 5 },
  { id: 'push', term: '푸시', en: 'Push', def: '내 컴퓨터의 커밋 기록을 GitHub에 올리는 것.', session: 5 },
  { id: 'github', term: 'GitHub', def: 'Git 저장소를 인터넷에 보관하고 공유하는 서비스.', session: 5 },
  { id: 'gitignore', term: '.gitignore', def: 'Git에 올리지 않을 파일 목록. 비밀번호·키 파일을 꼭 넣는다.', session: 5 },
  // 6회
  { id: 'server', term: '서버', def: '다른 사람의 요청을 받아 웹페이지나 데이터를 보내 주는 컴퓨터.', analogy: '24시간 문 여는 가게', session: 6 },
  { id: 'hosting', term: '호스팅', def: '내 웹앱을 서버에 올려 인터넷에서 열리게 해 주는 서비스.', session: 6 },
  { id: 'deploy', term: '배포', en: 'Deploy', def: '만든 것을 서버에 올려 누구나 주소로 쓸 수 있게 하는 것.', session: 6 },
  { id: 'domain', term: '도메인', def: '웹사이트 주소(예: my-moim.vercel.app).', analogy: '가게 간판의 주소', session: 6 },
  { id: 'vercel', term: 'Vercel', def: 'GitHub 저장소를 연결하면 웹앱을 자동으로 배포해 주는 서비스.', session: 6 },
  { id: 'build', term: '빌드', def: '작성한 코드를 실제로 실행할 수 있는 형태로 만드는 과정.', session: 6 },
  // 7회
  { id: 'database', term: '데이터베이스', def: '여러 사람과 프로그램이 동시에 읽고 쓰는 데이터 저장소.', analogy: '똑똑한 공유 엑셀', session: 7 },
  { id: 'table', term: '테이블', def: '데이터베이스 안의 표. 엑셀의 시트.', session: 7 },
  { id: 'column', term: '컬럼', def: '테이블의 열. 엑셀의 열 제목.', session: 7 },
  { id: 'row', term: '행', def: '테이블의 한 줄. 데이터 1건.', session: 7 },
  { id: 'sql', term: 'SQL', def: '데이터베이스에 표를 만들고 데이터를 조회·수정하는 언어.', session: 7 },
  { id: 'supabase', term: 'Supabase', def: '데이터베이스·로그인·파일 저장을 함께 제공하는 서비스. 웹과 앱에서 같이 쓸 수 있다.', session: 7 },
  // 8회
  { id: 'auth', term: '인증', en: 'Authentication', def: '"당신이 누구인가"를 확인하는 것. 로그인.', session: 8 },
  { id: 'authorization', term: '권한', en: 'Authorization', def: '"당신이 무엇을 할 수 있는가"를 정하는 것.', session: 8 },
  { id: 'rls', term: 'RLS', en: 'Row Level Security', def: '행 수준 보안. 누가 어떤 데이터를 보고 고칠 수 있는지 정하는 데이터베이스 규칙.', analogy: '방마다 다른 열쇠', session: 8 },
  { id: 'env', term: '환경변수', def: '비밀번호·키처럼 코드에 적으면 안 되는 값을 따로 보관하는 칸.', analogy: '금고', session: 8 },
  { id: 'anon-key', term: '공개 키', en: 'anon / publishable key', def: '화면이나 앱에 들어가도 되는 Supabase 키. RLS 규칙 안에서만 동작한다.', session: 8 },
  { id: 'service-key', term: '비밀 키', en: 'service_role / secret key', def: '모든 권한을 가진 키. 서버에만 두고 절대 화면·앱에 넣지 않는다.', session: 8 },
  // 9회
  { id: 'relation', term: '관계', def: '테이블끼리 연결된 것. 예: 모임 하나에 참석 신청 여러 개.', session: 9 },
  { id: 'storage', term: '스토리지', def: '사진·파일을 저장하는 공간.', session: 9 },
  { id: 'bug', term: '버그', def: '프로그램이 의도와 다르게 동작하는 문제.', session: 9 },
  // 10회
  { id: 'api', term: 'API', def: '프로그램끼리 정해진 방식으로 요청하고 답을 주고받는 창구.', analogy: '식당의 주문 창구', session: 10 },
  { id: 'api-key', term: 'API 키', def: 'API를 쓸 수 있게 해 주는 비밀 열쇠. 노출되면 남이 내 돈으로 쓸 수 있다.', session: 10 },
  { id: 'token', term: '토큰', def: 'AI가 글을 처리하는 단위. 요금은 읽고 쓴 토큰 수로 계산된다.', session: 10 },
  { id: 'prompt-injection', term: '프롬프트 인젝션', def: '붙여 넣은 글이나 웹페이지에 숨긴 문장으로 AI를 조종하려는 공격.', session: 10 },
  // 11회
  { id: 'native-app', term: '네이티브 앱', def: '앱스토어·플레이스토어에서 받아 설치하는 앱.', session: 11 },
  { id: 'pwa', term: 'PWA', en: 'Progressive Web App', def: '홈 화면에 설치해 앱처럼 쓰는 웹앱. 스토어 없이 배포한다.', session: 11 },
  { id: 'manifest', term: '웹 앱 매니페스트', def: 'PWA의 이름·아이콘·색을 적어 두는 설정 파일.', session: 11 },
  // 12회
  { id: 'react-native', term: 'React Native', def: 'React 방식으로 iOS·안드로이드 앱을 한 번에 만드는 기술.', session: 12 },
  { id: 'expo', term: 'Expo', def: 'React Native 앱을 쉽게 만들고 빌드·배포까지 돕는 도구 모음. React Native 공식 문서가 새 앱 시작에 권하는 방법이다.', session: 12 },
  { id: 'expo-go', term: 'Expo Go', def: '만들고 있는 앱을 내 휴대폰에서 바로 열어 보는 시험용 앱.', session: 12 },
  { id: 'cross-platform', term: '크로스플랫폼', def: '코드 하나로 여러 기기(iOS, 안드로이드, 웹)에서 돌아가게 만드는 방식.', session: 12 },
  // 14회
  { id: 'eas', term: 'EAS', en: 'Expo Application Services', def: 'Expo의 클라우드 서비스. 앱 빌드(Build), 스토어 제출(Submit), 업데이트(Update)를 해 준다.', session: 14 },
  { id: 'store-review', term: '스토어 심사', def: '앱을 스토어에 올리기 전 애플·구글이 규칙에 맞는지 검토하는 과정.', session: 14 },
  { id: 'privacy-policy', term: '개인정보처리방침', def: '앱이 어떤 개인정보를 왜 모으고 어떻게 다루는지 알리는 문서. 스토어 등록에 필요하다.', session: 14 },
  { id: 'ota', term: 'OTA 업데이트', en: 'Over-the-air', def: '스토어 심사 없이 앱의 화면·로직 일부를 바로 고쳐 내보내는 방식 (EAS Update).', session: 14 },
  // 15회
  { id: 'feedback', term: '사용자 피드백', def: '쓰는 사람의 의견과 불편. 다음 개선의 가장 좋은 재료.', session: 15 },
  { id: 'analytics', term: '분석', en: 'Analytics', def: '몇 명이 언제 어떤 기능을 쓰는지 숫자로 보는 것.', session: 15 },
];

export const getTerm = (id: string) => glossary.find((t) => t.id === id);
