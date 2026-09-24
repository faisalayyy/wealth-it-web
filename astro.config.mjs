// @ts-check
import { defineConfig } from 'astro/config';

/** Static, multipage, and no JavaScript unless a page asks for some.
 *
 *  `output: 'static'` is Astro's default and is named here anyway, because it is the whole point
 *  of the choice: every page is HTML on disk by the time a browser sees it. The app's argument
 *  is that nothing leaves your phone; a site that ships a runtime and three trackers to say so
 *  would be arguing against itself.
 *
 *  `site` + `base` are the GitHub Pages project URL — the site is served from a subdirectory,
 *  `https://faisalayyy.github.io/wealth-it-web/`, not from a root. Every internal link therefore
 *  goes through `url()` in `src/site.ts` rather than being written as `/features/` by hand. On
 *  the day there is a real domain: set `site` to it, delete `base`, add a `public/CNAME`, and
 *  `url()` quietly becomes the identity function.
 */
export default defineConfig({
  output: 'static',
  site: 'https://faisalayyy.github.io',
  base: '/wealth-it-web',
  build: {
    format: 'directory',
    /* Astro inlines a small stylesheet into the HTML by default. The brand's @font-face rules
     * reach the font files by a path relative to the stylesheet, which is how they stay correct
     * under any `base` — and which stops being true the moment the stylesheet is not a file. */
    inlineStylesheets: 'never',
  },
});
