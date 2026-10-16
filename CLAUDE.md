# Wealthit — website

The marketing and support site for the Wealthit app. **Not the app**: that is the sibling folder
`../App` (`github.com/faisalayyy/wealth-it`, private), worked on in its own session. Never edit it
from here — read it, nothing more. The web app is `../WebApp`, also its own session.

The name is **Wealthit** — one word, no hyphen (the app's decision A377). The repo is still called
`wealth-it-web`; that is only its name.

## What this site is

Two references, chosen by the owner, to be recreated rather than reinterpreted, carrying
Wealthit's brand, copy and real app screens:

- **The homepage, Features, the feature pages, Help, Privacy and 404** follow **butter.video**
  (studied 16 October 2026): floating header pills, a 3D keyring hero, a pinned statement,
  blur-reveal stories, a growing app window, feature cards, tabs, a gallery rail, a double block, a
  style picker, FAQ, a closing panel and the wordmark footer on the homepage; butter's product page
  for Features and each feature page; its contact page for Help. The map is
  `docs/BUTTER_REFERENCE.md`.
- **`/about/`** follows **jeton.com/about** section for section — `docs/ABOUT_SPEC.md`,
  `docs/REFERENCE_SPEC.md`. Its structure and the slab animation were approved; only colours,
  font and name follow the brand.

Before changing a section, read its reference doc. Prefer matching the reference over improving on it.

## Stack

Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript, CSS Modules on one global
design-system file, GSAP 3.15 (ScrollTrigger, SplitText) + Lenis, Three.js with cannon-es physics
for the hero keyring, Three.js for the About slabs.

```bash
npm run dev       # http://localhost:4321
npm run check     # tsc
npm run build     # → out/, for https://wealthit.app (the domain's root)
npm run screens   # the iOS session's captures → public/screens (docs/SCREENSHOTS.md)
scripts/videos.sh # its recordings → public/videos
node scripts/compose.mjs   # photographs, with the app on the phones → public/people
```

- `src/app/` — `/`, `/features/` and `/features/<slug>/` (six, from `src/lib/features.ts`),
  `/support/` (Help), `/privacy/`, 404; `_about/` is About, kept unpublished (see below). The layout renders `SiteHeader` and
  `PageTransition`; every page ends in `Closing` (#get) and `SiteFooter`.
- `src/sections/home/` — the homepage sections. `Story.tsx` exports `Words`, the sentence with
  pieces of the app set inline (a piece never starts a line), used by the statement and stories.
  `Faq` takes its own questions and is reused by Help.
- `src/sections/product/` — the butter product-page parts: `PageHero`, `Rows`, `Facts`, `Bands`,
  `NextFeature`, `Switcher` (the floating section pill).
- `src/sections/help/`, `src/sections/about/` — Help's hero and form; the Jeton About parts.
- `src/components/` — SiteHeader (Features menu with captures; butter's two dots: the pill folds to
  name + dots on scroll, the dots open the large menu at any scroll; Log in, Get the app), SiteFooter,
  Button (character roll; tones `brand` Emerald, `ink`, `neutral` Ivory on dark), AppButtons, Logo
  and Mark, Coin (`coined()`), Phone, Screen/Cut/Crop, Shot (renders any `Media`), Icon, and the
  Jeton blocks About uses.
- `src/three/` — `stage.ts` and the scenes `keyring` (hero; every split ring, chain link and charm
  is a cannon-es body on ball joints; charms collide; the pointer pushes them) and `slabs` (About).
- `src/styles/system.css` — the grid, spacing and type scale, then the brand tokens (`--forest`,
  `--gold`, `--emerald`, `--mint`, `--ivory`, `--night`, roles `--brand`/`--brand-deep`), the
  neutrals and classes (`.wrap`, `.display-1/2`, `.statement`, `.story`, `.lead`, `.cap`, `.coin`).
- `src/lib/site.ts` — facts, `stores` and `webApp` (both `null`), contact address.
  `src/lib/features.ts` — every feature page's copy. `src/lib/brand.ts` — the mark's geometry and
  the chart colours. `src/lib/screens.json` — every capture, cut and crop.
- The first (Jeton) homepage and its chrome were removed on 16 October 2026; they are in commit
  `f7b07f0` under `legacy/` if ever wanted.

## Rules that are easy to break

- **Real app UI only.** Every product image is one of the iOS session's captures or recordings
  (`~/Movies/Wealthit Website`, from TestFlight build 14), or a rectangle cut from one — or, where a
  simulator can't show it (Tap to Record), a rectangle cut from the App Store poster drawn from the
  app's real code. Never draw app UI in HTML, never retouch a capture. The app is shown mostly in
  dark. New screens or recordings: ask the iOS session; `docs/SCREENSHOTS.md`.
- **Photographs** (`media-src/people`, credited in `CREDITS.md`) are models, not users: the app
  may be composited onto a phone in a hand or over a shoulder, never into a smiling face's hands,
  and no caption makes anyone say anything (the Pexels licence: don't imply endorsement).
- **The brand is the app's** (`App/brand/README.md`, `App/src/ui/brandMark.ts`). The mark is two
  leaves and a gold coin: leaves Emerald `#0D7443` on light, Mint `#4CC38A` on dark; the coin is
  always Gold `#F2C66D`. In the name, "Wealth" is Night (Ivory on dark) and "it" is Emerald (Mint
  on dark). Buttons are Emerald with white text; big brand panels are Forest `#0E3B30` with Ivory
  text. Headlines end on the gold-coin full stop — `coined('…')`.
- **Words** (`App/docs/marketing/app-store-campaign.md`): plain and specific. Never "smart",
  "effortless", "seamless", "all in one" or "take control", no exclamation marks, and never "it
  never leaves your phone" — records sync to the account.
- **No invented facts.** No user counts, reviews, partners, certifications, prices or social
  links (the Instagram is not posted yet). Where butter shows client logos the homepage shows the
  26 countries whose money the app keeps (flags from flag-icons, MIT). No Pricing or Blog page until
  there is a price or a post.
- **Not in the stores yet.** The iPhone app is in TestFlight; Android is planned. `stores` stays
  `null`; AppButtons say "Coming soon" / "Later on" and are not links.
- **The web app is not deployed.** `webApp` stays `null`; "Log in" says "Soon" until then. One URL
  serves log in and sign up (its root shows sign-in). Say only what it does: same account, records
  in step with the phone; not budgets, goals, schedules or wallet editing yet.
- **Privacy claims are load-bearing.** `/privacy/` and Help are the app session's text (11 October
  2026): an account (email, Google, Apple), records synced to Wealthit's server in Frankfurt
  (Render + Neon), receipt photos, profile picture and PIN only on the phone, open.er-api.com for
  rates, no tracking/ads/analytics, delete with a 60-day grace. If the app changes, these change the
  same day. The app links to `/privacy/` and `/support/` — never move them.
- **Nothing loaded from elsewhere.** Fonts, captures and 3D are all served from this site.
- **Type.** Plus Jakarta Sans (OFL), the app's own face, one variable file in `src/fonts`.
- **Base path.** Served from the root of https://wealthit.app, so there is none — but raw
  `src`/`href` strings still go through `asset()` in `src/lib/site.ts`, so a copy can be built into
  a subdirectory with `PAGES_BASE_PATH`.

## Before it goes live

`/about/` is **placeholder**: the team, the story, the dates, the place and the quote in
`src/lib/about.ts` were invented at the owner's request (27 September 2026) and are not true. The
owner chose to keep it off the live site until it is real (16 October 2026): the route lives in the
private folder `src/app/_about` (not built), its photo in `unpublished/about`, and it is not linked
from the header, menu or footer. To publish it, follow the note at the top of `src/app/_about/page.tsx`.

## Where it is published

**https://wealthit.app**, by GitHub Pages (repo `faisalayyy/wealth-it-web`, custom domain set in
its Pages settings), built by `.github/workflows/deploy.yml` on every push to `main`. The old
address, faisalayyy.github.io/wealth-it-web/, redirects there — the app's links to `/privacy/` and
`/support/` keep working. DNS is on Cloudflare: the apex has GitHub Pages' A/AAAA records and `www`
a CNAME to `faisalayyy.github.io`, all DNS-only (grey cloud); the Zoho MX/SPF records are email —
leave them alone.

## Housekeeping

The project sits in an iCloud-synced folder. iCloud evicts files ("dataless"), which makes the dev
server and builds hang: `node_modules` and `.next` are links to `*.nosync` folders, raw captures
live in `screens-raw.nosync/`, and evicted files come back with `brctl download`. **`npm install`
replaces the `node_modules` link with a real folder** — move it back to `node_modules.nosync` and
re-link afterwards. iCloud has also recreated deleted files as "name 2" conflict copies; they are
not part of the site.
