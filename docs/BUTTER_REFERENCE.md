# The homepage, after butter.video

The homepage's second design. butter.video was studied live on 16 October 2026 at 1440 × 900 and
375 × 812: its sections, DOM, computed styles and scroll behaviour. Its fonts (Die Grotesk, ABC
Diatype) are commercial, so the site keeps its own Inter; its 3D, videos, logos and copy are its
own and none of them are used. What is carried over is the structure, the rhythm and the kinds of
interaction. Interactions that could not be inspected directly (the hero's physics, exact easing)
are rebuilt by eye and say so in the code.

## The reference, section by section (1440 wide, ≈14,300 px)

| # | Section | Height | Purpose | Layout and type | Motion and interaction |
| - | --- | --- | --- | --- | --- |
| 0 | Header | 88 | way around, sign-up | two floating pills on the page: left (logo + Product▾, Blocks▾, Templates, Pricing, Blog) and right (#EDEDED, radius 16, 60 tall: Login + a dark "Try for free", radius 10, 39 tall). Mobile: one pill, logo + menu button | dropdown panels open down out of the left pill (#EDEDED, rows split by hairlines) |
| 1 | Hero | 900 | what it is, one CTA | grey gradient #D6D6D6 → #FAFAFA; centred h1 108 px, weight 400, line-height .99; one line under it; dark CTA, radius 16, 50 tall | a full-screen WebGL canvas: a keyring of 3D charms hanging from the top edge, swinging |
| 2 | Ticker | 220 | credibility | 13 px muted caption over a row of client logos | logos drift sideways in a loop |
| 3 | Statement | 1800 (pinned) | the idea in one sentence | a centred 50 px sentence with small rounded thumbnails set inline between words | words darken one after another as you scroll; then the thumbnails fly down into a dark editor timeline that rises from below |
| 4 | Story one | 1346 | a capability | 13 px caption + a 44 px statement on the left; a dark rounded app panel (a library grid) on the right | the statement sharpens out of a blur word by word; the panel's content scrolls past at its own pace |
| 5 | Story two | 813 | a capability | mirrored: dark editor panel left, caption + statement with small inline icons right | the same blur reveal |
| 6 | Story three | 1800 (pinned) | the product as a whole | statement left, a dark app window right | the window grows until it nearly fills the screen |
| 7 | Feature cards | 994 | everything, at a glance | caption + h2 + "View all features" pill; four cards (radius ≈16) with media, a label and two lines | media loops; cards are links |
| 8 | Create in 3 ways | 986 | three ways in | a large rounded media card left; caption, a big title and a line right | three tabs (Remix / Describe / Code) swap the media and the copy |
| 9 | Gallery | 958 | breadth | caption + centred h2; a big rounded grey panel holding a horizontal row of cards in mixed shapes, each named and labelled; a dark "Browse all" pill | the row scrolls sideways; hovering a card plays it |
| 10 | Create more, faster | 921 | speed | statement left; a large white rounded media panel right | media plays |
| 11 | Double block | 999 | two big claims | two equal grey cards (radius ≈24): title + round arrow button, media, a line | the arrows are links ("Learn more about …") |
| 12 | Get the look | 986 | style | a dark media card left; a list of names in two tones right, a strip of thumbnails, a pill | choosing a name swaps the media |
| 13 | Footer | 1127 | way out | the page ends in a white sheet with rounded bottom corners over a #EDEDED footer: link columns (Explore, Socials, Resources, Legal), a giant wordmark with a coloured shadow, the legal line | — |

Colours: ink #0F0F0F, captions at 40 % ink, surfaces #FAFAFA / #EDEDED, product panels near-black.
Body 18 px. Radii 10 (small buttons), 16 (pills, cards, CTAs), ≈24 (big panels).

## Wealthit, section by section

Every product image is one of the app's own captures (docs/SCREENSHOTS.md); every fact is the
app's (App/docs/product.json, its decisions and its privacy text). No client logos, testimonials,
user numbers or prices exist, so none are shown.

| # | Reference | Wealthit | Media | Interaction |
| - | --- | --- | --- | --- |
| 0 | Header | Wealthit ▾Features (six feature pages, each with a capture, and All features), About, Help, Privacy, and two dots; right pill: Log in (Soon until the web app has an address) and Get the app | the menu's thumbnails: the spending ring, the team, the mark, a lock | as butter: scrolled, the links fade and the pill folds to the name and the dots (pointer or focus widens it again); the dots, at the top or scrolled, widen the pill to "Close ⁚", dim the page and open a panel of four large rows (description on hover, rules drawing across) and the feature pages small beneath — reference timings, cubic-bezier(0.2, 0.715, 0.205, 0.99); phones: the same dots and panel, with Get the app and Log in |
| 1 | Hero | "Know where you stand." (the App Store subtitle) · accounts, cash and cards in any currency, what's left, due and saved for · Get the app / See how it works | live 3D: a big ring, split rings, link chains, and charms — the mark (mint leaves, gold coin) on a soft black block, the spending chart, an Emerald card, a receipt, a padlock — and a gold carabiner | cannon-es physics: every part a body on ball joints, charms collide, the pointer pushes them, the ring leans after the pointer |
| 2 | Ticker | the 26 currencies a wallet can be kept in | type | marquee, paused for reduced motion |
| 3 | Statement | "Wealthit adds up every account, every budget, every bill and every goal — so you always know where you stand." with real crops inline | crops → Home (light) | words darken on scroll; the crops fly into a phone that rises from below |
| 4 | Story one | Recording: "Write each payment the way you'd say it — no forms, just the blanks" | the composer in a dark panel | blur reveal; panel parallax |
| 5 | Story two | Scan a receipt: "Snap a receipt and it fills itself in. You just check it." | a scanned receipt as a record | blur reveal |
| 6 | Story three | the whole picture: budgets, Home and goals | three captures in a dark window | the window grows to fill the screen |
| 7 | Feature cards | the six feature pages + All features | captures | hover lift |
| 8 | Three ways | "Three ways to record": Type it / Scan it / Schedule it | the three real screens | tabs (auto-advancing, clickable, arrow keys) |
| 9 | Gallery | "Every screen here is the real app." — ten captures | captures | drag / wheel / arrow buttons |
| 10 | Faster | "Bills that remember themselves — on the day, and never twice." | scheduled payments, the waiting bill floating over it | rise and float on scroll |
| 11 | Double block | "Every currency. One total." → /features/accounts/ · "A heads-up before you overspend." → /features/budgets/ | wallet rows; the budget notification | arrow links |
| 12 | Get the look | "Make it yours": Light, Dark, Hidden, Your order | the four captures | choosing a name swaps the screen |
| + | Privacy (the app's poster 10) | "For your eyes only." — Face ID or PIN, hide amounts, no bank login, nothing tracked, delete any time | Home with amounts hidden | reveal |
| + | Web app | "On your computer, too." — same account, records in step | — | Coming soon until `webApp` is set |
| + | FAQ | five answers from Help and the privacy policy | — | expandable |
| + | Closing | Forest panel: the mark, "Small steps. Big wealth.", Coming soon to the App Store, Google Play later | — | — |
| 13 | Footer | the rounded sheet over a warm grey footer: the mark and tagline; Features, Company, Get in touch, Legal; the wordmark ("it" in Emerald) on a green-and-gold glow | — | glyphs rise |

## The other pages (butter.video's, 16 October 2026)

| butter.video | What it is there | Wealthit |
| --- | --- | --- |
| /product | centred hero and a big media panel; feature rows with media panels, sides alternating; a bento of smaller tools under a floating section switcher | **/features/**: the hero, a band per feature linking to its page, the floating switcher between them, "And the rest, too." **/features/<slug>/** (recording, accounts, budgets, goals, bills, home): the hero and panel, three feature rows, a grid of the smaller things, the next feature, the closing panel |
| /contact | an image beside a contact form; FAQ | **/support/** (Help — the app links here): the brand panel beside a form that opens the visitor's mail app; the app's support answers in three groups |
| /terms-of-service, privacy | legal text | **/privacy/** — the app session's policy (the app links here) |
| /pricing | plans and a comparison table | none: the price is undecided |
| /blog | posts | none: there are no posts |
| app.butter.video/login, /register | the web app | **Log in** → `webApp` (src/lib/site.ts), "Soon" until the web app is deployed |
| — | — | **/about/** stays jeton.com/about (docs/ABOUT_SPEC.md) in the brand's colours |
