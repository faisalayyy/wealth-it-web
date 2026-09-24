/**
 * The sitemap, built from the pages that exist rather than from a dependency.
 *
 * `@astrojs/sitemap` would do this too, and would be another package to keep current for four
 * URLs. When there are forty, swap it in.
 */
import type { APIRoute } from 'astro';
import { url } from '../site';

const paths = ['/', '/features/', '/privacy/', '/support/'];

export const GET: APIRoute = ({ site }) => {
  const urls = paths
    .map(p => `  <url><loc>${new URL(url(p), site)}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
