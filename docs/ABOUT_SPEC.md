# The About page, measured

Taken from jeton.com/about on 27 September 2026 at 1440 × 900: the DOM, the stylesheets and the
components' own code. `/about/` rebuilds it section for section; only the content changes. The
content map is at the bottom.

Spacing tokens below are the reference's fluid pairs: `--186-64` is 186px at 1700 wide and 64px at
390, linear between (`clamp(min, min − slope·390 + slope·100vw, max)`, slope = (max − min) / 1310).

## Order

| # | Section | Reference class | Height at 1440 |
| - | --- | --- | --- |
| 1 | Header | `_common-header` | 100svh |
| 2 | Mission | `_jeton-mission mt-186-64 mb-60-16` | 1908 |
| 3 | Product | `_jeton-product color-white pb-60-16` (brand ground) | 3735 |
| 4 | Values | `_jeton-values color-white background-orange overflow-hidden` | 1391 |
| 5 | Awards & Certifications | `_certifications-list color-orange py-180-64` | 786 |
| 6 | Careers | `_medium-hero relative py-grid-margin` (tone orange) | 627 |
| 7 | Closing | `_extra-bold-hero` — the homepage's | 870 |
| 8 | Footer | the homepage's | |
| — | Contact drawer | `_drawer` > `.drawer-modal`, opened by the header's button | |

## 1 · Header

The homepage's CommonHeader, unchanged: title-2 -medium in xxl-8 / md-9 / sm-12 / xs-16, the
right column xxl-4 offset-3 (md-6 offset-1, sm-8, xs-16) with subhead-2 -medium and one CTA,
`primary` `neutral` (white), mt-32. Same char intro, same background scale 1.1 and yPercent 0 → 15
scrub, same scroll hint. The background is a 9s looping video of five vertical fluted-glass panels
(≈25 / 17.5 / 18.25 / 17.5 / 21.75 % wide) with light drifting through them; the About page draws
it in CSS.

## 2 · Mission

- g-row → col xxl-9 md-12 sm-14 xs-16, flex column gap 16: Tag (brand, motion), h2 title-3 -medium.
- g-row → col xxl-6 md-8 sm-10 xs-16, subhead-2 -medium, mt-32: the paragraph(s), `p` margin-bottom 16.
- Full-bleed media, `w-full mt-96-32 overflow-hidden`, 4000 × 2667; parallax −0.2.
- `article.secondary-block g-row mt-64`: h3 title-5 -medium in xxl-6 md-8 sm-10 xs-16; beside it a
  col xxl-6 offset-3 (md-7 offset-1, sm-10, xs-16) holding body -book mb-32 text and a media
  `mt-180-48 overflow-hidden`, 2712 × 1696; parallax −0.022. ≤1023 the text gets mt-24; ≤743 the
  media is 10/16 wide, pushed right.
- Text colour is the brand's text colour on white.

