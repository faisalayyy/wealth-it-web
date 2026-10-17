// The link preview (public/og.png, 1200 x 630): the mark and the name, the App Store subtitle as a
// headline ending on the gold coin, and Home and Budgets from the iOS captures in two phones, on the
// brand's Forest. Drawn in headless Chromium from this site's own font and captures.
//   node scripts/og.mjs        (after npm run screens)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = fs.readFileSync(path.join(root, 'src/lib/brand.ts'), 'utf8');
const leaves = [...brand.matchAll(/'(M[^']+)'/g)].map(m => m[1]);
// everything inline, so the page needs no file access
const f = p => `data:${p.endsWith('.woff2') ? 'font/woff2' : 'image/webp'};base64,${fs.readFileSync(path.join(root, p)).toString('base64')}`;
const phone = (shot, x, y, w, r) => `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"><div class="screen"><img src="${f(`public/screens/${shot}-840.webp`)}"></div><span class="island"></span></div>`;
const html = `<!doctype html><html><head><style>
@font-face { font-family: J; src: url(${f('src/fonts/plus-jakarta-sans-latin-wght-normal.woff2')}) format('woff2'); font-weight: 200 800 }
* { margin: 0; box-sizing: border-box }
body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: J; color: #f7f6f1;
  background: radial-gradient(60% 80% at 80% 100%, rgba(76,195,138,.35), rgba(76,195,138,0) 70%), radial-gradient(50% 60% at 0% 0%, rgba(242,198,109,.14), rgba(242,198,109,0) 70%), #0e3b30 }
.logo { position: absolute; left: 72px; top: 64px; display: flex; align-items: center; gap: 14px; font-size: 40px; font-weight: 700; letter-spacing: -.025em }
.logo svg { width: 52px; height: 52px }
.logo i { font-style: normal; color: #4cc38a }
h1 { position: absolute; left: 72px; top: 200px; width: 560px; font-size: 84px; line-height: 1; font-weight: 600; letter-spacing: -.05em }
.coin { display: inline-block; width: .2em; height: .2em; margin-left: .05em; border-radius: 50%; background: #f2c66d }
p { position: absolute; left: 72px; top: 430px; width: 500px; font-size: 25px; line-height: 1.4; color: rgba(247,246,241,.74); font-weight: 450 }
.phone { position: absolute; padding: 9px; border-radius: 50px; background: linear-gradient(145deg,#3d413e,#151816 45%,#2b2e2c); box-shadow: 0 40px 80px -20px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.12) }
.screen { border-radius: 41px; overflow: hidden; aspect-ratio: 440/956; background: #0b0d0c }
.screen img { width: 100%; display: block }
.island { position: absolute; left: 36%; top: 3.2%; width: 28%; height: 3.6%; border-radius: 99px; background: #000 }
</style></head><body>
<div class="logo"><svg viewBox="0 0 100 100">${leaves.map(d => `<path d="${d}" fill="#4cc38a"/>`).join('')}<circle cx="50" cy="32.4" r="10.8" fill="#f2c66d"/></svg><span>Wealth<i>it</i></span></div>
<h1>Know where you stand<span class="coin"></span></h1>
<p>Every account, budget, bill and goal, in any currency. On iPhone.</p>
${phone('budgets-dark', 700, 150, 250, -6)}
${phone('home-dark', 890, 90, 270, 4)}
</body></html>`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));
fs.writeFileSync(path.join(tmp, 'og.html'), html);
const BIN = `${os.homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const port = 9500 + Math.floor(Math.random() * 300);
const proc = spawn(BIN, [`--remote-debugging-port=${port}`, `--user-data-dir=${path.join(tmp, 'p')}`, '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
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
  if (m.id) (pending.get(m.id)?.(m), pending.delete(m.id));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `file://${path.join(tmp, 'og.html')}` });
await sleep(1800);
const shot = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(path.join(root, 'public/og.png'), Buffer.from(shot.result.data, 'base64'));
console.log('public/og.png');
ws.close();
proc.kill();
