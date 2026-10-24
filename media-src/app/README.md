# From the app's own marketing

Tap to Record's Lock Screen card can't be captured on the simulator (no Apple Pay or Shortcuts
there), so the iOS session pointed to the App Store poster 03, which draws it from the app's real
`TapLiveActivity.swift`. `scripts/tap.mjs` renders that poster's own HTML (read from
`App/marketing/app-store/source/03-apple-pay.html`, unchanged) with everything but the card hidden:

- `tap-card.png`: the card, at the poster's 2.7x, transparent around its rounded corners.
- `lockscreen.png`: the iOS Lock Screen capture the poster uses (`App/marketing/app-store/assets/screens`).

The site lays the card over the Lock Screen in a phone; it never redraws either.

The Home Screen widgets can't be captured with data on the simulator either, so the App Store
poster 09 draws two of them from the app's own widget layout (`src/widgets/Wealthit.tsx`).
`scripts/widgets.mjs` renders that poster's HTML (unchanged) with only its wallpaper strip and the
widgets showing, the small one above the medium one as a Home Screen's grid sets them:

- `widgets.png`: the wallpaper with the two widgets, at the poster's 1.9x.
