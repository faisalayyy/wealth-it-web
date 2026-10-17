'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { TapPhone } from '@/components/TapPhone';
import s from './TapToRecord.module.css';

/**
 * Tap to Record (App/docs/TAP_TO_RECORD.md, decisions A348, A349, A353, A354): pay with Apple Pay
 * and the payment is waiting on the Lock Screen, filled in, for Add or Cancel. The headline is the
 * App Store poster's. What it needs is said plainly: an iPhone, Apple Pay, one setup.
 */
const STEPS = [
  { title: 'Set it up once', text: 'Add Wealthit’s shortcut in the Shortcuts app and switch it on. The app walks you through it.' },
  { title: 'Pay as you always do', text: 'Apple Pay passes on the shop, the amount and the card. There is nothing to type.' },
  { title: 'Tap Add', text: 'The category comes from the shop and the wallet from the card. The first time you use a card, you choose its wallet.' },
];

export function TapToRecord() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      gsap.from(el.querySelectorAll('[data-step]'), {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.querySelector('[data-steps]'), start: 'top 82%' },
      });
      gsap.fromTo(el.querySelector('[data-rise]'), { yPercent: 18 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} id="tap" aria-labelledby="tap-title">
      <div className={`wrap ${s.grid}`}>
        <div className={s.copy}>
          <p className={`cap ${s.cap}`}>
            <Icon name="tap" size={16} stroke={1.8} /> Tap to Record
          </p>
          <h2 id="tap-title" className={`display-2 ${s.title}`}>
            {coined('You paid. It’s already written down.')}
          </h2>
          <p className={`lead ${s.lead}`}>
            Pay with Apple Pay and Wealthit puts the payment on your Lock Screen, already filled in. Tap Add and it’s recorded. Tap
            Cancel and it isn’t.
          </p>
          <ol className={s.steps} data-steps>
            {STEPS.map((st, i) => (
              <li key={st.title} className={s.step} data-step>
                <span className={s.num}>{i + 1}</span>
                <div>
                  <h3 className={s.stepTitle}>{st.title}</h3>
                  <p className={s.stepText}>{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={s.fine}>Works with Apple Pay. Set it up once.</p>
          <Link href="/features/tap-to-record/" className={s.more}>
            How Tap to Record works <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className={s.panel}>
          <div className={s.rise} data-rise>
            <TapPhone className={s.phone} sizes="(max-width: 743px) 64vw, 340px" />
          </div>
        </div>
      </div>
    </section>
  );
}
