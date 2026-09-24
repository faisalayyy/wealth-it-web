# Wealth-it — website

This repo is the **marketing and support site** for the Wealth-it app. It is not the app.

- **The app** is the sibling folder, `../app` → `github.com/faisalayyy/wealth-it` (private).
  Work on it happens in its own Claude Code session. Do not edit it from here — the two share a
  parent folder for tidiness and nothing else. The parent is not a repository and there is no
  build step that reaches across.
- **This repo** is `github.com/faisalayyy/wealth-it-web` (private).

## Stack

Astro 5, static output, plain CSS. **No UI framework and no client-side JavaScript** unless a
page genuinely needs some — and a marketing page almost never does. The product's argument is
that nothing leaves your phone; a site that ships a runtime and a pile of trackers to say so is
arguing against itself.

- `src/pages/*.astro` — one file, one URL. That is the multipage.
- `src/layouts/Base.astro` — the shell: head, metadata, stylesheets, header, footer, a slot.
- `src/components/` — Header, Footer, Wordmark, Icon, StoreLinks, PhoneMock. Six, and each one
  earns its place by being used on more than one page or by being too big to sit in a page.
- `src/site.ts` — the facts every page repeats, and the two store links that do not exist yet.
- `src/styles/tokens.css` — the brand, transcribed from the app.
- `src/styles/base.css` — reset and typographic floor. Not design.
- `src/styles/site.css` — the design layer: `@font-face`, the web type scale, the shapes.
- `scripts/` — the two asset generators. Nothing runs at build time that is not Astro.

```bash
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

## The brand is copied, not shared

`src/styles/tokens.css` is a hand transcription of `src/theme/tokens.ts` in the app repo, and the
reasoning behind every value is in the app's `docs/DESIGN_SYSTEM.md`. Sharing a package between a
React Native app and a static site would mean build tooling in both places to share about forty
values that change twice a year. When the app's palette moves, move it here by hand and say so in
the commit message.

Two rules survive the port and matter more than the rest:

1. **The lime is a fill, never text.** Type uses the `--*-t` variants, which darken in light mode,
   because a colour that reads as a fill on near-black is unreadable as type on paper.
2. **Hierarchy comes from size, weight, colour and space — in that order.** Weight is the last
   resort, not the first.

## Voice

The same voice as the app, settled in its `A170`: written for the person reading it, in the words
they would use, with a light touch where one fits and nowhere else. Plain over clever, concrete
over abstract. Not a comedy site, and not a bank either. **No fintech register** — no
"empower your financial journey", no "seamless", no "unlock".

## Things that are true about the product, and worth not getting wrong

- Everything is stored on the device. No account, no sign-in, no server, no analytics, no sync.
- There is no support inbox and no password reset, because there is nothing to reset.
- A backup file is the only copy that survives a lost phone.
- Currency conversion never invents a rate: it uses the user's own cross-currency transfers or
  the published AED/USD peg, and anything it cannot convert honestly is left out and named.

## Two things the site does that are easy to undo by accident

**Nothing is loaded from anywhere else.** The font is self-hosted from `public/fonts` (subset to
Latin, four weights, 46 KB), there is no analytics, no tag manager and no consent banner to
apologise for one. A site whose argument is that nothing leaves your phone cannot open by asking
Google for a typeface. If something new needs a third-party request, it needs a conversation
first.

**No download link exists yet.** `stores.ios` and `stores.android` in `src/site.ts` are `null`
and every call to action renders *"Not in the stores yet"*. Do not replace that with a button
that goes nowhere, a mailing list or a badge that implies a listing. Set the two values on the
day the builds are accepted and every CTA becomes a real one.

## Claims about the product are load-bearing

The privacy page is a promise, not a landing page — every line of it describes the app as built.
If the app gains a network call, an analytics SDK or a sync feature, `/privacy/` changes in the
same commit or the site is lying. The same goes for `/features/`, which lists what is *not*
built on purpose; that section is the reason the rest of the page is believable.

## Where it is published

GitHub Pages, at **https://faisalayyy.github.io/wealth-it-web/**, built by
`.github/workflows/deploy.yml` on every push to `main`. The repo is public so that Pages will
serve it; the app repo is not.

Because it is served from a subdirectory, **every internal link goes through `url()` in
`src/site.ts`** — a bare `/features/` renders fine in `npm run dev` and 404s in production.
Font, favicon and OG paths go through it too. The README has the three-edit path to a real
domain, on the day there is one.

## Not yet decided

- The domain. The github.io path is a place to live, not a decision.
- The icon. The app's own is still the Expo placeholder, so the wordmark glyph and the favicon
  are a rising line — the drawing the app already makes on every account card. Both are
  stand-ins, in two files, and neither is an identity.
