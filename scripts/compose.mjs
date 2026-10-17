// People holding Wealthit: puts a real capture of the app onto the iPhone screen in a photograph
// (media-src/people, see CREDITS.md) and writes every photograph for the web.
//
//   node scripts/compose.mjs [captures-dir] [--only name] [--src dir] [--out dir] [--debug dir]
//     captures-dir   default ~/Movies/Wealthit Website/screens
//     --src, --out   default media-src/people and public/people (a preview can go elsewhere)
//     --debug        also writes each composite as a JPEG, and a close look at its phone
//
// Finding the screen. Its four corners come one of two ways. A plain white or green screen is
// found by its colour: the outline of those pixels is fitted with a straight line along each side,
// leaving out the rounded corners, and neighbouring lines meet at the corners. A screen showing
// something else is fitted by hand from landmarks (the camera's viewfinder spans the display's full
// width at a known height; a dark display's glass edge, inset by the bezel) and given as `quad`.
//
// The mask. The capture shows through the screen's own shape: the quad's rounded rectangle (the
// screen's corner radius), less the notch where the phone has one, less whatever is in front of the
// screen: pixels that aren't the screen's colour (a thumb, the Dynamic Island), skin inside `skin`
// rectangles, and `cover` polygons drawn by hand.
//
// Placing the capture. The capture is mapped onto the corners by a perspective transform (a
// homography as a CSS matrix3d, drawn by headless Chromium), so nothing is stretched: an iPhone's
// screen has the capture's proportions, and the transform only undoes the angle it was shot at. It
// is softened to the photo's own sharpness, with a faint glass sheen. The simulator draws its own
// Dynamic Island into every capture; that black pill is filled with the status bar's colour (the
// phone in the photo has its own notch or island), and nothing of the app is changed.
// Output: <out>/<name>-{900,1800}.{webp,avif}.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const FLAGS = ['--only', '--debug', '--src', '--out'];
const flag = n => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const only = flag('--only');
const debug = flag('--debug');
const caps = args.find((a, i) => !a.startsWith('--') && !FLAGS.includes(args[i - 1])) ?? path.join(os.homedir(), 'Movies/Wealthit Website/screens');
const src = path.resolve(flag('--src') ?? path.join(root, 'media-src/people'));
const out = path.resolve(flag('--out') ?? path.join(root, 'public/people'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'compose-'));
fs.mkdirSync(out, { recursive: true });
if (debug) fs.mkdirSync(debug, { recursive: true });

/**
 * Which capture goes into which photo, and how its screen is found:
 *   screen   the capture (a file in captures-dir), or 'tap': the Lock Screen with Tap to Record's
 *            card on it (media-src/app, scripts/tap.mjs)
 *   key      'green' | 'white'        find a plain screen by its colour, within `region`
 *   region   [x0, y0, x1, y1]         fractions of the photo
 *   quad     [[x, y] × 4]             corners by hand: top left, top right, bottom right, bottom
 *                                     left of the display as the phone is held upright
 *   radius   the display's corner radius, as a fraction of its width
 *   notch    [width, height]          the notch, as fractions of the display's width and height
 *   skin     [[x0, y0, x1, y1], …]    rectangles (pixels) where skin is in front of the screen
 *   cover    [[[x, y], …], …]         polygons (pixels) in front of the screen
 *   clip     [[x, y], …]              the part of the screen that can be seen (pixels)
 *   crop     [x0, y0, x1, y1]         fractions: the part of the photo kept
 */
