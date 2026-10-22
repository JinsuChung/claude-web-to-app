# 클로드 & 클로드 코드로 가장 효율적으로 웹에서 앱까지

코딩을 처음 배우는 사람을 위한 2시간 × 15회 실습 과정 사이트입니다.
Claude와 Claude Code로 아이디어를 기획서와 목업으로 만들고, 웹앱을 만들어 공개하고, 데이터베이스와 AI를 붙여 휴대폰 앱까지 만듭니다.
수업 중에는 함께 보며 따라 하고, 수업 뒤에는 혼자 예습·복습할 수 있습니다.

- 강의: 코그니랩스 정진수
- 사이트: https://claude-web-to-app.vercel.app
- 기술: Next.js 16 + Fumadocs + MDX, Vercel 배포 (참여 현황은 Vercel Blob)

## 과정 구성

| 단계 | 회 | 내용 |
| --- | --- | --- |
| 시작하기 | 1–3 | 요즘 흐름, Claude로 기획서·목업, Claude Code로 첫 웹페이지 |
| 웹앱 만들기 | 4–6 | Next.js 웹앱, Git·GitHub, Vercel 배포 |
| 데이터와 로그인 | 7–9 | Supabase, 로그인과 보안(RLS), 기능 완성 |
| AI 기능 | 10 | Claude API로 후기 요약·안내문 초안 |
| 앱으로 | 11–14 | PWA, Expo 앱, 앱 + 데이터, EAS 빌드와 출시 준비 |
| 마무리 | 15 | 운영, 발표, 다음 단계 |

## 로컬에서 실행

```bash
pnpm install
pnpm dev
```

참여 현황판(별명 + PIN)을 로컬에서 쓰려면 `.env.local`에 `BLOB_READ_WRITE_TOKEN`이 필요합니다. 없으면 현황판만 비활성화되고 나머지는 그대로 동작합니다.

## 콘텐츠 고치기

| 고칠 것 | 파일 |
| --- | --- |
| 회 본문 | `content/docs/sessions/*.mdx` |
| 회 목록·목표 | `content/data/sessions.ts` |
| 프롬프트 라이브러리 | `content/data/prompts.ts`, `content/data/parts/prompts-*.ts` |
| 퀴즈 | `content/data/parts/quiz-*.ts` |
| 아이디어 갤러리 | `content/data/examples.ts` |
| 용어사전 / FAQ | `content/data/glossary.ts`, `content/data/faq.ts` |
| 요금·버전 등 바뀌는 정보 | `content/data/facts.ts` |
| 자료실 파일 다시 만들기 | `python3 scripts/make-materials.py` |

`main` 브랜치에 푸시하면 Vercel이 자동으로 다시 배포합니다.

실습 데이터는 모두 교육용 가상 데이터입니다.
