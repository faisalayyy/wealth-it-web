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
node scripts/compose.mjs   # photographs, with the app on the iPhones → public/people
node scripts/tap.mjs       # Tap to Record's Lock Screen card, from the App Store poster's source
node scripts/og.mjs        # the link preview, public/og.png
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
  name + dots on scroll, the dots open the large menu at any scroll, its rows with 3D pieces from
  `src/three/art.ts`, and Instagram; the theme switch, Log in, Get the app), PageTransition (a soft
  fade and lift between pages, with a thin line along the top), SiteFooter (with
  Socials), ThemeSwitch, TapPhone (the Lock Screen with Tap to Record's card arriving),
  Button (character roll; tones `brand` lime with ink text, `ink`, `neutral` Blade White on dark),
  AppButtons, Logo and Mark (the blades), Stop (`fullStop()`), Phone, Screen/Cut/Crop, Shot (renders
  any `Media`), Icon, and the Jeton blocks About uses.
- `src/three/` — `stage.ts` and the scenes `keyring` (hero; every split ring, chain link and charm
  is a cannon-es body on ball joints; charms collide; the pointer pushes them) and `slabs` (About);
  `blades.ts` makes the mark's blades solid, for the keyring and `art.ts`.
- `src/styles/system.css` — the grid, spacing and type scale, then the brand tokens (`--lime`,
  `--lime-text`, `--night`, `--blade-white`, `--ink`, `--paper`, roles `--brand`/`--brand-deep`/
  `--brand-text`/`--stop`, the Liquid's lights `--l-*` and `--liquid`), the neutrals and classes
  (`.wrap`, `.display-1/2`, `.statement`, `.story`, `.lead`, `.cap`, `.stop`).
- **Two themes.** Dark is the default (the owner wants the site mostly dark), light is a switch in
  the header, kept per visitor and set before the first paint (`layout.tsx`). Colours on the page go
  through the neutral tokens (`--n-50`… `--n-ink`, `--n-text`, `--n-cap`, `--n-line`, `--n-tint`,
  `--surface`, `--panel`), redefined under `[data-theme='dark']`; never a literal ink or white. Every
  `-dark` capture and crop has a `-light` twin that `Screen`/`Crop` show in the light theme
  (`exact` keeps one fixed); the two recordings with a light version follow too (`src/lib/theme.ts`).
- **SEO**: `src/lib/seo.tsx` (`pageMeta` for every page's title, description, canonical and
  preview; JSON-LD for the organisation, the app, FAQs and breadcrumbs), `sitemap.ts`, `robots.ts`,
  `manifest.ts`, `public/og.png`.
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
  and no caption makes anyone say anything (the Pexels licence: don't imply endorsement). The owner's
  rules (17 October 2026): people from many places, not only the Gulf; every woman shown wears a
  hijab; and new photographs are shown to the owner, composited, before they go on the site.
- **The brand is the app's** (`App/brand/README.md`, `App/src/ui/brandMark.ts`, since 21 October
  2026, A417 to A423). The mark is Faisal's three blades, each a step higher: the first is always
  Lime `#77C41B`, the other two Night `#0B0B0C` on light and Blade White `#F3F3F3` on dark
  (`src/lib/brand.ts` draws them from the app's figures; never redraw or recolour them). In the name,
  "Wealth" is Night (Blade White on dark) and "it" is the lime on every ground. Buttons are the lime
  with ink `#111111` text; green text on light is Lime Text `#008317`, the lime on dark; the light
  page is Paper `#F5F5F3`, the dark page Night. Big brand panels are Night lit by the app's Liquid
  (the four lights behind the top of Home: lime, forest, teal, olive) with Blade White text. The
  icon is the tile: the blades over Night (`public/favicon.svg`, `apple-touch-icon.png`,
  `icon-512.png`, copied from `App/brand/favicon`). Headlines end on the lime full stop,
  `fullStop('…')`, as the App Store posters do. The leaves, the gold coin, Forest, Emerald, Mint
  and Ivory are the old brand: none of them on the site.
- **Words** (`App/docs/marketing/app-store-campaign.md`): plain and specific. Never "smart",
  "effortless", "seamless", "all in one" or "take control", no exclamation marks, and never "it
  never leaves your phone" (records sync to the account). The owner wants nothing that reads as
  machine-written: no em or en dashes in anything visible, no "not X, but Y", no rhythm-for-its-own-
  sake triads or stacked fragments. The voice (17 October 2026): professional and warm, about small
  habits for a better future, with a light Gen Z touch at most once a section ("minus the
  spreadsheet energy", "future you will thank you"); never in legal or help answers.
- **No invented facts.** No user counts, reviews, partners, certifications or prices. Social links
  only for accounts that exist (`socials` in `src/lib/site.ts`: Instagram @wealthitapp, the app's
  own, App/docs/marketing/instagram). Where butter shows client logos the homepage shows the
  26 countries whose money the app keeps (flags from flag-icons, MIT). No Pricing or Blog page until
  there is a price or a post.
- **Tap to Record** (App/docs/TAP_TO_RECORD.md) is a main feature: its own page, a homepage
  section and one of the two large tiles in the features bento. It works with Apple Pay and is set
  up once; never promise it on Android. After a payment the Lock Screen card says Change and Save
  (A436); a shop it hasn't seen offers two categories to pick (A438). Its Lock Screen card can't be
  captured on a simulator: `scripts/tap.mjs` renders the App Store poster 03's own HTML, card only
  (`media-src/app`), and the till photograph carries it (`compose.mjs`).
- **Not in the stores yet.** `stores` stays `null`; both AppButtons say "Coming soon" and are not
  links.
- **No platform names in the copy** (the owner, 17 October 2026): Wealthit is for iPhone, Android
  and the web, and the site never says which: no "for iPhone", "Android to follow" or "on the App
  Store". Tap to Record still says it works with Apple Pay, because that is how it works; it is
  never promised for Android.
- **The web app is at https://dashboard.wealthit.app** (`webApp`; ../WebApp, published through the
  wealthit-dashboard-site repository). "Log in" and "Open Wealthit on the web" go there. One URL
  serves log in and sign up (its root shows sign-in). Say only what it does: same account, records
  in step with the phone.
- **Privacy claims are load-bearing.** `/privacy/` and Help started as the app session's text (11
  October 2026) and were checked against Apple's 5.1.1 and Google Play's user data and account
  deletion rules on 17 October 2026, from the app's code and notes: an account (email, Google,
  Apple), records synced to Wealthit's server in Frankfurt (Render + Neon, a six-hour restore
  window on Neon's free plan), receipt photos, profile picture and PIN only on the phone,
  open.er-api.com for rates, Resend for sign-in email, Zoho Mail for support email, Vercel for the
  design service and the owner's admin page (counts and dates only, never what records say), IP
  addresses only in memory for sign-in limits, no tracking or ads, Wealthit runs no analytics (on
  Android, Google's ML Kit receipt reader sends Google its own diagnostics; the policy says so), delete with a 60-day
  grace (or at once by email, `/privacy/#delete-account`). The app's
  `docs/PRIVACY_POLICY_DRAFT.md` should be brought in line. If the app changes, these change the
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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
