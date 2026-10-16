'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { isTouch, ScrollTrigger, useGSAP } from '@/animation/gsap';
import s from './ScrollStack.module.css';

/**
 * Full-screen cards stacked on one another, the reference's ScrollStack: the stack holds still
 * while the page scrolls, and each card in turn slides up and away to show the next, the ones
 * underneath easing up a touch as it goes. Each card carries its number and name at the bottom
 * left. On a touch screen the cards simply follow one another down the page.
 *
 * The motion is the reference's own: over the whole pass (the stack's top meeting the screen's
 * bottom, to its bottom leaving the top) card i's own progress is `(p − i/(n+1))·(n+1)`, and it is
 * lifted by that card's height times:
 *   first  clamp(s − 1)
 *   last   clamp(s + 0.2, 0, 2) · 0.025
 *   others 0.025·c + lerp(0.025·c, clamp(s − 1), (s/2)²),  c = clamp(s)
 */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function ScrollStack({ views, className }: { views: { name: string; content: ReactNode }[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (isTouch()) return;
      el.dataset.method = 'transform';
      const cards = [...el.querySelectorAll<HTMLElement>('[data-view]')];
      const n = cards.length;
      const lift = (i: number, s: number) => {
        if (i === 0) return clamp(s - 1);
        if (i === n - 1) return clamp(s + 0.2, 0, 2) * 0.025;
        const c = clamp(s);
        return 0.025 * c + lerp(0.025 * c, clamp(s - 1), Math.pow(s / 2, 2));
      };
      const scrub = (p: number) => {
        const h = cards[0].offsetHeight;
        cards.forEach((card, i) => {
          const s = (p - i / (n + 1)) * (n + 1);
          const live = s >= -0.3 && s <= 2.3;
          card.dataset.active = String(live);
          if (live) card.style.transform = `translate3d(0, ${-lift(i, s) * h}px, 0)`;
        });
      };
      scrub(0);
      ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onUpdate: self => scrub(self.progress), onRefresh: self => scrub(self.progress) });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`${s.stack} ${className ?? ''}`} data-method="none" style={{ '--length': views.length } as CSSProperties}>
      <div className={s.slot}>
        {views.map((v, i) => (
          <div key={v.name} className={s.view} data-view style={{ '--index': i } as CSSProperties}>
            <div className={s.inner}>
              <div className={s.bg} />
              <div className={s.content}>{v.content}</div>
              <div className={`${s.name} -book`} aria-hidden>
                <span className={s.index}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span>{v.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
