// People holding Wealthit: puts a real capture of the app onto the phone screen in a photograph
// (media-src/people, see CREDITS.md) and writes every photograph for the web.
//
//   node scripts/compose.mjs [captures-dir]     (default: ~/Movies/Wealthit Website/screens)
//
// The screen in each photo is found by its colour — a green screen, or a plain white one — which
// gives both its four corners and a mask. The capture is warped onto the corners (a perspective
// transform, drawn by headless Chromium) and shown only through the mask, so a thumb over the edge
// or the camera notch stays in front of it, as in a real photo. The capture itself is untouched.
// Output: public/people/<name>-{900,1800}.{webp,avif}.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const caps = process.argv[2] ?? path.join(os.homedir(), 'Movies/Wealthit Website/screens');
const src = path.join(root, 'media-src/people');
const out = path.join(root, 'public/people');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'compose-'));
fs.mkdirSync(out, { recursive: true });

/** which capture goes into which photo, and how its screen is found */
const COMPOSITES = [
  { photo: 'sofa-phone', screen: 'home-dark', key: 'green' },
  { photo: 'cafe-phone', screen: 'record-sheet-dark', key: 'green' },
  { photo: 'shopping-phone', screen: 'budgets-dark', key: 'green' },
  // an older phone with a notch: the capture starts below its own status bar (a rectangle cut
  // from it, nothing redrawn), placed below the notch, so there are never two cut-outs
  { photo: 'street-phone', screen: 'wallets-light', key: 'white', region: [0.25, 0.18, 0.75, 0.8], insetTop: 0.046, cropTop: 165 },
];
const PLAIN = ['family-evening', 'laptop-coffee', 'couple-planning', 'supermarket', 'friends-cafe'];

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

async function findScreen({ photo, key, region }) {
  const { data, info } = await sharp(path.join(src, `${photo}.jpg`)).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const [rx0, ry0, rx1, ry1] = (region ?? [0, 0, 1, 1]).map((v, i) => Math.round(v * (i % 2 ? H : W)));
  const alpha = new Uint8Array(W * H);
  let tl = [Infinity], tr = [-Infinity], br = [-Infinity], bl = [Infinity];
  for (let y = ry0; y < ry1; y++)
    for (let x = rx0; x < rx1; x++) {
      const i = (y * W + x) * C;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // green: how much greener than red or blue; white: anything light (a thumb and the notch are dark)
      const a = key === 'green' ? clamp((g - Math.max(r, b) - 35) / 45) : clamp((Math.min(r, g, b) - 150) / 35);
      if (!a) continue;
      alpha[y * W + x] = Math.round(a * 255);
      if (a < 0.6) continue;
      if (x + y < tl[0]) tl = [x + y, x, y];
      if (x - y > tr[0]) tr = [x - y, x, y];
      if (x + y > br[0]) br = [x + y, x, y];
      if (x - y < bl[0]) bl = [x - y, x, y];
    }
  // the diagonal extremes sit on the rounded corners, a little inside the true edges: widen
  const quad = [tl, tr, br, bl].map(p => [p[1], p[2]]);
  const cx = quad.reduce((s, p) => s + p[0], 0) / 4;
  const cy = quad.reduce((s, p) => s + p[1], 0) / 4;
  const side = Math.min(Math.hypot(quad[1][0] - quad[0][0], quad[1][1] - quad[0][1]), Math.hypot(quad[3][0] - quad[0][0], quad[3][1] - quad[0][1]));
  const grow = side * 0.035 + 3;
  const corners = quad.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy);
    return [x + ((x - cx) / d) * grow, y + ((y - cy) / d) * grow];
  });
  // green light spilled onto the phone's edge in the photo: take the green back to the red/blue level
  let photoFile = path.join(src, `${photo}.jpg`);
  if (key === 'green') {
    const xs = corners.map(c => c[0]);
    const ys = corners.map(c => c[1]);
    const pad = 40;
    const [x0, x1] = [Math.max(0, Math.min(...xs) - pad), Math.min(W, Math.max(...xs) + pad)].map(Math.round);
    const [y0, y1] = [Math.max(0, Math.min(...ys) - pad), Math.min(H, Math.max(...ys) + pad)].map(Math.round);
    const clean = Buffer.from(data);
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * C;
        const lim = Math.max(clean[i], clean[i + 2]);
        if (clean[i + 1] > lim) clean[i + 1] = lim;
      }
    photoFile = path.join(tmp, `${photo}-clean.png`);
    await sharp(clean, { raw: { width: W, height: H, channels: C } }).png().toFile(photoFile);
  }
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = alpha[i];
  }
  const mask = path.join(tmp, `${photo}-mask.png`);
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).blur(0.6).png().toFile(mask);
  return { W, H, corners, mask, photoFile };
}

