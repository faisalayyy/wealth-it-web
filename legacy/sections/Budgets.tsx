'use client';

import { useRef } from 'react';
import { gsap, isTouch, reducedMotion, useGSAP } from '@/animation/gsap';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { ThreeCanvas } from '@/three/ThreeCanvas';
import s from './Budgets.module.css';

/**
 * Budgets, presented the way the reference presents its flagship card: a tag, three short
 * questions answered, a wide film of the object, and a closing line with one button. The film is
 * a live scene — the app's real Food & Drink budget on a slab turning over a field of pedestals —
 * and it rises into place, a little tilted, as it scrolls in.
 */
export function Budgets() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion() || isTouch()) return;
      const media = root.current!.querySelector('[data-media]')!;
      gsap.from(media, {
        duration: 0.55,
        yPercent: 10,
        scale: 0.9,
        rotate: -2,
        scrollTrigger: { trigger: media.parentElement, start: 'top bottom', end: 'center center', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} id="budgets" aria-labelledby="budgets-title" data-ground="light">
      <div className={`g-row ${s.center}`}>
        <div className={`g-col ${s.top}`}>
          <Tag>Budgets</Tag>
          <h2 id="budgets-title" className={`title-5 -medium ${s.title}`}>
            Spending limits? Set.
            {'\n'}Running low? Flagged.
            {'\n'}Gone over? Told in time.
          </h2>
        </div>
      </div>
      <div className={`g-row ${s.center} ${s.mediaRow}`}>
        <div className={`g-col ${s.mediaCol}`}>
          <div className={s.media} data-media>
            <ThreeCanvas scene="pedestals" className={s.canvas} />
            <span className="sr-only">The app&rsquo;s Food &amp; Drink budget: 428.80 dirhams over, 123% of 1,900 used.</span>
          </div>
        </div>
      </div>
      <div className={`g-row ${s.center}`}>
        <div className={`g-col ${s.bottom} -medium`}>
          <h3 className="title-3">Know before it runs out</h3>
          <p className={`subhead-2 ${s.lead}`}>
            Set a limit for any category, weekly or monthly. The app sorts them into over, running out early and on
            pace — while there is still time to do something about it.
          </p>
          <div className={s.ctas}>
            <Button label="Get Wealth-it" href="/#get" tone="brand" variant="primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
