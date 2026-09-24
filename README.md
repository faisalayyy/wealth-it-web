# Wealth-it — website

The marketing and support site for the Wealth-it app. Static, multipage, and it ships no
client-side JavaScript at all — `grep -c '<script' dist/**/*.html` returns zero on every page.

- **App repo:** https://github.com/faisalayyy/wealth-it (private), the sibling folder `../app`
- **Stack:** [Astro](https://astro.build) 5, plain CSS, no framework runtime
- **Live at:** https://faisalayyy.github.io/wealth-it-web/
- **Host:** GitHub Pages, built by `.github/workflows/deploy.yml` on every push to `main`

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve the built site
npm run check    # astro check
```

## The pages

| URL | What it is |
| --- | --- |
| `/` | The argument: the four questions the app answers, what is in it, where the data lives, and what it deliberately does not do |
| `/features/` | The long version, one section per area — including the three things that are not built |
| `/privacy/` | The privacy policy, and the URL App Store Connect asks for |
| `/support/` | Twelve answers and an address, and the other URL App Store Connect asks for |
| `/404` · `/sitemap.xml` · `/robots.txt` | The furniture |

## How it is put together

```
src/site.ts              name, description, store links, contact address — the facts pages repeat
src/layouts/Base.astro   head, metadata, stylesheets, header, footer, slot
src/components/          Header, Footer, Wordmark, Icon, StoreLinks, PhoneMock
src/pages/*.astro        one file, one URL
src/styles/tokens.css    the brand, transcribed by hand from the app's src/theme/tokens.ts
src/styles/base.css      reset and typographic floor — not design
src/styles/site.css      the design layer: @font-face, the web type scale, the shapes
public/fonts/            Plus Jakarta Sans, subset to Latin, four weights, 46 KB in total
scripts/                 the two generators below
```

**`PhoneMock.astro`** is the dashboard drawn as one inline SVG on the app's own 390×844 stage,
not a screenshot: it costs a few kilobytes, needs no request, and follows the reader into dark
mode. When there are screenshots of a real build, they replace it.

**Store links do not exist yet.** `stores.ios` and `stores.android` in `src/site.ts` are `null`,
and every call-to-action on the site renders "Not in the stores yet" until they are not. Setting
those two values turns every CTA into a download button.

## Regenerating the assets

Both need Python with `fonttools` and `brotli`; the OG script also uses the `sharp` that comes
with Astro, so there is nothing else to install.

```bash
python3 scripts/make-fonts.py   # public/fonts/*.woff2, from the app's font package
python3 scripts/make-og.py      # public/og.png, with the type converted to outlines
```

## Deploying

Push to `main`. The workflow runs `npm ci`, `npm run check` and `npm run build`, then hands
`dist/` to Pages; the whole thing takes about a minute. Nothing else is needed and there is no
other environment.

The site is served from a subdirectory, `/wealth-it-web/`, so **every internal link goes through
`url()` in `src/site.ts`** rather than being written as `/features/` by hand. A bare root path
in a new page will look fine in the browser pane and 404 in production.

## Moving to a real domain

Three edits, and `url()` quietly becomes the identity function:

1. `astro.config.mjs` — set `site` to the domain and delete `base`
2. `public/CNAME` — one line, the domain (create it)
3. `public/robots.txt` — the `Sitemap:` line, which names the origin by hand

Then point the DNS at GitHub Pages and set the custom domain in the repo's Pages settings.

## Before launch

- [ ] A domain of its own — see above. Until then the canonical URLs are the github.io path
- [ ] Put a real address in `contactEmail` (`src/site.ts`); it appears on privacy and support
- [ ] Read `/privacy/` end to end and confirm every claim still matches the app
- [ ] Replace the favicon and the wordmark glyph when the app has an icon of its own — the
      current `favicon.png` is still the Expo placeholder
- [ ] Set `stores.ios` / `stores.android` once the builds are accepted
- [x] Privacy page · Support page · OG image
