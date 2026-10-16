# Jeton → Wealth-it

The homepage is built on jeton.com's structure, rhythm, type scale and motion (studied 27 September
2026; the measured spec is in `REFERENCE_SPEC.md`). Every word, image and product screen is
Wealth-it's. This file records what occupies each of Jeton's sections and why.

## Rules that decided the mapping

- **Same role, true content.** A section keeps its visual role; the content is whatever real part of
  Wealth-it plays that role best. Nothing is invented — no user counts, countries, partners,
  certifications, social accounts or testimonials.
- **Real app, always.** Product UI is a capture from the app (`screens-raw/`, simulator, iPhone 17
  Pro) or a crop cut from one. Where Jeton uses a pre-rendered 3D video, the site renders a live
  Three.js scene in Wealth-it's colours; where that scene shows a phone, the phone shows a real
  capture.
- **Colour.** Jeton's brand orange plays the role of Wealth-it's lime `#C8F24E`. White stays white
  (structural). Because the app never sets text in lime (its own rule, A7), text that is white on
  orange becomes ink `#0B0D0C` on lime, and text that is orange on white becomes the app's
  accent-as-text colour `#4C6A08`. Jeton's darkest brand tone `#360802` becomes ink.
- **Type.** Jeton sets everything in Sequel Sans Display (400/450/500/600), a commercial face that
  cannot be copied. The site uses the same scale, weights and tracking in Inter (variable, with its
  display optical size), self-hosted. `src/styles/fonts.css` is the one place to swap in licensed
  Sequel Sans files.
- **Not in the stores yet.** Jeton's store badges become outline buttons of the same size that say
  "Coming soon", and are not links until `stores` in `src/lib/site.ts` has URLs.

## Sections

| Jeton | Purpose | Wealth-it | Screens / assets | Copy |
| --- | --- | --- | --- | --- |
| Navbar | brand + account actions | Wordmark; "Privacy" and "Get Wealth-it" (there is no account to log into) | — | — |
| Hero "One app for all needs" | what it is, in one line | The first of the app's four questions: where do I stand? | Live 3D coins travelling round a ring, piling up and peeling off (lime) — the reference's disc column, changed at the owner's request | "Know where you stand." / "Every wallet, budget and payment still to come — in one app that keeps it all on your phone." |
| "Unify your finances" + 5 snippets | everything in one place | Everything the Dashboard pulls together | Crops: category ring, Food & Drink tile, expense sentence, cross-currency transfer, subcategory picker | "See the whole picture" |
| Add / Send / Exchange | the three core actions | The app's create menu: Expense / Income / Transfer | App icons and colours | "Expense", "Income", "Transfer" |
| Walkthrough (Account → Add → Method → Review → Done) | a real flow, step by step | Writing down an expense: Wallet → Amount → Category → Review → Done | dashboard, tx-keypad-filled, tx-category, tx-filled, tx-detail | "Every wallet" / "One ledger", then one feature line per step; "Simple" / "calm & clear" |
| "All your finances, in one app." + 3D phone | the product in the world | The app itself: no account, nothing to connect | Live 3D: a phone showing the real Dashboard inside a ribbed ring | "All your money, in one app." / "No account to create. Nothing to connect. Open it and start." |
| Jeton Card ("Spending limits? Check.") | the flagship spending product | Budgets — the app's spending limits | Live 3D pedestals with the real budget summary on a floating slab | "Budgets" / "Spending limits? Set. / Running low? Flagged. / Over? Told in time." |
| Exchange calculator + falling flags | currencies, and converting them | Eight currencies per wallet; the AED/USD peg the app uses | Physics coins for AED USD EUR GBP SAR INR PKR EGP; a USD⇄AED converter at 3.6725 | "Currencies" / "Eight currencies, one honest total." |
| Testimonials | why people trust it | The rules the app is built on — stated, not quoted | Glass cards over a full-bleed real capture | "Built on a few firm rules" |
| "1 million users, plus you." | the last push | The real first step | V-curtain reveal | "Open it. Write it down." |
| Footer + giant wordmark | everything else | Links to sections, privacy, support; a factual legal line | Wordmark "Wealth-it"; a card of real captures in place of partnerships | — |
| Bottom menu (drawers) / "Menu" overlay on phones | navigation | Home · Features ▾ (thumbnails are real screens) · Privacy ↗ · Help ▾ | Captures as thumbnails | — |
| "Support" floating button | help | The support page (the app has no inbox) | — | — |
