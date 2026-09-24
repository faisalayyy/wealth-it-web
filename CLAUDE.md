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
- `src/layouts/Base.astro` — the shell: head, metadata, stylesheets, a slot.
- `src/styles/tokens.css` — the brand, transcribed from the app.
- `src/styles/base.css` — reset and typographic floor. Not design.

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

## Not yet decided

- The domain. `astro.config.mjs` has a placeholder `site:` — canonical URLs and OG tags read it.
- The host. Cloudflare Pages or Netlify; both connect to the repo and build on push to `main`.
- Everything about the design. The scaffold deliberately has no header, no footer and no
  components — Faisal will say what the site should contain before any of that is decided.
