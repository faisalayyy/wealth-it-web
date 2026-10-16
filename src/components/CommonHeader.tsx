'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, isTouch, reducedMotion, SplitText, useGSAP } from '@/animation/gsap';
import { scrollToTarget, useLenis } from '@/animation/SmoothScroll';
import { CoinDrop } from './CoinDrop';
import s from './CommonHeader.module.css';

/**
 * The first screen of a page, the reference's CommonHeader: a lime ground with something moving
 * in it, the statement set large at the bottom left, one line at the right with the calls to
 * action under it, and a scroll hint.
 *
 * On load the statement's letters rise out of their own masks (0.8s, 10ms apart); as the page
 * scrolls, the ground drifts down behind the words — it starts a tenth oversized so it can.
 * `background` is drawn inside that ground and is handed a `ready` callback, for grounds that
 * load in and should fade up once they have (the homepage's 3D).
 */
export function CommonHeader({
  title,
  description,
  cta,
  background,
  id,
}: {
  title: string[];
  description: string;
  cta: ReactNode;
  background: (ground: { ready: () => void; className: string }) => ReactNode;
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const heading = root.current!.querySelector('h1')!;
      const bg = root.current!.querySelector<HTMLElement>('[data-bg]')!;
      if (reducedMotion()) return;
      const split = SplitText.create(heading, { type: 'chars,words', mask: 'chars', charsClass: 'hc' });
      gsap.from(split.chars, { yPercent: 105, rotate: 3, duration: 0.8, stagger: 0.01, ease: 'power3', delay: 0.15 });
      if (!isTouch()) {
        gsap.set(bg, { scale: 1.1 });
        gsap.fromTo(bg, { yPercent: 0 }, { yPercent: 15, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      }
    },
    { scope: root },
  );

  const next = () => {
    const el = root.current?.nextElementSibling as HTMLElement | null;
    if (el) scrollToTarget(lenis, el, 1.4);
  };

  return (
    <header ref={root} className={s.header} id={id} data-ground="lime">
      <div className={s.background} data-bg>
        {background({ ready: () => root.current?.setAttribute('data-ready', ''), className: s.canvas })}
      </div>
      <div className={`g-row ${s.main}`}>
        <div className={`g-col ${s.left}`}>
          <h1 className="title-2 -medium">
            {title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
        </div>
        <div className={`g-col ${s.right}`}>
          <p className="subhead-2 -medium">{description}</p>
          <div className={s.ctas}>{cta}</div>
        </div>
      </div>
      <button type="button" className={`${s.hint} caption`} onClick={next}>
        <span className={s.hintRow}>
          <CoinDrop />
          <span>Scroll</span>
        </span>
      </button>
    </header>
  );
}
