'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { coined } from '@/components/Coin';
import { Photo } from '@/components/Photo';
import s from './Moments.module.css';

/**
 * The human side: three photographs of the moments the app is for (at home with a phone, over a
 * coffee with a friend, paying at a till, where the phone shows the real Lock Screen card, from
 * scripts/compose.mjs). The captions say what the app does there; the people are models, not
 * users, and nothing here says otherwise.
 */
const SHOTS = [
  { name: 'phone-smile', h: 2700, alt: 'A young woman in a beige hijab smiling at her phone at home', caption: 'Where you stand, as soon as it opens.' },
  { name: 'cafe-chat', h: 1200, alt: 'A woman in a mustard hijab and a man chatting over drinks at a café table', caption: 'Written down before the bill arrives.' },
  {
    name: 'till-tap',
    h: 1350,
    alt: 'Paying at a till with a phone, Wealthit’s Tap to Record card on the Lock Screen: Harbour Lane Supermarket, AED 86.50, with Cancel and Add',
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
