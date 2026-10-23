// Turns the app's captures into what the site serves.
//
//   node scripts/screens.mjs [raw-dir] [--sheet out.png]
//
// Input: the iOS session's captures in ~/Movies/Wealthit Website/build-26/screens (default; outside iCloud,
// which evicts files), whole screens 1320x2868; and any cut whose name has a slash, from this repo.
// Output, in public/screens/:
//   {name}-{420,840,1320}.{avif,webp}   whole screens; every "-dark" screen also gets its "-light"
//                                       twin, which the site shows in its light theme
//   cuts/{name}-{640,1280}.{avif,webp}  the app's own pieces, at their own shape
//   crops/{name}.{avif,webp}            rectangles cut from whole screens, at 2x, and
//   crops/{name}-light.{avif,webp}      the same rectangle from the light twin
// and src/lib/screens.sizes.json, the pixel size of every cut and crop.
//
// Nothing is retouched: images are resized, crops are cut from the same pixels. Device frames
// are drawn by CSS (or Three.js) around them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/screens.json'), 'utf8'));
const args = process.argv.slice(2);
const sheetAt = args.indexOf('--sheet');
const sheetOut = sheetAt >= 0 ? args[sheetAt + 1] : null;
const rawDir = path.resolve(root, args.find((a, i) => !a.startsWith('--') && i !== sheetAt + 1) ?? path.join(process.env.HOME, 'Movies/Wealthit Website/build-26/screens'));
const out = path.join(root, 'public/screens');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'crops'), { recursive: true });
fs.mkdirSync(path.join(out, 'cuts'), { recursive: true });

const { scale } = manifest.device;
const WEBP = { quality: 86, effort: 5, smartSubsample: true };
const AVIF = { quality: 58, effort: 5 };
const raw = name => {
  // a name with a slash is a file in this repo (media-src/…); anything else is a capture
  // and a few captures are kept in the repo too (manifest.files)
  const file = name.includes('/') ? path.join(root, `${name}.png`) : manifest.files?.[name] ? path.join(root, `${manifest.files[name]}.png`) : path.join(rawDir, `${name}.png`);
  if (!fs.existsSync(file)) throw new Error(`missing capture: ${file}`);
  return file;
};

let written = 0;
const twin = name => name.replace(/-dark$/, '-light');
const names = new Set(Object.keys(manifest.screens));
for (const name of Object.keys(manifest.screens)) if (name.endsWith('-dark')) names.add(twin(name));
for (const name of names) {
  for (const w of [420, 840, 1320]) {
    await sharp(raw(name)).resize({ width: w }).webp(WEBP).toFile(path.join(out, `${name}-${w}.webp`));
    await sharp(raw(name)).resize({ width: w }).avif(AVIF).toFile(path.join(out, `${name}-${w}.avif`));
    written += 2;
  }
}

const sizes = { cuts: {}, crops: {} };
for (const [name, c] of Object.entries(manifest.cuts)) {
  const meta = await sharp(raw(c.file)).metadata();
  sizes.cuts[name] = { w: meta.width, h: meta.height };
  for (const w of [640, 1280]) {
    const width = Math.min(w, meta.width);
    await sharp(raw(c.file)).resize({ width }).webp({ ...WEBP, quality: 90 }).toFile(path.join(out, 'cuts', `${name}-${w}.webp`));
    await sharp(raw(c.file)).resize({ width }).avif(AVIF).toFile(path.join(out, 'cuts', `${name}-${w}.avif`));
    written += 2;
  }
}

const crops = [];
for (const [name, c] of Object.entries(manifest.crops)) {
  const region = { left: c.x * scale, top: c.y * scale, width: c.w * scale, height: c.h * scale };
  if (c.from.endsWith('-dark')) {
    const light = await sharp(raw(twin(c.from))).extract(region).resize({ width: c.w * 2 }).png().toBuffer();
    await sharp(light).webp({ ...WEBP, quality: 90 }).toFile(path.join(out, 'crops', `${name}-light.webp`));
    await sharp(light).avif(AVIF).toFile(path.join(out, 'crops', `${name}-light.avif`));
    written += 2;
  }
  const buf = await sharp(raw(c.from)).extract(region).resize({ width: c.w * 2 }).png().toBuffer();
  await sharp(buf).webp({ ...WEBP, quality: 90 }).toFile(path.join(out, 'crops', `${name}.webp`));
  await sharp(buf).avif(AVIF).toFile(path.join(out, 'crops', `${name}.avif`));
  sizes.crops[name] = { w: c.w * 2, h: c.h * 2 };
  written += 2;
  crops.push({ buf, w: c.w * 2, h: c.h * 2 });
}
fs.writeFileSync(path.join(root, 'src/lib/screens.sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

if (sheetOut) {
  const pad = 16, colW = 600;
  let y = pad;
  const layers = [];
  for (const c of crops) {
    layers.push({ input: await sharp(c.buf).resize({ width: colW }).toBuffer(), left: pad, top: y });
    y += Math.round((c.h * colW) / c.w) + pad;
  }
  await sharp({ create: { width: colW + pad * 2, height: y, channels: 3, background: '#ff00ff' } })
    .composite(layers).png().toFile(sheetOut);
  console.log(`sheet: ${sheetOut}`);
}
console.log(`${written} files → public/screens`);
