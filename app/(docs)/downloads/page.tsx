import type { Metadata } from 'next';
import { Download, FileArchive, FileText, GitBranch } from 'lucide-react';
import { Callout } from 'fumadocs-ui/components/callout';
import { PageShell } from '@/components/ui/page-shell';
import { ProgressTransfer } from '@/components/library/progress-transfer';
import { gitConfig } from '@/lib/shared';

export const metadata: Metadata = { title: '자료실', description: '실습 자료, 템플릿, 진도 옮기기.' };

const files = [
  { name: '우리 모임 시작 자료 (전체 묶음)', file: '/downloads/our-moim-starter.zip', desc: '기획서 템플릿, CLAUDE.md 템플릿(웹·앱), 가상 모임 일정 20건, 가상 회원 12명, 후기 모음, 숨은 지시문 메모, 출시 체크리스트', icon: FileArchive },
  { name: '기획서 템플릿', file: '/downloads/planning-template.md', desc: '2회 실습용 빈 양식. 메모장으로 열거나 Claude에게 첨부하세요', icon: FileText },
  { name: '가상 모임 일정 (CSV)', file: '/downloads/meetups-sample.csv', desc: '7회 데이터베이스 실습용 20건. 엑셀에서 열어도 한글이 깨지지 않아요', icon: FileText },
  { name: '출시 체크리스트', file: '/downloads/release-checklist.md', desc: '14회 스토어 등록 준비물 점검표', icon: FileText },
];

export default function Page() {
  return (
    <PageShell title="자료실" description="실습 자료는 모두 교육용 가상 데이터입니다. 실제 기관·인물과 관계없습니다." full={false}>
      <div className="not-prose grid gap-3">
        {files.map((f) => {
          const Icon = f.icon;
          return (
            <a
              key={f.file}
              href={f.file}
              download
              className="flex items-center gap-4 rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
                <Icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{f.name}</span>
                <span className="block text-sm text-fd-muted-foreground">{f.desc}</span>
              </span>
              <Download className="size-4 text-fd-muted-foreground" />
            </a>
          );
        })}
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
            <GitBranch className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">이 사이트의 소스 (GitHub)</span>
            <span className="block text-sm text-fd-muted-foreground">이 강의 사이트도 Claude Code로 만들었습니다. 복제해서 직접 고쳐 보세요.</span>
          </span>
        </a>
      </div>

      <Callout type="info" title="압축 풀기 (Windows)">
        zip 파일을 오른쪽 클릭 → <b>모두 압축 풀기</b>를 누르세요. 한국어 Windows 기본 압축 풀기에서 한글 파일명이 깨지지 않게 만들었고, 반디집·7-Zip·macOS에서도 정상으로 보입니다. 압축을 푼 폴더를 Claude Code에서 열면 됩니다. zip 안에서 파일을 바로 열지 말고 꼭 압축을 먼저 푸세요.
      </Callout>

      <h2 id="진도-옮기기">진도 옮기기</h2>
      <p>진도는 이 브라우저에만 저장됩니다. 다른 PC나 브라우저로 옮기려면 코드를 복사해 그쪽에서 붙여 넣으세요.</p>
      <ProgressTransfer />
    </PageShell>
  );
}
