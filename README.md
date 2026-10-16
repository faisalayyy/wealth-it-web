# Wealth-it — website

The marketing and support site for Wealth-it, a personal finance app that keeps its ledger on your
phone. The homepage recreates jeton.com's experience — structure, rhythm, type scale, motion — with
Wealth-it's content and real screens captured from the app.

- **Live:** https://faisalayyy.github.io/wealth-it-web/
- **App repo:** https://github.com/faisalayyy/wealth-it (private), the sibling folder `../App`
- **Stack:** Next.js 16 (static export), React 19, GSAP + ScrollTrigger + SplitText, Lenis,
  Three.js, Matter.js

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in out/
```

## Docs

| File | What it covers |
| --- | --- |
| [CLAUDE.md](CLAUDE.md) | How the site is put together and the rules that keep it honest |
| [docs/REFERENCE_SPEC.md](docs/REFERENCE_SPEC.md) | The reference, measured: grid, type, timelines, easings |
| [docs/MAPPING.md](docs/MAPPING.md) | Which Wealth-it content fills each reference section |
| [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) | Capturing new screens from the app |

## On the day the app ships

Set `stores.ios` and `stores.android` in `src/lib/site.ts`. Every "Coming soon" control becomes a
real link. Replace `contactEmail` there too before submitting to the stores.

## A domain

Stop setting `PAGES_BASE_PATH` in `.github/workflows/deploy.yml` and change `site.origin` in
`src/lib/site.ts`. Nothing else refers to the path.