/** the 3×3 homography taking the rectangle w×h onto four corners, as a CSS matrix3d */
function matrix3d(w, h, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const dst = [[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  // solve A·h = b (Gaussian elimination)
  const n = 8;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const sol = b.map((v, i) => v / A[i][i]);
  const [a, bb, c, d, e, f, g, hh] = sol;
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
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

async function writeWeb(file, name) {
  for (const w of [900, 1800]) {
    const img = sharp(file).resize({ width: w });
    await img.clone().webp({ quality: 80 }).toFile(path.join(out, `${name}-${w}.webp`));
    await img.clone().avif({ quality: 52 }).toFile(path.join(out, `${name}-${w}.avif`));
  }
}

const b = await browser();
for (const job of COMPOSITES) {
  const cap = path.join(caps, `${job.screen}.png`);
  const { W, H, corners, mask, photoFile } = await findScreen(job);
  let meta = await sharp(cap).metadata();
  let capFile = cap;
  let quad = corners;
  if (job.cropTop) {
    capFile = path.join(tmp, `${job.photo}-cap.png`);
    await sharp(cap).extract({ left: 0, top: job.cropTop, width: meta.width, height: meta.height - job.cropTop }).toFile(capFile);
    meta = await sharp(capFile).metadata();
  }
  if (job.insetTop) {
    const [tl, tr, br, bl] = corners;
    const down = (a, b) => [a[0] + (b[0] - a[0]) * job.insetTop, a[1] + (b[1] - a[1]) * job.insetTop];
    quad = [down(tl, bl), down(tr, br), br, bl];
  }
  const html = path.join(tmp, `${job.photo}.html`);
  fs.writeFileSync(
    html,
    `<!doctype html><html><body style="margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative">
<img src="file://${photoFile}" style="position:absolute;inset:0;width:${W}px;height:${H}px">
<div style="position:absolute;inset:0;-webkit-mask-image:url(file://${mask});-webkit-mask-size:${W}px ${H}px;mask-image:url(file://${mask});mask-size:${W}px ${H}px">
  <img src="file://${capFile}" style="position:absolute;left:0;top:0;width:${meta.width}px;height:${meta.height}px;transform-origin:0 0;transform:${matrix3d(meta.width, meta.height, quad)};filter:brightness(0.97) saturate(1.02)">
  <div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.10),rgba(255,255,255,0) 38%)"></div>
</div></body></html>`,
  );
  await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await b.send('Page.navigate', { url: `file://${html}` });
  await b.sleep(1500);
  const shot = await b.send('Page.captureScreenshot', { format: 'png' });
  const png = path.join(tmp, `${job.photo}.png`);
  fs.writeFileSync(png, Buffer.from(shot.result.data, 'base64'));
  await writeWeb(png, job.photo);
  console.log(`${job.photo}: ${job.screen} at ${corners.map(c => c.map(Math.round).join(',')).join(' ')}`);
}
b.close();
for (const name of PLAIN) {
  await writeWeb(path.join(src, `${name}.jpg`), name);
  console.log(`${name}: as photographed`);
}
