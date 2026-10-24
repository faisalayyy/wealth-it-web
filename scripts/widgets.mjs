// Wealthit's Home Screen widgets, for the site. The simulator can't show them with data, so the App
// Store poster 09 draws two of them from the app's own widget layout (src/widgets/Wealthit.tsx), on
// a strip of the simulator's Home Screen wallpaper. This renders that poster's own HTML, read from
// the app's folder and not changed there, with everything but the wallpaper and the widgets hidden,
// and the two widgets set one above the other, as a small and a medium widget sit on a Home Screen,
// so the picture is near square. Nothing inside a widget is touched.
// Output, in media-src/app/:
//   widgets.png      the wallpaper with the two widgets, at the poster's size (1.9x a widget's points)
//   node scripts/widgets.mjs [app-dir]     (default: ../App)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.resolve(root, process.argv[2] ?? '../App');
const poster = path.join(app, 'marketing/app-store/source/09-make-it-yours.html');
const out = path.join(root, 'media-src/app');

// Playwright's headless Chromium, the newest one installed
const PW = `${os.homedir()}/Library/Caches/ms-playwright`;
const BIN = `${PW}/${fs.readdirSync(PW).filter(d => d.startsWith('chromium_headless_shell-')).sort().at(-1)}/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const port = 9500 + Math.floor(Math.random() * 300);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'widgets-'));
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
await send('Page.navigate', { url: `file://${poster}` });
await sleep(2500);
// only the wallpaper and the widgets: the headline, the line under it and the Customise Home page
// go; the widgets stand one above the other, left-aligned as the Home Screen's grid sets them
await run(`(() => {
  const s = document.createElement('style');
  s.textContent = '.poster::before, .kicker, .headline, .support, .page { display: none !important } .wall { top: 0 !important; right: auto !important; height: auto !important; padding: 64px } .widgets { position: static !important; transform: none !important; flex-direction: column; align-items: flex-start }';
  document.head.append(s);
})()`);
await sleep(600);
const box = JSON.parse(await run(`JSON.stringify(document.querySelector('.wall').getBoundingClientRect())`));
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale: 1 } });
fs.writeFileSync(path.join(out, 'widgets.png'), Buffer.from(shot.result.data, 'base64'));
console.log(`widgets.png ${Math.round(box.width)} x ${Math.round(box.height)}`);
ws.close();
proc.kill();
