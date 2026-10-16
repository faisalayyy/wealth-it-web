'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { Phone } from '@/components/Phone';
import { Words } from './Story';
import s from './Whole.module.css';

/**
 * The whole picture (the reference's third story): a sentence at the left and a dark window at the
 * right; the page holds while the window grows until it nearly fills the screen, showing three
 * real screens side by side — budgets, Home and goals.
 */
export function Whole() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (reducedMotion()) {
        el.dataset.static = '';
        return;
      }
      const q = gsap.utils.selector(el);
      // phones show the window as a plain card (Whole.module.css); the growing window is for wide screens
      gsap.matchMedia().add('(min-width: 900px)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } });
        tl.fromTo(
          q('[data-window]'),
          { clipPath: 'inset(18vh 4vw 18vh 52vw round 24px)' },
          { clipPath: 'inset(1.5vh 1vw 1.5vh 1vw round 24px)', duration: 1, ease: 'power1.inOut' },
          0.15,
        )
          // the Dashboard starts in the middle of the small window, and the others come in beside it
          .fromTo(q('[data-phones]'), { x: () => innerWidth * 0.24, scale: 0.62 }, { x: 0, scale: 1, duration: 1, ease: 'power1.inOut' }, 0.15)
          .to(q('[data-copy]'), { opacity: 0, x: -40, duration: 0.45 }, 0.25)
          .to({}, { duration: 0.2 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.whole} aria-labelledby="whole-title" data-ground="light">
      <div className={s.stage}>
        <div className={`wrap ${s.copyRow}`}>
          <div className={s.copy} data-copy>
            <p className="cap">The whole picture</p>
            <p id="whole-title" className={`story ${s.text}`}>
              <Words parts={['What you have, what is due and what you are saving for — on one screen, nothing left to add up yourself.']} />
            </p>
          </div>
        </div>
        <div className={s.window} data-window>
          <div className={s.phones} data-phones>
            <Phone screen="budgets-dark" variant="device" className={`${s.phone} ${s.side}`} sizes="300px" alt="Budgets: over budget, running out early, going fast" />
            <Phone screen="home-dark" variant="device" className={s.phone} sizes="340px" alt="Home: what is left this month across every wallet" />
            <Phone screen="goals-dark" variant="device" className={`${s.phone} ${s.side}`} sizes="300px" alt="Goals: a new car, a safety net, clearing a car loan" />
          </div>
        </div>
      </div>
    </section>
  );
}
