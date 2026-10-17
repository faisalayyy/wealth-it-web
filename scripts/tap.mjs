// Tap to Record's Lock Screen card, for the site. The simulator can't show it (no Apple Pay, no
// Shortcuts), so the App Store poster 03 draws it from the app's real TapLiveActivity.swift. This
// renders that poster's own HTML, read from the app's folder and not changed there, with everything
// but the card hidden and the page transparent (its drop shadow too: the site draws its own), so
// the card can be laid over the real Lock Screen capture the poster uses (copied beside it).
// Output, in media-src/app/:
//   tap-card.png     the card, 2.7x, transparent around its rounded corners
//   lockscreen.png   the iOS Lock Screen capture, 1320 x 2868
//   node scripts/tap.mjs [app-dir]     (default: ../App)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.resolve(root, process.argv[2] ?? '../App');
const poster = path.join(app, 'marketing/app-store/source/03-apple-pay.html');
const out = path.join(root, 'media-src/app');
fs.copyFileSync(path.join(app, 'marketing/app-store/assets/screens/lockscreen.png'), path.join(out, 'lockscreen.png'));

const BIN = `${os.homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const port = 9500 + Math.floor(Math.random() * 300);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tap-'));
const proc = spawn(BIN, [`--remote-debugging-port=${port}`, `--user-data-dir=${tmp}`, '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
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
const run = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.result.value;

await send('Emulation.setDeviceMetricsOverride', { width: 1320, height: 2868, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
await send('Page.navigate', { url: `file://${poster}` });
await sleep(2500);
// only the card: the poster's ground, headline and phone go; nothing in the card is touched
await run(`(() => {
  const s = document.createElement('style');
  s.textContent = 'html, body, .poster { background: transparent !important } .poster::before, .kicker, .headline, .support, .device { display: none !important } .card { box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .14) !important }';
  document.head.append(s);
})()`);
await sleep(400);
const box = await run(`(() => { const r = document.querySelector('.card').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })()`);
const pad = 2;
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: box.x - pad, y: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2, scale: 1 } });
fs.writeFileSync(path.join(out, 'tap-card.png'), Buffer.from(shot.result.data, 'base64'));
console.log(`tap-card.png ${Math.round(box.width)} x ${Math.round(box.height)}; lockscreen.png`);
ws.close();
proc.kill();
