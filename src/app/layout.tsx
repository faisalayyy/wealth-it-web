import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { SmoothScroll } from '@/animation/SmoothScroll';
import { PageTransition } from '@/components/PageTransition';
import { SiteHeader } from '@/components/SiteHeader';
import { asset, basePath, contactEmail, seo, site, socials } from '@/lib/site';
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
  title: { default: site.title, template: '%s | Wealthit' },
  description: site.description,
  applicationName: site.name,
  keywords: seo.keywords,
  category: 'finance',
  creator: site.name,
  publisher: site.name,
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  icons: {
    icon: [
      { url: asset('/favicon.svg'), type: 'image/svg+xml' },
      { url: asset('/favicon-32.png'), type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: asset('/apple-touch-icon.png'), sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    url,
    siteName: site.name,
    locale: 'en',
    title: site.title,
    description: site.description,
    images: [{ url: asset('/og.png'), width: 1200, height: 630, alt: seo.ogAlt }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [asset('/og.png')] },
  other: { 'apple-mobile-web-app-title': site.name },
};

export const viewport: Viewport = { themeColor: '#0b0b0c', colorScheme: 'dark light', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

/**
 * Dark is the default theme; a visitor who chose light (the switch in the header) gets it before the
 * first paint, so the page never flashes from one to the other.
 */
const THEME = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==='light'?'#f5f5f3':'#0b0b0c'}}catch(e){}`;

/** Who publishes the site, for search engines (schema.org). Only facts that are true today. */
const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.origin}/#organization`,
      name: site.name,
      url: `${site.origin}/`,
      logo: `${site.origin}${asset('/apple-touch-icon.png')}`,
      email: contactEmail,
      sameAs: socials.map(s => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: site.name,
      url: `${site.origin}/`,
      inLanguage: 'en',
      publisher: { '@id': `${site.origin}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={font.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />
      </head>
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
