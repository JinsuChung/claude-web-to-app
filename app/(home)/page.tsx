import Link from 'next/link';
import { ArrowRight, ClipboardCopy, Presentation, ListChecks, MousePointerClick, MessageSquareText, Code2, Globe, Database, Sparkles, Smartphone } from 'lucide-react';
import { ContinueButton, CourseMap } from '@/components/home/home-client';
import { SiteUrl } from '@/components/home/site-url';
import { ClassBoard } from '@/components/class/class-board';
import { PromptCard } from '@/components/prompt/prompt-card';
import { examples } from '@/content/data/examples';
import { prompts } from '@/content/data/prompts';
import { phases, sessions } from '@/content/data/sessions';
import { appTitleLarge, appTitleSmall, instructor } from '@/lib/shared';

const featuredPrompts = ['idea-interview', 'mockup-artifact', 'next-from-mockup', 'expo-start'];
const featuredExamples = ['moim-service', 'cafe-menu', 'household-book', 'medicine-reminder', 'study-quiz', 'walk-tracker'];

const flow = [
  { icon: MessageSquareText, t: '기획', d: 'Claude와 대화로 기획서와 목업', n: '1–2회' },
  { icon: Code2, t: '웹앱', d: 'Claude Code가 목업을 진짜 웹앱으로', n: '3–5회' },
  { icon: Globe, t: '공개', d: 'GitHub에 저장, Vercel로 내 주소', n: '6회' },
  { icon: Database, t: '데이터', d: 'Supabase로 저장, 로그인, 보안', n: '7–9회' },
  { icon: Sparkles, t: 'AI 기능', d: '내 서비스 안에서 일하는 Claude', n: '10회' },
  { icon: Smartphone, t: '앱', d: 'PWA와 Expo로 휴대폰 앱까지', n: '11–15회' },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-[#14123a] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 size-[36rem] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 65%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
            코딩 처음이어도 괜찮아요 · 2시간 × {sessions.length}회
          </p>
          <h1 className="mt-6">
            <span className="block text-xl font-semibold tracking-[-0.03em] text-white/75 sm:text-2xl">{appTitleSmall}</span>
            <span className="mt-2 block text-4xl font-bold leading-[1.2] tracking-[-0.045em] sm:text-6xl">
              가장 효율적으로
              <br />
              <span className="bg-gradient-to-r from-[#67e8f9] to-white bg-clip-text text-transparent">웹에서 앱까지</span>
            </span>
            <span className="sr-only">{appTitleLarge}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            아이디어를 Claude와 대화로 기획하고, Claude Code로 웹앱을 만들고, 데이터베이스와 AI를 붙여 휴대폰 앱까지. 요즘 업계가 실제로 일하는 방식을
            처음부터 차근차근 따라 합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sessions/1"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#14123a] transition-transform hover:-translate-y-0.5"
            >
              1회 시작하기 <ArrowRight className="size-4" />
            </Link>
            <ContinueButton />
            <Link href="/start" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white/90 hover:text-white">
              과정 소개와 준비물
            </Link>
          </div>
          <SiteUrl />
          <p className="mt-6 text-sm text-white/60">강의 · {instructor}</p>
        </div>
      </section>

      {/* 한 서비스가 자라는 흐름 */}
      <section className="border-b bg-fd-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">서비스 하나가 웹에서 앱까지 자라는 15회</h2>
          <p className="mt-1 text-fd-muted-foreground">
            동네 독서 모임 &ldquo;우리 모임&rdquo; 서비스 하나를 처음부터 끝까지 키웁니다. 매 회가 지난 회의 결과물 위에 쌓여요.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {flow.map(({ icon: Icon, t, d, n }, i) => (
              <li key={t} className="relative rounded-2xl border bg-fd-background p-4">
                <span className="flex items-center justify-between">
                  <Icon className="size-5" style={{ color: phases[i].color }} />
                  <span className="text-xs font-semibold tabular-nums text-fd-muted-foreground">{n}</span>
                </span>
                <p className="mt-3 font-bold">{t}</p>
                <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 우리 반 진행 현황 */}
      <ClassBoard />

      {/* 과정 지도 */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{sessions.length}회 과정 지도</h2>
            <p className="mt-1 text-fd-muted-foreground">한 회는 2시간. 실습을 체크하면 진도가 차오릅니다.</p>
          </div>
          <Link href="/start" className="text-sm font-medium text-fd-primary hover:underline">
            사전 준비 체크리스트 →
          </Link>
        </div>
        <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {phases.map((p) => (
            <li key={p.key} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: p.color }} aria-hidden />
              <span className="font-semibold">{p.label}</span>
              <span className="text-fd-muted-foreground">{p.range}</span>
            </li>
          ))}
        </ul>
        <CourseMap />
      </section>

      {/* 사용법 */}
      <section className="border-y bg-fd-muted/50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: ClipboardCopy, t: '복사해서 바로', d: '모든 프롬프트에 복사 버튼. 주황색 빈칸을 채우면 내 아이디어에 맞게 바뀝니다.' },
            { icon: MousePointerClick, t: '눌러 보며 이해', d: '에이전트, 커밋, 배포, 보안을 시뮬레이터로 직접 체험합니다.' },
            { icon: ListChecks, t: '혼자서도 끝까지', d: '단계마다 예상 결과와 "막혔을 때" 도움말. 진도는 브라우저에 저장돼요.' },
            { icon: Presentation, t: '함께 보는 발표 모드', d: 'P 키 하나로 큰 글씨 슬라이드, 실습 타이머, 페이지 QR 코드.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border bg-fd-background p-5">
              <Icon className="size-6 text-fd-primary" />
              <p className="mt-3 font-bold">{t}</p>
              <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 바로 쓰는 프롬프트 */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">바로 쓰는 프롬프트</h2>
          <Link href="/prompts" className="text-sm font-medium text-fd-primary hover:underline">
            {prompts.length}개 모두 보기 →
          </Link>
        </div>
        <div className="grid gap-x-5 lg:grid-cols-2">
          {featuredPrompts.map((id) => (
            <PromptCard key={id} id={id} compact />
          ))}
        </div>
      </section>

      {/* 아이디어 갤러리 */}
      <section className="border-t bg-fd-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">이런 것도 만들 수 있어요</h2>
              <p className="mt-1 text-fd-muted-foreground">모임, 가게, 생활, 배움, 가족, 일 — 과정에서 배운 것으로 바로 만들어 볼 아이디어</p>
            </div>
            <Link href="/examples" className="text-sm font-medium text-fd-primary hover:underline">
              {examples.length}개 모두 보기 →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredExamples.map((id) => {
              const e = examples.find((x) => x.id === id)!;
              return (
                <Link key={id} href={`/examples/${id}`} className="rounded-2xl border bg-fd-background p-5 transition-colors hover:border-fd-primary">
                  <span className="text-xs font-medium text-fd-muted-foreground">
                    {e.area} · {e.kind} · {e.sessions.map((n) => `${n}회`).join(', ')}
                  </span>
                  <p className="mt-1.5 font-bold leading-6">{e.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-fd-muted-foreground">{e.situation}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-8 text-sm text-fd-muted-foreground sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.svg" alt="" className="size-7" />
          <span>
            {appTitleSmall} {appTitleLarge} · {instructor}
          </span>
          <span className="ml-auto">실습 자료는 모두 교육용 가상 데이터입니다.</span>
        </div>
      </footer>
    </main>
  );
}
