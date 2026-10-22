import type { ReactNode } from 'react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';

/** 데이터 기반 페이지용 공통 껍데기 (DocsLayout 안에서 같은 모양) */
export function PageShell({
  title,
  description,
  children,
  full = true,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <DocsPage full={full} toc={[]}>
      <DocsTitle>{title}</DocsTitle>
      {description && <DocsDescription>{description}</DocsDescription>}
      <DocsBody>{children}</DocsBody>
    </DocsPage>
  );
}
