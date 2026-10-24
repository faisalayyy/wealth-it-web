# The app on the site: screens, recordings, photographs, illustrations

Every picture of the product is real. Four kinds of image, four scripts.

## Screens — `npm run screens`

Source: `~/Movies/Wealthit Website/build-26/screens/`, made by the **Wealthit · iOS** session on
23 October 2026 from the app at commit `e3a5dbd` (TestFlight build 26: the blades, the lime, Opal,
the liquid Home header), iPhone 17 Pro Max simulator, sample data, 1320 × 2868 PNG, every screen in
`-dark` and `-light`, the Dynamic Island painted into each. The 17 October set (build 14, the old
green UI) is beside it in `../screens`, no longer used. Its `README.md` says what each shows
and what the site must not claim. The folder is outside iCloud on purpose (iCloud evicts files).

`src/lib/screens.json` names the screens the site uses, the crops cut from them (rectangles in
points), and cuts taken from elsewhere. Every `-dark` screen and crop also gets its `-light` twin,
which the site shows in its light theme. `scripts/screens.mjs` writes `public/screens/` and
`src/lib/screens.sizes.json`. New screens: ask the iOS session for them in the same folder.

Tap to Record can't be captured on a simulator (no Apple Pay, no Shortcuts). `node scripts/tap.mjs`
renders the App Store poster 03's own HTML with only its Lock Screen card showing (since build 26,
Change and Save), on a transparent ground, and copies the Lock Screen capture the poster uses
(`media-src/app`; `files` in screens.json). `TapPhone` lays the card over the Lock Screen.

The Home Screen widgets get no data on a simulator. `node scripts/widgets.mjs` renders App Store
poster 09's own HTML with only its wallpaper strip and two widgets showing (drawn there from the
app's widget layout), the small above the medium, into `media-src/app/widgets.png`; it is the
`widgets` cut, shown on the Home & widgets page.

## Recordings — `scripts/videos.sh`

Source: `~/Movies/Wealthit Website/build-26/videos/`, the iOS session's screen recordings (H.264, native
size). `scripts/videos.sh` keeps the ones the site uses, each with the moment its poster is taken
from, and writes `public/videos/<name>.mp4` (660 px wide, no sound, starts at once) and `.jpg`
through `scripts/video.swift` (AVFoundation; frames only resized). `PhoneVideo` plays them in a
phone, only while on screen; with reduced motion they wait on the poster.

## Photographs: `node scripts/compose.mjs`

Source: `media-src/people/` (Pexels, credited in `CREDITS.md`; the originals aren't committed).
Every phone is a real iPhone. A plain white or green screen is found by its colour; a screen showing
something else (a camera, Apple Pay) is fitted by hand from what it shows: the camera's viewfinder
spans the display's width, and Apple Pay's card, clock and home bar sit at known places. The capture
is mapped onto the four corners in perspective, never stretched, and shows only through the screen's
own rounded shape, with the notch, the island, fingers and skin left in front. The simulator's own
Dynamic Island in a capture is filled with the status bar's colour, since the phone in the photo has
its own. `--src`, `--out` and `--debug` make a preview elsewhere; a new photograph is shown to the
owner composited before it goes on the site. The people are models, not users: never caption them as
saying anything.

## Illustrations: `scripts/art.mjs`

The statement's and the menu's 3D pieces (`src/three/art.ts`), rendered once to transparent images
in `public/art/`; steps in the script's header.

## The link preview: `scripts/og.mjs`

`public/og.png`, 1200 x 630: the logo, "Know where you stand." with the lime full stop, and Home and
Budgets in two phones, on Night lit like the top of the app's Home.
