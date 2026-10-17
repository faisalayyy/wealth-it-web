import type { Metadata } from 'next';
import { asset, basePath, seo, site } from './site';

/** The page's address on the live site, with the trailing slash the export uses. */
export const pageUrl = (path: string) => `${site.origin}${basePath}${path}`;

/**
 * A page's title, description, canonical address and link preview. Next replaces a parent's
 * `openGraph` rather than merging it, so every page gives the whole of it, image included.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const image = { url: asset('/og.png'), width: 1200, height: 630, alt: seo.ogAlt };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', url: pageUrl(path), siteName: site.name, locale: 'en', title: `${title} | ${site.name}`, description, images: [image] },
    twitter: { card: 'summary_large_image', title: `${title} | ${site.name}`, description, images: [image.url] },
  };
}

/** Structured data for search engines, as a <script type="application/ld+json">. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

/** The app itself (schema.org MobileApplication). No price, rating or download count: none exist yet. */
export const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: site.name,
  description: site.description,
  url: pageUrl('/'),
  operatingSystem: 'iOS',
  applicationCategory: 'FinanceApplication',
  inLanguage: 'en',
  publisher: { '@id': `${site.origin}/#organization` },
  image: `${site.origin}${asset('/og.png')}`,
};

/** Questions and answers as schema.org FAQPage. */
export const faqSchema = (items: { q: string; a: string | string[] }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(i => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: Array.isArray(i.a) ? i.a.join(' ') : i.a },
  })),
});

/** Where a page sits: Home › Features › the page. */
export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: pageUrl(t.path) })),
});
