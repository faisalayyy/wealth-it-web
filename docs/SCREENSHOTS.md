# The app on the site: screens, recordings, photographs, illustrations

Every picture of the product is real. Four kinds of image, four scripts.

## Screens — `npm run screens`

Source: `~/Movies/Wealthit Website/screens/` — made by the **Wealthit · iOS** session on 17 October
2026 from the app at commit `5b4b4d4` (TestFlight build 14), iPhone 17 Pro Max simulator, sample
data, 1320 × 2868 PNG, every screen in `-dark` and `-light`. Its `README.md` says what each shows
and what the site must not claim. The folder is outside iCloud on purpose (iCloud evicts files).

`src/lib/screens.json` names the screens the site uses, the crops cut from them (rectangles in
points), and cuts taken from elsewhere — `tap-card`, a rectangle from the App Store poster that
draws Tap to Record's Lock Screen card from the app's real code (`media-src/app`), because it can't
be captured on a simulator. `scripts/screens.mjs` writes `public/screens/` and
`src/lib/screens.sizes.json`. New screens: ask the iOS session for them in the same folder.

## Recordings — `scripts/videos.sh`

Source: `~/Movies/Wealthit Website/videos/`, the iOS session's screen recordings (H.264, native
size). `scripts/videos.sh` keeps the ones the site uses, each with the moment its poster is taken
from, and writes `public/videos/<name>.mp4` (660 px wide, no sound, starts at once) and `.jpg`
through `scripts/video.swift` (AVFoundation; frames only resized). `PhoneVideo` plays them in a
phone, only while on screen; with reduced motion they wait on the poster.

## Photographs — `node scripts/compose.mjs`

Source: `media-src/people/` (Unsplash and Pexels, credited in `CREDITS.md`). For the four photos of a
phone in someone's hand, the script finds the screen by its colour (green screen, or plain white),
warps a real capture onto it in perspective, and shows it only through the screen's own mask so
fingers and the notch stay in front. The people are models, not users: never caption them as
saying anything.

## Illustrations — `scripts/art.mjs`

The statement's 3D pieces (`src/three/art.ts`), rendered once to transparent images in
`public/art/` — steps in the script's header.
