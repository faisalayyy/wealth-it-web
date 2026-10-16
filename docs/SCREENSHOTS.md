# The app's screens on the site

Every product image on the site is a real capture of the Wealthit app. Since 16 October 2026 they
come from the app's own marketing captures rather than from this site's simulator sessions.

## Where they come from

`../App/marketing/app-store/assets/screens/` — made by the app session for the App Store (11
October 2026, current branding): whole screens at 1320 × 2868 (440 × 956 pt, 3×), and pieces the
app session cut from them — sheets, rows, a notification, page crops — at their own sizes. Read
them; never edit that folder.

## Updating them

1. Copy the PNGs into `screens-raw.nosync/` (iCloud skips `*.nosync`; the folder is ignored):
   `cp ../App/marketing/app-store/assets/screens/*.png ../App/marketing/app-store/assets/screens/rows/*.png screens-raw.nosync/`
   If a copy hangs, the file was evicted by iCloud — `brctl download <file>` and try again.
2. Name them in `src/lib/screens.json`: `screens` (whole screens, shown in a phone), `cuts` (the
   app's pieces, `file` = the PNG's name, with alt text), `crops` (rectangles in points cut from a
   whole screen).
3. `npm run screens` — or `node scripts/screens.mjs --sheet /tmp/crops.png` to check crops by eye.
   It writes `public/screens/` (whole screens at 420/840/1320, cuts at 640/1280, crops at 2×, AVIF
   and WebP) and `src/lib/screens.sizes.json`.

Nothing is retouched: images are resized, and crops are cut from the same pixels.

## No capture yet

The new branding has no capture of Activity, Statistics, Tap to Record's Lock Screen card or the
widgets on a Home Screen. Those features are described in words until there is one.
