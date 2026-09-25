'use client';

/**
 * THE CLOSE.
 *
 * Everything the reader has been moving through resolves into four words and a name. The words
 * are not adjectives about the product; they are the four operations the whole site has been
 * performing in front of them — record a thing, derive a figure from it, project it forward,
 * decide something. Each arrives as its own line, and then the name takes their place.
 *
 * The footer is not an afterthought bolted below it. It is the same movement continuing to its
 * end: the rules close up, and what is left is the one honest sentence about where the app
 * actually is.
 */

import { useRef } from 'react';
import { CONVERGE, FOOTER_NOTE, nav, site } from '@/lib/content';
import { LEDGER } from '@/lib/ledger';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMagnetic } from '@/hooks/useMagnetic';
import { TLink } from '@/components/providers/Transition';
import styles from './Converge.module.css';

export function Converge() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const cta = useMagnetic<HTMLAnchorElement>(0.45);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 5%', scrub: 0.8 },
      });
      tl.fromTo(`.${styles.word}`,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.5, ease: 'expo.out' })
        .fromTo(`.${styles.name}`,
          { opacity: 0, letterSpacing: '0.24em' },
          { opacity: 1, letterSpacing: '-0.045em', ease: 'power3.out', duration: 1.4 }, '>-0.3');
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer ref={root} id="enter" className={styles.close}>
      <div className={styles.words} aria-hidden="true">
        {CONVERGE.map(w => (
          <span key={w} className={styles.wordMask}><span className={styles.word}>{w}</span></span>
        ))}
      </div>

      <h2 className={styles.name}>{site.name}</h2>
      <p className={styles.sub}>{site.description}</p>

      <div className={styles.actions}>
        <a
          ref={cta}
          className={styles.cta}
          href="https://github.com/faisalayyy/wealth-it-web"
          data-cursor="link"
          rel="noreferrer"
        >
          <span className="mono">Not in the stores yet</span>
          <span aria-hidden="true" className={styles.ctaRule} />
        </a>
        <p className={`mono ${styles.ctaNote}`}>
          iPhone and Android. The link will be here on the day it is real.
        </p>
      </div>

      <div className={styles.foot}>
        <nav className={styles.footNav} aria-label="Footer">
          {nav.map(item => (
            <TLink key={item.href} href={item.href} data-cursor="link">{item.label}</TLink>
          ))}
        </nav>
        <p className={`mono ${styles.note}`}>{FOOTER_NOTE.replace('one generated ledger of', `one generated ledger of ${LEDGER.length}`)}</p>
        <p className={`mono ${styles.fine}`}>
          © {new Date().getFullYear()} {site.name} · no cookies, no analytics, nothing here that would know you came
        </p>
      </div>
    </footer>
  );
}
