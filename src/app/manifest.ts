import type { MetadataRoute } from 'next';
import { asset, site } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: asset('/'),
    display: 'browser',
    background_color: '#0d0f0e',
    theme_color: '#0d0f0e',
    icons: [
      { src: asset('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
      { src: asset('/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
