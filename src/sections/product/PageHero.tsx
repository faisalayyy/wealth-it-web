'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, reducedMotion, SplitText, useGSAP } from '@/animation/gsap';
import { introLate } from '@/animation/intro';
import { fullStop } from '@/components/Stop';
import s from './PageHero.module.css';

/**
 * A page's first screen, after the reference's product page: a caption, a centred headline whose
 * letters rise into place, a line under it, what to do next, and the app below in a large panel
 * that settles as the page starts to scroll.
 */
export function PageHero({
  cap,
  title,
  lead,
  actions,
  media,
  dark = true,
}: {
  cap?: string;
  title: string;
  lead: string;
  actions?: ReactNode;
  media?: ReactNode;
  dark?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      const h1 = el.querySelector('h1')!;
      // the intro only when it can play on time (src/animation/intro.ts); the split is undone when it lands
      const split = introLate() ? null : SplitText.create(h1, { type: 'words,chars', wordsClass: s.word });
      if (split) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => split.revert() });
        tl.from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.016 }, 0.1)
          .from(el.querySelectorAll('[data-in]'), { opacity: 0, y: 18, duration: 1, stagger: 0.08 }, 0.45)
          .from(el.querySelector('[data-panel]'), { opacity: 0, y: 80, duration: 1.4 }, 0.5);
      }
      const panel = el.querySelector('[data-panel]');
      if (panel)
        gsap.fromTo(panel, { scale: 0.94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 25%', scrub: true } });
      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.hero} data-ground="light" data-bare={media ? undefined : ""}>
      <div className={`wrap ${s.head}`}>
        {cap && (
          <p className="cap" data-in>
            {cap}
          </p>
        )}
        <h1 className={`display-1 ${s.title}`}>{fullStop(title)}</h1>
        <p className={`lead ${s.lead}`} data-in>
          {lead}
        </p>
        {actions && (
          <div className={s.actions} data-in>
            {actions}
          </div>
        )}
      </div>
      {media && (
        <div className="wrap">
          <div className={s.panel} data-panel data-dark={dark ? '' : undefined}>
            {media}
          </div>
        </div>
      )}
    </section>
  );
}
