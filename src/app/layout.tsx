import type { Metadata, Viewport } from 'next';
import { display } from './fonts';
import { Shell } from '@/components/chrome/Shell';
import { site } from '@/lib/content';
import { asset } from '@/lib/asset';
import './globals.css';

const url = 'https://faisalayyy.github.io/wealth-it-web';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url,
    images: [{ url: asset('/og.png'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [asset('/og.png')] },
  icons: { icon: [{ url: asset('/favicon.svg'), type: 'image/svg+xml' }], apple: asset('/favicon.png') },
};

export const viewport: Viewport = {
  themeColor: '#070908',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
