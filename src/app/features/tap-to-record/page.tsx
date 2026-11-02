import type { Metadata } from 'next';
import Link from 'next/link';
import { asset } from '@/lib/site';
import { pageUrl } from '@/lib/seo';

/**
 * Tap to Record's old address. Its page is now Record as you pay (24 October 2026), which carries
 * Tap to Record and bank messages together. GitHub Pages can't redirect, so this page sends the
 * browser on at once and tells search engines where the page lives now.
 */
const TO = '/features/record-as-you-pay/';

export const metadata: Metadata = {
  title: 'Record as you pay',
  robots: { index: false, follow: true },
  alternates: { canonical: pageUrl(TO) },
};

export default function TapToRecordMoved() {
  return (
    <div className="page">
      <meta httpEquiv="refresh" content={`0; url=${asset(TO)}`} />
      <main id="main" className="wrap" style={{ padding: '30vh 0' }}>
        <p className="lead">
          Tap to Record now lives on <Link href={TO}>Record as you pay</Link>.
        </p>
      </main>
    </div>
  );
}