const IPHONE_X_NOTCH = [0.557, 0.037]; // 209 × 30 pt on a 375 × 812 pt display
const COMPOSITES = [
  // white screens, found by colour; the notch and the thumb are not white, so they stay in front
  { photo: 'home-sofa', screen: 'home-dark', key: 'white', region: [0.39, 0.14, 0.59, 0.64], radius: 0.13 },
  { photo: 'cafe-record', screen: 'record-sheet-dark', key: 'white', region: [0.53, 0.04, 0.78, 0.68], radius: 0.12 },
  { photo: 'sofa-goals', screen: 'goals-dark', key: 'white', region: [0.42, 0.13, 0.6, 0.58], radius: 0.13 },
  // green, with its own Dynamic Island in front
  { photo: 'desk-budgets', screen: 'budgets-dark', key: 'green', region: [0.3, 0.14, 0.56, 0.76], radius: 0.16 },
  // the camera open on an iPhone 11 Pro: the display fitted from the 4:3 viewfinder, which spans its
  // width 114 pt below its top; the thumb at the lower right stays in front
  {
    photo: 'wallets-hijab',
    screen: 'wallets-dark',
    quad: [[997, 1310], [1452, 1366], [1258, 2583], [829, 2474]],
    radius: 0.104,
    notch: IPHONE_X_NOTCH,
    cover: [[[1278, 2440], [1290, 2410], [1312, 2388], [1345, 2376], [1430, 2376], [1430, 2640], [1330, 2640], [1330, 2552], [1302, 2500], [1285, 2465]]],
  },
  // Apple Pay at a till, the phone turned flat towards the reader (an iPhone 12 or 13, 390 × 844 pt).
  // The display is fitted from what Apple Pay drew on it: the bank card's four corners (a card is
  // 1.586 : 1), the clock 23 pt below the top and the home bar 10.5 pt above the bottom; checked, the
  // home bar lands within 4 pt of the centre and the card is 360 pt wide. The raised case hides the
  // display's edge at this angle, so it is clipped to the glass as seen (its dark outline).
  // Tap to Record's card on the Lock Screen, just after paying; cut above the cashier's shoulders,
  // so only her hand is in the picture.
  {
    photo: 'till-tap',
    screen: 'tap',
    quad: [[825, 1852], [1101, 1516], [2042, 2142], [1852, 2548]],
    clip: [[846, 1862], [1124, 1531], [2041, 2156], [1881, 2538]],
    radius: 0.121,
    notch: [0.5, 0.038],
    crop: [0, 0.43, 1, 0.93],
  },
];
/** photographs shown as they are */
const PLAIN = ['laptop-coffee'];

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** the homography taking four points onto four others: [a, b, c, d, e, f, g, h] */
function homography(from, quad) {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i];
    const [u, v] = quad[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  return b.map((v, i) => v / A[i][i]);
}
const rect = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
const project = ([a, b, c, d, e, f, g, h], x, y) => {
  const z = g * x + h * y + 1;
  return [(a * x + b * y + c) / z, (d * x + e * y + f) / z];
};
const matrix3d = ([a, b, c, d, e, f, g, h]) => `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;

/** a straight line through points (total least squares): a point on it and its direction */
function fitLine(pts) {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (const [x, y] of pts) {
    sxx += (x - mx) ** 2;
    sxy += (x - mx) * (y - my);
    syy += (y - my) ** 2;
  }
  const angle = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  return { p: [mx, my], d: [Math.cos(angle), Math.sin(angle)] };
}
function meet(l1, l2) {
  const [x1, y1] = l1.p, [dx1, dy1] = l1.d, [x2, y2] = l2.p, [dx2, dy2] = l2.d;
  const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / (dx1 * dy2 - dy1 * dx2);
  return [x1 + t * dx1, y1 + t * dy1];
}
/** convex hull (monotone chain) */
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper = [];
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), q) <= 0) upper.pop();
    upper.push(q);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/** four corners from the outline of a mask: [top left, top right, bottom right, bottom left] in the image */
function cornersFromMask(alpha, W, H) {
  const edge = [];
  for (let y = 0; y < H; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < W; x++) if (alpha[y * W + x] > 160) { if (a < 0) a = x; b = x; }
    if (a >= 0) edge.push([a, y], [b, y]);
  }
  for (let x = 0; x < W; x++) {
    let a = -1, b = -1;
    for (let y = 0; y < H; y++) if (alpha[y * W + x] > 160) { if (a < 0) a = y; b = y; }
    if (a >= 0) edge.push([x, a], [x, b]);
  }
  const h = hull(edge);
  const pick = f => h.reduce((best, p) => (f(p) > f(best) ? p : best));
  const rough = [pick(p => -p[0] - p[1]), pick(p => p[0] - p[1]), pick(p => p[0] + p[1]), pick(p => -p[0] + p[1])];
  const dense = [];
  for (let i = 0; i < h.length; i++) {
    const a = h[i], b = h[(i + 1) % h.length];
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2));
    for (let k = 0; k < n; k++) dense.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  const lines = [0, 1, 2, 3].map(i => {
    const a = rough[i], b = rough[(i + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [ux, uy] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const pts = dense.filter(p => {
      const t = (p[0] - a[0]) * ux + (p[1] - a[1]) * uy;
      const off = Math.abs((p[0] - a[0]) * -uy + (p[1] - a[1]) * ux);
      return t > len * 0.18 && t < len * 0.82 && off < len * 0.06;
    });
    return fitLine(pts.length > 8 ? pts : [a, b]);
  });
  return [meet(lines[3], lines[0]), meet(lines[0], lines[1]), meet(lines[1], lines[2]), meet(lines[2], lines[3])];
}

const isSkin = (r, g, b) => r > 95 && g > 40 && b > 20 && r > g + 12 && r > b + 20;

/** an image as one byte per pixel (sharp hands back three channels after a blur unless told) */
const one = async img => {
  const { data, info } = await img.extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 1) throw new Error(`expected one channel, got ${info.channels}`);
  return data;
};

async function findScreen(job) {
  const file = path.join(src, `${job.photo}.jpg`);
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let photoFile = file;
  let corners = job.quad;

  // the screen's colour: 1 where a pixel is plainly the screen, 0 where it plainly isn't
  const screenness = (r, g, b) =>
    job.key === 'green'
      ? clamp((g - Math.max(r, b) - 25) / 40)
      : clamp((Math.min(r, g, b) - 140) / 35) * clamp((42 - (Math.max(r, g, b) - Math.min(r, g, b))) / 14);
  if (job.key && !corners) {
    // the screen-coloured pixels joined to the region's centre, so a light behind the phone that
    // happens to be the same colour is never taken for part of the screen
    const alpha = new Uint8Array(W * H);
    const [rx0, ry0, rx1, ry1] = job.region.map((v, i) => Math.round(v * (i % 2 ? H : W)));
    const ok = (x, y) => {
      const i = (y * W + x) * C;
      return screenness(data[i], data[i + 1], data[i + 2]) > 0.5;
    };
    const stack = [[Math.round((rx0 + rx1) / 2), Math.round((ry0 + ry1) / 2)]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < rx0 || x >= rx1 || y < ry0 || y >= ry1 || alpha[y * W + x] || !ok(x, y)) continue;
      alpha[y * W + x] = 255;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    corners = cornersFromMask(alpha, W, H);
  }

  // the screen's shape: its rounded rectangle and notch, mapped through the same perspective
  const w = 1000, h = 1000 * (956 / 440), r = (job.radius ?? 0.12) * w;
  const Hm = homography(rect(w, h), corners);
  // a keyed screen's shape reaches a little over the bezel, so no sliver of the white or green
  // screen is left at its edge; the colour test below takes the bezel out again
  const e = job.key === 'white' ? 0.03 * w : job.key ? 0.015 * w : 0;
  const P = (x, y) => project(Hm, x < w / 2 ? x - e : x + e, y < h / 2 ? y - e : y + e);
  const shape = [];
  const arc = (cx, cy, a0, into = shape, rad = r) => {
    for (let k = 0; k <= 10; k++) {
      const a = a0 + (k / 10) * (Math.PI / 2);
      into.push(P(cx + rad * Math.cos(a), cy + rad * Math.sin(a)));
    }
  };
  arc(w - r, r, -Math.PI / 2);
  arc(w - r, h - r, 0);
  arc(r, h - r, Math.PI / 2);
  arc(r, r, Math.PI);
  const holes = [...(job.cover ?? [])];
  if (job.notch) {
    const nw = job.notch[0] * w, nh = job.notch[1] * h, nr = Math.min(nh * 0.7, 40);
    const x0 = (w - nw) / 2, x1 = (w + nw) / 2;
    const notch = [P(x0 - 14, -20), P(x1 + 14, -20)];
    arc(x1 - nr, nh - nr, 0, notch, nr);
    arc(x0 + nr, nh - nr, Math.PI / 2, notch, nr);
    holes.push(notch);
  }
  const poly = p => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const clip = job.clip ? `<clipPath id="c"><polygon points="${poly(job.clip)}"/></clipPath>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${clip}<polygon points="${poly(shape)}" fill="#fff"${job.clip ? ' clip-path="url(#c)"' : ''}/>${holes.map(c => `<polygon points="${poly(c)}" fill="#000"/>`).join('')}</svg>`;
  const base = await one(sharp(Buffer.from(svg)).blur(0.6));

  // skin in front, where it was asked for: smoothed, so henna, nails and the gaps between fingers
  // count as the hand they belong to
  let hand = null;
  if (job.skin) {
    const raw = Buffer.alloc(W * H);
    for (const [x0, y0, x1, y1] of job.skin)
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const i = (y * W + x) * C;
          if (isSkin(data[i], data[i + 1], data[i + 2])) raw[y * W + x] = 255;
        }
    hand = await one(sharp(raw, { raw: { width: W, height: H, channels: 1 } }).blur(7));
  }
  // whatever is in front of a keyed screen, 0 to 1. A white screen's own edge is often a little
  // blue or grey, and the edge of a thumb on it is nearly white, so neither counts: only what is
  // dark (the bezel, the notch, an island) or skin of a skin's brightness is in front
  let front = null;
  if (job.key) {
    const raw = Buffer.alloc(W * H);
    for (let m = 0; m < W * H; m++) {
      if (!base[m]) continue;
      const i = m * C;
      const [r, g, b2] = [data[i], data[i + 1], data[i + 2]];
      let f;
      if (job.key === 'white') {
        const dark = clamp((95 - Math.max(r, g, b2)) / 40); // black, not a thumb's soft shadow
        // skin is warmer than the screen however bright it is; the screen's own white is bluish
        const skin = r > g ? clamp((r - b2 - 16) / 18) : 0;
        f = Math.max(dark, skin);
      } else f = 1 - clamp((screenness(r, g, b2) - 0.06) * 6);
      raw[m] = Math.round(f * 255);
    }
    // softened, then pulled back about a pixel, so the capture runs just under the notch's and the
    // bezel's edges and no hairline of the old screen is left along them
    front = await one(sharp(raw, { raw: { width: W, height: H, channels: 1 } }).blur(1));
    for (let m = 0; m < front.length; m++) front[m] = Math.round(clamp((front[m] / 255 - 0.55) / 0.35) * 255);
  }
  const mask = Buffer.alloc(W * H * 4);
  for (let m = 0; m < W * H; m++) {
    let a = base[m] / 255;
    if (a > 0 && front) a *= 1 - front[m] / 255;
    if (a > 0 && hand) a *= clamp((90 - hand[m]) / 40);
    mask[m * 4] = mask[m * 4 + 1] = mask[m * 4 + 2] = 255;
    mask[m * 4 + 3] = Math.round(a * 255);
  }
  const maskFile = path.join(tmp, `${job.photo}-mask.png`);
  await sharp(mask, { raw: { width: W, height: H, channels: 4 } }).blur(0.5).png().toFile(maskFile);

  if (job.key === 'green') {
    // green light spilled onto the frame and the fingers: take green back to red/blue level
    const xs = corners.map(c => c[0]), ys = corners.map(c => c[1]);
    const pad = 0.08 * (Math.max(...xs) - Math.min(...xs));
    const x0 = Math.max(0, Math.round(Math.min(...xs) - pad)), x1 = Math.min(W, Math.round(Math.max(...xs) + pad));
    const y0 = Math.max(0, Math.round(Math.min(...ys) - pad)), y1 = Math.min(H, Math.round(Math.max(...ys) + pad));
    const clean = Buffer.from(data);
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * C;
        const lim = Math.max(clean[i], clean[i + 2]);
        if (clean[i + 1] > lim) clean[i + 1] = lim;
      }
    photoFile = path.join(tmp, `${job.photo}-clean.png`);
    await sharp(clean, { raw: { width: W, height: H, channels: C } }).png().toFile(photoFile);
  }
  return { W, H, corners, mask: maskFile, photoFile };
}

/** the capture, with the simulator's Dynamic Island filled with the status bar's colour */
async function capture(job) {
  let file = path.join(caps, `${job.screen}.png`);
  if (job.screen === 'tap') {
    // Tap to Record on the Lock Screen, at the phone's own size (the card is drawn at 2.7x, the
    // capture is 3x), over the wallpaper blurred the way iOS does under it
    const lock = path.join(root, 'media-src/app/lockscreen.png');
    const meta = await sharp(lock).metadata();
    const card = await sharp(path.join(root, 'media-src/app/tap-card.png')).resize({ width: Math.round(1116 * (3 / 2.7)) }).toBuffer();
    const cm = await sharp(card).metadata();
    const left = Math.round((meta.width - cm.width) / 2), top = Math.round(meta.height * 0.62);
    const under = await sharp(lock).extract({ left, top, width: cm.width, height: cm.height }).blur(28).toBuffer();
    const roundMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cm.width}" height="${cm.height}"><rect x="2" y="2" width="${cm.width - 4}" height="${cm.height - 4}" rx="${(cm.width - 4) * 0.072}" fill="#fff"/></svg>`);
    const blurred = await sharp(under).composite([{ input: roundMask, blend: 'dest-in' }]).png().toBuffer();
    file = path.join(tmp, 'tap.png');
    await sharp(lock).composite([{ input: blurred, left, top }, { input: card, left, top }]).png().toFile(file);
  }
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const at = (fx, fy) => {
    const i = (Math.round(fy * h) * w + Math.round(fx * w)) * c;
    return `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
  };
  // the island: 34.33% from the left, 1.26% from the top, 31.34% × 4.23% (src/components/Phone.module.css)
  const [ix, iy, iw, ih] = [0.3373, 0.0106, 0.3254, 0.0463].map((v, i) => v * (i % 2 ? h : w));
  const fill = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g"><stop offset="0" stop-color="${at(0.31, 0.034)}"/><stop offset="1" stop-color="${at(0.69, 0.034)}"/></linearGradient></defs><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="${ih / 2}" fill="url(#g)"/></svg>`;
  const outFile = path.join(tmp, `${job.photo}-capture.png`);
  await sharp(file).composite([{ input: Buffer.from(fill) }]).png().toFile(outFile);
  return outFile;
}

