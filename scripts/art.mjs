// Saves the statement's 3D illustrations (src/three/art.ts) as images: reads the PNGs that the
// render page draws in headless Chromium, trims the empty edges, and writes
// public/art/<name>.{webp,avif} at 2× a 120 px height.
//   1. rename src/app/_lab to src/app/lab (it is kept out of the site as a private folder)
//   2. open http://localhost:4321/lab/art/ in headless Chromium and save window.__art's PNGs
//   3. node scripts/art.mjs <pngs-dir>, then rename the folder back to _lab
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = process.argv[2];
const out = path.resolve('public/art');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.png'))) {
  const name = path.basename(f, '.png');
  const trimmed = await sharp(path.join(dir, f)).trim({ threshold: 1 }).toBuffer();
  const img = sharp(trimmed).resize({ height: 240, fit: 'inside' });
  await img.clone().webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(out, `${name}.webp`));
  await img.clone().avif({ quality: 60 }).toFile(path.join(out, `${name}.avif`));
  const m = await sharp(path.join(out, `${name}.webp`)).metadata();
  console.log(name, `${m.width}×${m.height}`, `ratio ${(m.width / m.height).toFixed(2)}`);
}
