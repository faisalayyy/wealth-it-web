import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { SmoothScroll } from '@/animation/SmoothScroll';
import { PageTransition } from '@/components/PageTransition';
import { SiteHeader } from '@/components/SiteHeader';
import { asset, basePath, site } from '@/lib/site';
import '@/styles/system.css';

/**
 * The type: Plus Jakarta Sans, the app's own face (App/src/theme/type.tsx) and the wordmark's
 * (App/brand/README.md), as one variable file (SIL OFL), served from this site.
 */
const font = localFont({
  src: [{ path: '../fonts/plus-jakarta-sans-latin-wght-normal.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font',
  display: 'swap',
  preload: true,
});

const url = `${site.origin}${basePath}/`;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: site.title, template: '%s — Wealthit' },
  description: site.description,
  icons: {
    icon: [
      { url: asset('/favicon.svg'), type: 'image/svg+xml' },
      { url: asset('/favicon-32.png'), type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: asset('/apple-touch-icon.png'), sizes: '180x180' }],
  },
  openGraph: { type: 'website', url, siteName: site.name, title: site.title, description: site.description },
};

export const viewport: Viewport = { themeColor: '#F7F6F1', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        <SmoothScroll>
          <SiteHeader />
          {children}
          <PageTransition />
        </SmoothScroll>
      </body>
    </html>
  );
}
