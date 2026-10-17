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
| + | Tap to Record | "You paid. It's already written down." (App Store poster 03): Apple Pay puts the payment on the Lock Screen, filled in; three steps; iPhone only | the real Lock Screen in a phone, Tap to Record's card (from the poster's source) arriving on it, Add pressed, "Recorded in Groceries" | the card loops while on screen |
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

Every product image is one of the app's own captures or recordings (docs/SCREENSHOTS.md); every
fact is the app's (App/docs/product.json, its decisions and its privacy text). No client logos,
testimonials, user numbers or prices exist, so none are shown. Where butter shows its product in
use, the site shows it in photographs of people with a phone (models, never quoted) and in short
recordings that play in a phone while on screen.

| # | Reference | Wealthit | Media | Interaction |
| - | --- | --- | --- | --- |
| 0 | Header | Wealthit ▾Features (seven feature pages, each with a capture, and All features), Help, Privacy, and two dots; right pill: the theme switch, Log in (Soon until the web app has an address) and Get the app | the menu's rows (Features, Tap to Record, Help, Privacy, Get the app) each with a 3D piece in the keyring's materials; Follow Wealthit (Instagram) under them | as butter: scrolled, the links fade and the pill folds to the name and the dots (pointer or focus widens it again); the dots, at the top or scrolled, widen the pill to "Close ⁚", dim the page and open a panel of four large rows (description on hover, rules drawing across) and the feature pages small beneath — reference timings, cubic-bezier(0.2, 0.715, 0.205, 0.99); phones: the same dots and panel, with Get the app and Log in |
| 1 | Hero | "Know where you stand." (the App Store subtitle) · accounts, cash and cards in any currency, what's left, due and saved for · Get the app / See how it works | live 3D: a big ring, split rings, link chains, and charms — the mark (mint leaves, gold coin) on a soft black block, the spending chart, an Emerald card, a receipt, a padlock — and a gold carabiner | cannon-es physics: every part a body on ball joints, charms collide, the pointer pushes them, the ring leans after the pointer |
| 2 | Ticker | "Made for money that crosses borders": the 26 countries whose money a wallet can be kept in (EU as Eurozone) | round flags (flag-icons, MIT) in pills | two rows drifting opposite ways, paused on hover; still for reduced motion |
| 3 | Statement | "Wealthit adds up every account, every budget, every bill and every goal — so you always know where you stand." with 3D illustrations inline | a card and coin, the spending chart, a calendar, coins to a flag, the mark (src/three/art.ts, rendered once) → Home (dark) | words darken on scroll; the pieces fly into a phone that rises from below |
| + | Moments | "Less adding up. More living." — Home on a sofa, recording at a café, budgets at the till | three photographs with the app on the phone | the photos ease in closer as they pass |
| 4 | Story one | Recording: "Write each payment the way you'd say it…" | the recording of an expense being entered | blur reveal; the video plays while on screen |
| 5 | Story two | Scan a receipt: "Point your camera at a receipt. It's read on your phone and filled in for you" | the recording of a receipt being scanned | blur reveal; the video plays while on screen |
| + | Tap to Record | "You paid. It's already written down." (App Store poster 03): Apple Pay puts the payment on the Lock Screen, filled in; three steps; iPhone only | the real Lock Screen in a phone, Tap to Record's card (from the poster's source) arriving on it, Add pressed, "Recorded in Groceries" | the card loops while on screen |
| 6 | Story three | the whole picture: budgets, Home and goals | three captures in a dark window | the window grows to fill the screen |
| 7 | Feature cards | the seven feature pages + All features, Tap to Record first across the width | captures; Tap to Record's Lock Screen | the arrow sits inside each picture, bottom right; hover lift |
| 8 | Three ways | "Three ways to record": Type it / Scan it / Schedule it | the expense and receipt recordings; scheduled payments | tabs (auto-advancing for as long as the recording runs, clickable, arrow keys) |
| 9 | Gallery | "Every screen here is the real app." — twelve captures | captures | the row moves on its own easing: drag with momentum and a rubber band at the ends, settling on a screen; sideways swipe, arrows and arrow keys glide it; screens rise in |
| 10 | Faster | "Bills that remember themselves — on the day, and never twice." | scheduled payments, the waiting bill floating over it | rise and float on scroll |
| 11 | Double block | "Every currency. One total." → /features/accounts/ · "A heads-up before you overspend." → /features/budgets/ | a phone with Wallets in a hand on the street; a supermarket shelf | arrow links |
| 12 | Get the look | "Make it yours": Light, Dark, Hidden, Your order | the four captures | choosing a name swaps the screen |
| + | Privacy (the app's poster 10) | "For your eyes only." — Face ID or PIN, hide amounts, no bank login, nothing tracked, delete any time | the recording of amounts being hidden | reveal |
| + | Web app | "On your computer, too." — same account, records in step | a laptop and coffee | Coming soon until `webApp` is set |
| + | FAQ | five answers from Help and the privacy policy | — | expandable |
| + | Closing | Forest panel: the mark, "Small steps. Big wealth.", Coming soon to the App Store, Google Play later | three phones (budgets, Home, goals) rising out of its lower edge | the phones rise as it scrolls in |
| 13 | Footer | the rounded sheet over a warm grey footer: the mark and tagline; Features, Help, Get in touch, Socials (Instagram), Legal; the wordmark ("it" in Emerald) on a green-and-gold glow | — | glyphs rise |

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