**Parallax** (the reference's `v-parallax`): value v → `fromTo(el, {y: vh(v·100)}, {y: vh(−v·100)})`,
ease none, trigger the parent, start `top+=from bottom`, end `bottom+=to top`, scrub true,
invalidateOnRefresh; skipped on touch.

## 3 · Product

Ground: the brand fill; text on it.

- `g-row justify-center pt-80-64`: a small image in xxl-2 md-3 sm-4 xs-6.
- `g-row justify-center text-center mt-120-64` → xxl-10 sm-12 xs-16: Tag (motion), h2 title-3 xs-title-4 -medium mt-16.
- `g-row justify-center text-center mt-32-24` → xxl-8 md-10 sm-12 xs-16: p subhead-2 -medium.
- `g-row justify-center mt-48`: CTAs, flex gap 24, variant outline.
- `g-row justify-center mt-180-64 pb-64` → `ul.stats` flex wrap justify-between, xxl-14 sm-16,
  text-center; li: value subhead-2 xs-title-5 -medium, label body -book. ≤743 two per row, gap 48 0.
- **Scroll stack** (`_scroll-stack`, method `transform`, not on touch):
  `--margin: clamp(8px, 7.415px + 0.15vw, 10px)`, `--border-radius: 20px`; height = views × 100vh;
  `.views-slot` sticky at top margin, 100vh − 2 margins tall, full width minus 2 margins, radius 20,
  overflow hidden. Views absolutely stacked, z-index = length − index, backgrounds alternating a
  lighter and a slightly lighter brand tone (#f96853 / #fa8270 on the reference).
  One ScrollTrigger over the stack (`top bottom` → `bottom top`); each view's local progress
  `(p − i/(n+1)) · (n+1)`; offset ` = f(s) · view height`, translated up, with
  `first: clamp(s − 1)`, `last: clamp(s + .2, 0, 2) · .025`, others
  `.025·c(s) + lerp(.025·c(s), c(s − 1), (s/2)²)` where c clamps to 0..1. A view is live between
  s = −0.3 and 2.3.
  View chrome: bottom-left name, 12px, padding 1.33em, index in a 2em outlined circle, opacity .65.
- **Feature articles** (`g-table`, a 16-column grid; padding-top clamp(32px, 12.929px + 4.89vw, 96px),
  bottom 32; ≤1290 padding = grid margin; ≤1023 a column, padding margin + 1 col; ≤743 32):
  - `text`: title (h3 title-4 -medium) cols 3–8; description (subhead-2 -book) row 2 cols 3–8, mt
    clamp(16, 1.83vw…, 40), mb 48; figure 1 rows 1–3 cols 10–16 (≤1290 9–17, ≤1023 344px tall);
    figure 2 row 3 cols 1–2, height max(36.6px, 36.6px + 8.79vw), hidden ≤1290; text (body -book
    opacity .65) row 3 cols 3–6.
  - `list`: title cols 3–8 (grid-area 1/3/span 6); description row 1 cols 9–14; figure row 2 cols
    3–7; list row 2 cols 9–14, items separated by a 1px line, padding/margin clamp(16, …, 24),
    header = index "01." (1 col) + h4 subhead-2 xs-body -book + a plus icon (mobile accordion),
    text body -book opacity .65 indented 1 col. figure/list mt max(23.2px, 23.2px + 1.69vw).
  - Figures: absolute, object-cover, radius 12-8.

## 4 · Values

Brand ground, `overflow-hidden`.

- `g-row justify-end pt-108-64 mb-144-32` → xxl-8 md-9 sm-12: Tag (motion), h2 title-3 xs-subhead-1 -medium mt-16.
- per value `article.g-row.py-32.relative`: from the second on, a divider (absolute, left at the
  grid margin, top 0, opacity .2); h3 xxl-8 md-7 sm-16 mb-8 = index span (subhead-2 -medium,
  2 cols wide, 4 ≤1023) + title span (title-5 xs-subhead-2 -medium); p xxl-8 md-9 sm-12 sm-offset-4
  xs-12 xs-offset-4 subhead-2 xs-body -book.
- Active value: a ScrollTrigger per article, `top center` → `bottom center`, sets it active; leaving
  clears it except for the first and last. Inactive articles' children at opacity .5, 0.3s.
- `g-row justify-end pt-108-64 pb-60-16` → xxl-8 md-9 sm-12: quote card (px-16 py-16 radius 16,
  a 10% light fill), blockquote opacity .7, then avatar (initials) + name + role (opacity .65),
  flex gap 8, mt-16. It rises in once: `from {y: 40vh, scale .85, opacity 0}`, 1.2s expo, when its
  row's top meets the viewport's bottom; not on touch.

## 5 · Awards & Certifications

`py-180-64`, brand text colour on white.
- `g-row mb-64`: left col xxl-7 offset-1 (xs-16): Tag, h2 title-5 xs-subhead-1 -medium mt-16,
  p body -book mt-16 with padding-right one column; right `ul` xxl-6 offset-1 (xs-16) opacity .65
  mt-48, li `py-16 relative`, from the second on a 1px divider in the brand fill, h3 body -book.

## 6 · Careers (MediumHero, tone orange)

`section py-grid-margin` on white → `g-row-full flex column items-center gap-16 text-center
py-136-64 br-40-20` in the brand fill: Tag (motion), h2 title-3 xs-title-4 -medium, p subhead-2
-medium mt-16-8 pre-line w-cols-8 (xs 14), CTA `primary` in the neutral tone, mt-16-8.

## Contact drawer

`._drawer` fixed, 100lvh, z 99. Shade black at .5, 0.7s. Modal white, radius 16, top/right 8,
height 100svh − 16, width 8 columns + margin − 8 (10 ≤1290, 14 ≤1023, full ≤743); transition
transform 0.6s in, 0.4s cubic-bezier(.55,.085,.68,.53) out to translateX(120%) (translateY ≤743);
the whole drawer fades to opacity 0 1s after closing. Header: title subhead-1 xs-subhead-2 -medium,
close button (secondary), padding 32-16, a 1px rule under it. Form padding 32-16, gap 10: inputs
with a floating label (label at 1em/1em, opacity .5, scales to .625 and up .5em when filled or
focused, 0.2s), field padding 1.5em .625em .5em 1em, radius 1em, a 5% brand tint (10% on hover),
focus ring 1px + 3px at 50%. Phone field has a dial-code button beside it. Send: primary, full width,
at the bottom.

## Content map (Wealth-it)

| Reference | Wealth-it | Why it is true |
| --- | --- | --- |
| "Your money. Your way." / "Let's connect" | "Your money, / made clear." / "Get in touch" | the app's first question is where you stand |
| Mission photos | real captures, set in panels | no photographs of people exist to use |
| Product stats 1M+ users, 27 countries, 50+ methods | 8 currencies, 6 kinds of wallet, 58 subcategories | the app's constants |
| Three product views (exchange, money management, payments) | currencies, the three kinds of record, budgets and schedules | shipped features |
| Values: For you, Accessible, Transparent + CEO quote | Honest, Plain, Yours + a line from the app's own README | no person is quoted |
| Awards & Certifications | the rules the money follows | the README's rules, each one tested |
| Careers / spontaneous application | Feedback / write to us | the site's contact address |
| Contact form that posts to a server | the same form, which opens your mail app with the message filled in | the site sends nothing anywhere |
