// Headless Chrome for the picture scripts (og, tap, widgets, compose), driven over the DevTools
// protocol. It runs CHROME_BIN if that is set, else Playwright's headless shell if one is installed,
// else the Chrome, Chromium, Edge or Brave in /Applications. Its throwaway profile goes on close.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function find() {
  if (process.env.CHROME_BIN) return { bin: process.env.CHROME_BIN, shell: false };
  const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dir = fs.existsSync(pw) && fs.readdirSync(pw).filter(d => d.startsWith('chromium_headless_shell-')).sort().at(-1);
  const shell = dir && path.join(pw, dir, 'chrome-headless-shell-mac-arm64/chrome-headless-shell');
  if (shell && fs.existsSync(shell)) return { bin: shell, shell: true };
  for (const app of ['Google Chrome', 'Chromium', 'Microsoft Edge', 'Brave Browser']) {
    const bin = `/Applications/${app}.app/Contents/MacOS/${app}`;
    if (fs.existsSync(bin)) return { bin, shell: false };
  }
  throw new Error('No Chrome found: install Google Chrome, or set CHROME_BIN to a Chrome or Chromium binary.');
}

export async function openChrome() {
  const { bin, shell } = find();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wealthit-chrome-'));
  const port = 9500 + Math.floor(Math.random() * 300);
  const args = [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--allow-file-access-from-files', '--hide-scrollbars'];
  // the full browser needs telling to run headless; the headless shell always is
  if (!shell) args.push('--headless=new', '--no-first-run', '--no-default-browser-check');
  const proc = spawn(bin, [...args, 'about:blank'], { stdio: 'ignore' });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const drop = () => fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
  let t;
  for (let i = 0; i < 75 && !t; i++) {
    await sleep(200);
    try {
      t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x => x.type === 'page');
    } catch {}
  }
  if (!t) {
    proc.kill();
    drop();
    throw new Error(`Chrome didn't start: ${bin}`);
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
  const close = async () => {
    ws.close();
    proc.kill();
    await sleep(600);
    drop();
  };
  return { send, run, sleep, close };
}
