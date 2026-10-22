import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { PresentController } from '@/components/present/present';
import { SidebarProgress } from '@/components/progress/sidebar-progress';
import { LastVisitTracker } from '@/components/progress/last-visit';

export default function Layout({ children }: LayoutProps<'/'>) {
  const base = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      links={[]}
      sidebar={{ banner: <SidebarProgress key="progress" />, collapsible: true }}
    >
      {children}
      <PresentController />
      <LastVisitTracker />
    </DocsLayout>
  );
}
