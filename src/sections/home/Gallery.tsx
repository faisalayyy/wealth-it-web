'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Button } from '@/components/Button';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import type { ScreenName } from '@/lib/screens';
import { useJump } from './useJump';
import s from './Gallery.module.css';

/**
 * Breadth (the reference's gallery): a big rounded panel holding a row of the app's real screens,
 * each named. The row scrolls sideways by trackpad, by dragging with a mouse, or with the arrows,
 * which grey out at either end.
 */
const SHOTS: { screen: ScreenName; name: string; area: string }[] = [
  { screen: 'home-dark', name: 'Home', area: 'Where you stand' },
  { screen: 'wallets-dark', name: 'Wallets', area: 'Every account' },
  { screen: 'record-sheet-dark', name: 'Recording', area: 'Finish the sentence' },
  { screen: 'scan-reading-dark', name: 'Scan a receipt', area: 'Read on your phone' },
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
  const rail = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const jump = useJump();

  const measure = () => {
    const el = rail.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const by = (dir: number) => {
    const el = rail.current!;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const down = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { x: e.clientX, left: rail.current!.scrollLeft, moved: false };
  };
  const move = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    rail.current!.scrollLeft = d.left - dx;
  };
  const up = () => {
    drag.current = null;
  };

  return (
    <section className={s.section} aria-labelledby="gallery-title" data-ground="light">
      <div className={`wrap ${s.head}`}>
        <p className="cap">Inside the app</p>
        <h2 id="gallery-title" className="display-2">
          {coined('Every screen here is the real app.')}
        </h2>
      </div>
      <div className={`wrap ${s.panel}`}>
        <ul
          ref={rail}
          className={s.rail}
          onScroll={measure}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          aria-label="Screens from the app"
          tabIndex={0}
        >
          {SHOTS.map((sh, i) => (
            <li key={sh.screen} className={s.item} data-size={i % 3 === 1 ? 'tall' : 'short'}>
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
