// @ts-check
import { defineConfig } from 'astro/config';

/** Static, multipage, and no JavaScript unless a page asks for some.
 *
 *  `output: 'static'` is Astro's default and is named here anyway, because it is the whole point
 *  of the choice: every page is HTML on disk by the time a browser sees it. The app's argument
 *  is that nothing leaves your phone; a site that ships a runtime and three trackers to say so
 *  would be arguing against itself.
 *
 *  `site` is the canonical origin. Sitemaps, RSS and OG tags are all built from it, so it has to
 *  be the real domain before launch — the placeholder below is a reminder, not a decision. */
export default defineConfig({
  output: 'static',
  site: 'https://example.com',
  build: { format: 'directory' },
});
