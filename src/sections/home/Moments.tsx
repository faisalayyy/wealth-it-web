'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { coined } from '@/components/Coin';
import { Photo } from '@/components/Photo';
import s from './Moments.module.css';

/**
 * The human side: three photographs of the app in someone's hands, in the moments it is for — on
 * the sofa, over a coffee, at the shops — each with the real screen on the phone
 * (scripts/compose.mjs). The captions say what the app does there; the people are models, not
 * users, and nothing here says otherwise.
 */
const SHOTS = [
  { name: 'sofa-phone', h: 1013, alt: 'Someone on a sofa looking at Wealthit’s Home on their phone', caption: 'Where you stand, the moment it opens.' },
  { name: 'cafe-phone', h: 1201, alt: 'A hand holding a phone showing Wealthit’s record sheet, beside a coffee', caption: 'Written down before the coffee cools.' },
  { name: 'shopping-phone', h: 1200, alt: 'Hands holding a card and a phone showing Wealthit’s budgets, beside shopping bags', caption: 'Your budgets, at the till.' },
];

export function Moments() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      reveal(root.current);
      if (reducedMotion()) return;
      root.current!.querySelectorAll<HTMLElement>('[data-zoom]').forEach(el =>
        gsap.fromTo(el, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }),
      );
    },
    { scope: root },
  );
  return (
    <section ref={root} className={s.section} aria-labelledby="moments-title" data-ground="light">
      <div className={`wrap ${s.head}`}>
        <p className="cap" data-reveal>
          In everyday life
        </p>
        <h2 id="moments-title" className={`display-2 ${s.title}`} data-reveal>
          {coined('Less adding up. More living.')}
        </h2>
      </div>
      <div className={`wrap ${s.grid}`}>
        {SHOTS.map((p, i) => (
          <figure key={p.name} className={s.card} data-i={i} data-reveal="scale">
            <div className={s.frame}>
              <div className={s.zoom} data-zoom>
                <Photo name={p.name} alt={p.alt} height={p.h} className={s.photo} sizes={i === 0 ? '(max-width: 899px) 100vw, 62vw' : '(max-width: 899px) 100vw, 34vw'} />
              </div>
            </div>
            <figcaption className={s.caption}>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
