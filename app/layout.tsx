import type { Metadata, Viewport } from 'next';
import { Provider } from '@/components/provider';
import { appDescription, appName, siteUrl } from '@/lib/shared';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: appName, template: `%s · ${appName}` },
  description: appDescription,
  openGraph: {
    title: appName,
    description: appDescription,
    locale: 'ko_KR',
    type: 'website',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1117' },
  ],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
