'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { Phone } from '@/components/Phone';
import { Cut } from '@/components/Screen';
import { Words } from './Story';
import s from './Planning.module.css';

/**
 * What is coming (the reference's "Create more, faster"): a statement at the left and a large
 * light panel at the right, where the scheduled payments screen rises as the section comes in and
 * the bill that is waiting floats over it.
 */
export function Planning() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      gsap.fromTo(
        el.querySelectorAll('[data-w]'),
        { opacity: 0.12, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'center 55%', scrub: 0.5 } },
      );
      gsap.fromTo(el.querySelector('[data-rise]'), { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
      gsap.fromTo(el.querySelector('[data-float]'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'center center', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} aria-labelledby="planning-title" data-ground="light">
      <div className={`wrap ${s.grid}`}>
        <div>
          <p className="cap">Bills & schedules</p>
          <h2 id="planning-title" className={`story ${s.title}`}>
            <Words parts={['Bills that remember themselves — on the day, and never twice.']} />
          </h2>
          <p className={`lead ${s.lead}`}>
            Set up rent, salary or a subscription once. On the day it records itself, or waits for you to say Record it or Skip this
            time. The next 30 days are always one screen away.
          </p>
        </div>
        <div className={s.panel}>
          <div className={s.phoneWrap} data-rise>
            <Phone screen="schedules-light" variant="device" className={s.phone} sizes="(max-width: 743px) 60vw, 320px" alt="Scheduled payments in Wealthit: the next 30 days" />
          </div>
          <div className={s.float} data-float>
            <Cut name="bill-waiting" className={s.bill} sizes="(max-width: 743px) 80vw, 400px" />
          </div>
        </div>
      </div>
    </section>
  );
}
