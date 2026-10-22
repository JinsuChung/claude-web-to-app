export const simMeta = {
  'chat-vs-agent': { title: '챗봇 vs 에이전트', session: 1 },
  'agent-loop': { title: '에이전트 루프와 권한 승인', session: 3 },
  'commit-timeline': { title: '커밋 타임라인', session: 5 },
  'deploy-pipeline': { title: '배포 파이프라인', session: 6 },
  rls: { title: 'RLS(행 수준 보안)', session: 8 },
  keys: { title: '공개 키 vs 비밀 키', session: 8 },
  injection: { title: '프롬프트 인젝션', session: 10 },
} as const;

export type SimName = keyof typeof simMeta;