async function browser() {
  const BIN = `${os.homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
  const port = 9500 + Math.floor(Math.random() * 300);
  const proc = spawn(BIN, [`--remote-debugging-port=${port}`, `--user-data-dir=${path.join(tmp, 'profile')}`, '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let t;
  for (let i = 0; i < 50 && !t; i++) {
    await sleep(200);
    try {
      t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x => x.type === 'page');
    } catch {}
  }
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id) {
      pending.get(m.id)?.(m);
      pending.delete(m.id);
    }
  });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  return { send, sleep, close: () => (ws.close(), proc.kill()) };
}

async function writeWeb(input, name) {
  for (const w of [900, 1800]) {
    const img = sharp(input).resize({ width: w });
    await img.clone().webp({ quality: 80 }).toFile(path.join(out, `${name}-${w}.webp`));
    await img.clone().avif({ quality: 52 }).toFile(path.join(out, `${name}-${w}.avif`));
  }
}

const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;

const jobs = COMPOSITES.filter(j => !only || j.photo === only);
if (jobs.length) {
  const b = await browser();
  for (const job of jobs) {
    const cap = await capture(job);
    const meta = await sharp(cap).metadata();
    const { W, H, corners, mask, photoFile } = await findScreen(job);
    // the thin band a keyed screen's mask reaches past the capture takes the capture's own edge colour
    const { data: cd, info: ci } = await sharp(cap).raw().toBuffer({ resolveWithObject: true });
    const ei = (Math.round(ci.height / 2) * ci.width + 4) * ci.channels;
    const edge = `rgb(${cd[ei]},${cd[ei + 1]},${cd[ei + 2]})`;
    const Hm = homography(rect(meta.width, meta.height), corners);
    // the capture as sharp as the photo around it: about half a pixel of softness at its size there
    const scale = Math.hypot(corners[1][0] - corners[0][0], corners[1][1] - corners[0][1]) / meta.width;
    const soft = (job.soft ?? 0.45) / Math.max(scale, 0.05);
    const html = path.join(tmp, `${job.photo}.html`);
    fs.writeFileSync(
      html,
      `<!doctype html><html><body style="margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative">
<img src="${dataUrl(photoFile, 'image/png')}" style="position:absolute;inset:0;width:${W}px;height:${H}px">
<div style="position:absolute;inset:0;background:${job.key ? edge : 'transparent'};-webkit-mask-image:url(${dataUrl(mask, 'image/png')});-webkit-mask-size:${W}px ${H}px">
  <div style="position:absolute;left:0;top:0;width:${meta.width}px;height:${meta.height}px;transform-origin:0 0;transform:${matrix3d(Hm)}">
    <img src="${dataUrl(cap, 'image/png')}" style="display:block;width:100%;height:100%;filter:blur(${soft.toFixed(2)}px) brightness(${job.brightness ?? 0.96}) saturate(1.02)">
    <div style="position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,${job.sheen ?? 0.08}),rgba(255,255,255,0) 42%)"></div>
  </div>
</div></body></html>`,
    );
    await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await b.send('Page.navigate', { url: `file://${html}` });
    await b.sleep(2500);
    const shot = await b.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
    let png = path.join(tmp, `${job.photo}.png`);
    fs.writeFileSync(png, Buffer.from(shot.result.data, 'base64'));
    if (debug) {
      // a close look at the phone, with the corners marked
      const xs = corners.map(c => c[0]), ys = corners.map(c => c[1]);
      const pad = 0.25 * (Math.max(...xs) - Math.min(...xs));
      const box = { left: Math.max(0, Math.round(Math.min(...xs) - pad)), top: Math.max(0, Math.round(Math.min(...ys) - pad)) };
      box.width = Math.min(W - box.left, Math.round(Math.max(...xs) + pad) - box.left);
      box.height = Math.min(H - box.top, Math.round(Math.max(...ys) + pad) - box.top);
      const dots = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${corners.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${Math.max(3, W / 600)}" fill="none" stroke="#f0f" stroke-width="${Math.max(1.5, W / 1500)}"/>`).join('')}</svg>`;
      const marked = await sharp(png).composite([{ input: Buffer.from(dots) }]).png().toBuffer();
      await sharp(marked).extract(box).jpeg({ quality: 90 }).toFile(path.join(debug, `${job.photo}-zoom.jpg`));
    }
    if (job.crop) {
      const [x0, y0, x1, y1] = job.crop;
      const cut = path.join(tmp, `${job.photo}-cut.png`);
      await sharp(png).extract({ left: Math.round(x0 * W), top: Math.round(y0 * H), width: Math.round((x1 - x0) * W), height: Math.round((y1 - y0) * H) }).toFile(cut);
      png = cut;
    }
    await writeWeb(png, job.photo);
    if (debug) await sharp(png).jpeg({ quality: 88 }).toFile(path.join(debug, `${job.photo}.jpg`));
    console.log(`${job.photo}: ${job.screen} at ${corners.map(c => c.map(Math.round).join(',')).join(' ')}`);
  }
  b.close();
}
for (const name of PLAIN.filter(n => (!only || n === only) && fs.existsSync(path.join(src, `${n}.jpg`)))) {
  await writeWeb(path.join(src, `${name}.jpg`), name);
  console.log(`${name}: as photographed`);
}
