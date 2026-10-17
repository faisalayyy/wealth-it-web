'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { coined } from '@/components/Coin';
import { Photo } from '@/components/Photo';
import s from './Moments.module.css';

/**
 * The human side: three photographs of the app on an iPhone in someone's hand, in the moments it
 * is for (on the sofa, over a coffee, paying at a till), each with the real screen on the phone
 * (scripts/compose.mjs). The captions say what the app does there; the people are models, not
 * users, and nothing here says otherwise.
 */
const SHOTS = [
  { name: 'home-sofa', h: 1201, alt: 'Someone on a sofa looking at Wealthit’s Home on an iPhone', caption: 'Where you stand, as soon as it opens.' },
  { name: 'cafe-record', h: 1013, alt: 'A hand holding an iPhone showing Wealthit’s record sheet, in a café', caption: 'Written down before the coffee cools.' },
  {
    name: 'till-tap',
    h: 1350,
    alt: 'Paying at a till with an iPhone, Wealthit’s Tap to Record card on the Lock Screen: Harbour Lane Supermarket, AED 86.50, with Cancel and Add',
    caption: 'Paid, and ready to tap Add.',
  },
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
