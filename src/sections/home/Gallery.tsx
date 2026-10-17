'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { Button } from '@/components/Button';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import type { ScreenName } from '@/lib/screens';
import { useJump } from './useJump';
import s from './Gallery.module.css';

/**
 * Breadth (the reference's gallery): a big rounded panel holding a row of the app's real screens,
 * each named. The row moves on its own easing rather than the browser's scroll: drag it (mouse,
 * finger or pen) and it carries on with the speed you let go at, then settles on the nearest
 * screen; a trackpad's sideways swipe, the arrows and the arrow keys glide it the same way. Up and
 * down still scroll the page. The screens rise into place as the panel comes into view.
 */
// `from: 'bottom'`: a sheet that rises from the bottom of the screen is shown from the bottom up
const SHOTS: { screen: ScreenName; name: string; area: string; from?: 'bottom' }[] = [
  { screen: 'home-dark', name: 'Home', area: 'Where you stand' },
  { screen: 'wallets-dark', name: 'Wallets', area: 'Every account' },
  { screen: 'record-sheet-dark', name: 'Recording', area: 'Finish the sentence', from: 'bottom' },
  { screen: 'scan-reading-dark', name: 'Scan a receipt', area: 'Read on your phone', from: 'bottom' },
  { screen: 'budgets-dark', name: 'Budgets', area: 'Before you overspend' },
  { screen: 'goals-dark', name: 'Goals', area: 'Every step counts' },
  { screen: 'planning-dark', name: 'Planning', area: 'What is coming' },
  { screen: 'schedules-dark', name: 'Scheduled payments', area: 'Bills that remember' },
  { screen: 'friends-family-dark', name: 'Friends & family', area: 'Who owes whom' },
  { screen: 'statistics-dark', name: 'Statistics', area: 'Where it went' },
  { screen: 'notifications-dark', name: 'Notifications', area: 'What needs you' },
  { screen: 'customise-home-dark', name: 'Customise Home', area: 'Your order' },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const jump = useJump();
  // the row's position: where it is, where it is going, how far it can go
  const pos = useRef({ x: 0, to: 0, max: 0, drag: null as null | { x: number; from: number; t: number; v: number; moved: boolean; id: number } });

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(track.current!.children, {
        y: 70,
        opacity: 0,
        stagger: 0.05,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: view.current, start: 'top 85%' },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    const p = pos.current;
    const el = track.current!;
    const still = reducedMotion();
    const measure = () => {
      // the row starts after the window's left padding and ends with a margin as wide
      const v = view.current!;
      p.max = Math.max(0, el.offsetWidth - v.clientWidth + parseFloat(getComputedStyle(v).paddingLeft));
      p.to = Math.min(p.max, Math.max(0, p.to));
    };
    measure();
    let shown = '';
    const tick = (_t: number, dt: number) => {
      const k = still ? 1 : 1 - Math.pow(1 - 0.14, dt / 16.7);
      p.x += (p.to - p.x) * k;
      if (Math.abs(p.to - p.x) < 0.1) p.x = p.to;
      el.style.transform = `translate3d(${-p.x}px, 0, 0)`;
      const e = `${p.to < 8}${p.to > p.max - 8}`;
      if (e !== shown) {
        shown = e;
        setEdges({ start: p.to < 8, end: p.to > p.max - 8 });
      }
    };
    gsap.ticker.add(tick);
    window.addEventListener('resize', measure);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const clamp = (v: number) => Math.min(pos.current.max, Math.max(0, v));

  /** the left edge of the screen nearest to x, so the row always comes to rest on one */
  const settle = (x: number) => {
    const items = [...track.current!.children] as HTMLElement[];
    const first = items[0]?.offsetLeft ?? 0;
    let best = x;
    let gap = Infinity;
    for (const it of items) {
      const at = it.offsetLeft - first;
      if (Math.abs(at - x) < gap) {
        gap = Math.abs(at - x);
        best = at;
      }
    }
    return clamp(x >= pos.current.max - 4 ? pos.current.max : best);
  };

  const by = (dir: number) => {
    const p = pos.current;
    p.to = settle(clamp(p.to + dir * view.current!.clientWidth * 0.75));
  };

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const p = pos.current;
    p.drag = { x: e.clientX, from: p.to, t: performance.now(), v: 0, moved: false, id: e.pointerId };
  };
  const move = (e: React.PointerEvent) => {
    const p = pos.current;
    const d = p.drag;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const now = performance.now();
    const next = d.from - dx;
    // past either end the row gives a little, like a rubber band
    const over = next < 0 ? next : next > p.max ? next - p.max : 0;
    const to = over ? next - over * 0.65 : next;
    d.v = 0.8 * ((to - p.to) / Math.max(1, now - d.t)) + 0.2 * d.v;
    d.t = now;
    p.to = to;
    p.x = to - (to - p.x) * 0.35;
  };
  const up = (e: React.PointerEvent) => {
    const p = pos.current;
    const d = p.drag;
    if (!d || d.id !== e.pointerId) return;
    p.drag = null;
    if (!d.moved) return;
    // carry on at the speed it was let go at, then come to rest on a screen
    p.to = settle(clamp(p.to + d.v * 320));
  };

  const wheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // up and down scroll the page
    const p = pos.current;
    p.to = clamp(p.to + e.deltaX);
    window.clearTimeout(wheelEnd.current);
    wheelEnd.current = window.setTimeout(() => (p.to = settle(p.to)), 140);
  };
  const wheelEnd = useRef(0);

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') by(1);
    else if (e.key === 'ArrowLeft') by(-1);
    else return;
    e.preventDefault();
  };

  return (
    <section ref={root} className={s.section} aria-labelledby="gallery-title" data-ground="light">
      <div className={`wrap ${s.head}`}>
        <p className="cap">Inside the app</p>
        <h2 id="gallery-title" className="display-2">
          {coined('Every screen here is the real app.')}
        </h2>
      </div>
      <div className={`wrap ${s.panel}`}>
        <div
          ref={view}
          className={s.view}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onWheel={wheel}
          onKeyDown={key}
          role="region"
          aria-roledescription="carousel"
          aria-label="Screens from the app. Use the left and right arrow keys to move."
          tabIndex={0}
          data-lenis-prevent-touch
        >
          <ul ref={track} className={s.rail}>
            {SHOTS.map((sh, i) => (
              <li key={sh.screen} className={s.item} data-size={i % 3 === 1 ? 'tall' : 'short'} data-from={sh.from}>
                <figure>
                  <div className={s.frame}>
                    <Screen name={sh.screen} alt={`${sh.name}: ${sh.area.toLowerCase()}`} sizes="260px" className={s.shot} />
                  </div>
                  <figcaption className={s.caption}>
                    <span className={s.name}>{sh.name}</span>
                    <span className={s.area}>{sh.area}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.controls}>
          <button type="button" className={s.arrow} onClick={() => by(-1)} disabled={edges.start} aria-label="Previous screens">
            <Icon name="chevron-down" size={20} className={s.left} />
          </button>
          <Button label="Get the app" href="/#get" tone="ink" onClick={jump('get')} />
          <button type="button" className={s.arrow} onClick={() => by(1)} disabled={edges.end} aria-label="Next screens">
            <Icon name="chevron-down" size={20} className={s.right} />
          </button>
        </div>
      </div>
    </section>
  );
}
