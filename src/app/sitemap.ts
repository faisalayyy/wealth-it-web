import type { MetadataRoute } from 'next';
import { featurePages } from '@/lib/features';
import { pageUrl } from '@/lib/seo';

export const dynamic = 'force-static';

/** Every published page (About is not published yet: src/app/_about). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '/', priority: 1 },
    { path: '/features/', priority: 0.9 },
    ...featurePages.map(f => ({ path: `/features/${f.slug}/`, priority: 0.8 })),
    { path: '/support/', priority: 0.6 },
    { path: '/privacy/', priority: 0.5 },
  ];
  return pages.map(p => ({ url: pageUrl(p.path), changeFrequency: 'monthly', priority: p.priority }));
}
