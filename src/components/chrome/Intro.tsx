'use client';

/**
 * The opening.
 *
 * Deliberately almost nothing: a ruled veil that lifts as soon as the face has loaded, capped
 * at 900ms whether it has or not. There is no progress bar, because there is nothing to
 * measure — the page is a static file and it is already here. A loader that invents a wait in
 * order to look expensive is the oldest lie on the web, and this site is about not telling that
 * kind of lie. The real opening is the hero assembling itself, which is content rather than a
 * curtain in front of it.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Intro.module.css';

export function Intro() {
  const veil = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setDone(true); return; }
    let cancelled = false;
    const lift = () => {
      if (cancelled) return;
      cancelled = true;
      gsap.timeline({ onComplete: () => setDone(true) })
        .to(`.${styles.bar}`, {
          scaleY: 0, duration: 0.9, ease: 'power4.inOut',
          stagger: { each: 0.045, from: 'center' }, transformOrigin: 'top center',
        })
        .to(veil.current, { autoAlpha: 0, duration: 0.2 }, '-=0.3');
    };
    const cap = window.setTimeout(lift, 900);
    document.fonts?.ready.then(() => window.setTimeout(lift, 120));
    return () => { clearTimeout(cap); cancelled = true; };
  }, [reduced]);

  if (done) return null;

  return (
    <div ref={veil} className={styles.veil} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => <div key={i} className={styles.bar} />)}
    </div>
  );
}
