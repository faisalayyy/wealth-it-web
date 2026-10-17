'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { AppButtons } from '@/components/AppButtons';
import { coined } from '@/components/Coin';
import { Mark } from '@/components/Logo';
import { Phone } from '@/components/Phone';
import { site } from '@/lib/site';
import s from './Closing.module.css';

/**
 * The next step, at the end of every page: a Forest panel with the mark, the brand's line and the
 * store buttons, which say "Coming soon" and lead nowhere until the app is listed (src/lib/site.ts).
 * Three phones rise out of its lower edge as it comes into view: Home in the middle, budgets and
 * goals either side.
 */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const phones = root.current!.querySelectorAll('[data-phone]');
      gsap.fromTo(
        phones,
        { yPercent: (i: number) => (i === 1 ? 26 : 40) },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current!.querySelector('[data-panel]'), start: 'top 85%', end: 'bottom bottom', scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} id="get" aria-labelledby="get-title">
      <div className={`wrap ${s.panel}`} data-panel>
        <div className={s.body}>
          <Mark className={s.mark} tone="dark" />
          <h2 id="get-title" className={`display-1 ${s.title}`}>
            {site.tagline.split(/(?<=\.) /).map((line, i, all) => (
              <span key={line} className={s.line}>
                {i === all.length - 1 ? coined(line) : line}
              </span>
            ))}
          </h2>
          <p className={`lead ${s.lead}`}>Wealthit is coming soon. Your first record takes a few seconds, and that’s where the habit starts.</p>
          <AppButtons tone="light" className={s.buttons} />
        </div>
        <div className={s.phones} aria-hidden>
          <div className={s.side} data-phone>
            <Phone screen="budgets-dark" variant="device" className={s.phone} sizes="(max-width: 743px) 40vw, 260px" alt="" />
          </div>
          <div className={s.middle} data-phone>
            <Phone screen="home-dark" variant="device" className={s.phone} sizes="(max-width: 743px) 50vw, 300px" alt="" />
          </div>
          <div className={s.side} data-phone>
            <Phone screen="goals-dark" variant="device" className={s.phone} sizes="(max-width: 743px) 40vw, 260px" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
