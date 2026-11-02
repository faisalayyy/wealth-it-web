// Record from bank messages, for the site: rectangles cut from the Android session's captures
// (~/Movies/Wealthit Website/android/screens, 1080 x 2400, its README says what each shows). The
// site's phone frames are iPhones, so an Android screen is never shown whole in one; only a piece of
// it, at its own shape, as the Tap to Record card is. Nothing is retouched: each piece is the same
// pixels, cut by the rectangle below (in the capture's pixels).
// Output, in media-src/android/: <name>.png, which screens.json names as a cut.
//   node scripts/android.mjs [captures-dir]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(process.argv[2] ?? path.join(os.homedir(), 'Movies/Wealthit Website/android/screens'));
const out = path.join(root, 'media-src/android');
fs.mkdirSync(out, { recursive: true });

const PIECES = {
  // the bank's text arriving, and Wealthit's alert under it for a known shop and card: Save, Change
  // (the shade's status bar and the test build's own notices left out)
  'bank-alert': { from: 'android-alert-save-dark', left: 30, top: 625, width: 1020, height: 835 },
};

for (const [name, p] of Object.entries(PIECES)) {
  await sharp(path.join(src, `${p.from}.png`)).extract({ left: p.left, top: p.top, width: p.width, height: p.height }).png().toFile(path.join(out, `${name}.png`));
  console.log(`${name}.png ${p.width} x ${p.height}, from ${p.from}`);
}
