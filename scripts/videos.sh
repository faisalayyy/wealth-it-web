#!/bin/zsh
# The app's screen recordings, made ready for the site (docs/SCREENSHOTS.md):
#   scripts/videos.sh [source-dir]     (default: ~/Movies/Wealthit Website/build-26/videos)
# Each <name>.mp4|.mov becomes public/videos/<name>.mp4 (660 px wide, H.264, no sound, starts at
# once) and public/videos/<name>.webp (its first frame, the poster). Frames are only resized.
set -e
src=${1:-"$HOME/Movies/Wealthit Website/build-26/videos"}
cd "$(dirname "$0")/.."
mkdir -p public/videos
# the recordings the site shows (src/lib/features.ts, src/app/page.tsx, the homepage sections),
# each with the moment its poster is taken from — a frame that says what the recording is about
typeset -A poster=(
  record-expense-dark 6.2
  scan-receipt-dark 0.4
  budget-dark 6.0
  goal-dark 4.0
  customise-home-dark 3.4
  hide-amounts-dark 0.3
  record-expense-light 6.2
  hide-amounts-light 0.3
)
for name in ${(k)poster}; do
  f=("$src/$name".(mp4|mov)(N))
  [[ -z $f ]] && { echo "missing: $name"; continue; }
  swift scripts/video.swift "$f[1]" "public/videos/$name.mp4" 660 "public/videos/$name.jpg" $poster[$name] 1200000 2>/dev/null
  # the poster as WebP, about a third of the JPEG's size; it loads only when its video is near
  node -e "require('sharp')('public/videos/$name.jpg').webp({ quality: 78 }).toFile('public/videos/$name.webp').then(() => require('fs').unlinkSync('public/videos/$name.jpg'))"
done
