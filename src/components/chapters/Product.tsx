'use client';

/**
 * CHAPTER 06 — THE PRODUCT.
 *
 * The merge. The site does not show a phone floating in space with a screenshot inside it; the
 * page itself narrows into the app's proportions and the app's surface comes up through it,
 * carrying the same ledger the reader has been scrubbing for five chapters. The figures in the
 * app surface below are the identical `balanceAt` and `spendByCategory` calls that drove the
 * hero — which is the only reason this is allowed to be a picture of software rather than a
 * picture of a device.
 */

import { useRef } from 'react';
import {
  BALANCE_TODAY, LEDGER, MONTH, CATEGORIES,
  money, money0, spendByCategory, split, dateAt,
} from '@/lib/ledger';
import { CHAPTERS } from '@/lib/content';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Product.module.css';

const CH = CHAPTERS[5]!;
const TOP = spendByCategory(-30, 0).slice(0, 4);
const RECENT = LEDGER.filter(tx => tx.t <= 0).slice(-3).reverse();
const hero = split(BALANCE_TODAY);

export function Product() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      /* The surface rises and squares itself off as the reader arrives — the page becoming a
         screen, rather than a screen being placed on the page. */
      gsap.fromTo(`.${styles.surface}`,
        { scale: 0.86, yPercent: 8, borderRadius: 2 },
        {
          scale: 1, yPercent: 0, borderRadius: 18,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 12%', scrub: 0.5 },
        });
      gsap.fromTo(`.${styles.rowItem}`,
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 45%', once: true },
        });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id={CH.id} className={styles.chapter}>
      <div className={styles.head}>
        <span className={`mono ${styles.index}`}>{CH.index}</span>
        <span className={`mono ${styles.kicker}`}>{CH.kicker}</span>
      </div>

      <Reveal as="h2" className={styles.title} lines>{CH.title.join(' ')}</Reveal>
      <Reveal as="p" className={styles.body} delay={0.1}>{CH.body}</Reveal>

      <div className={styles.surface} aria-label="The Wealth-it dashboard, showing the same ledger" role="img">
        <div className={styles.appBar}>
          <span className="mono">9:41</span>
          <span className="mono">Wealth-it</span>
          <span className="mono">AED</span>
        </div>

        <div className={styles.appHero}>
          <p className="mono">Total balance</p>
          <p className={`fig ${styles.appFigure}`}>
            {hero.int}<span>.{hero.dec}</span>
          </p>
          <p className={`mono ${styles.appNet}`} data-tone={MONTH.net >= 0 ? 'in' : 'out'}>
            {MONTH.net >= 0 ? '+' : '−'}{money0(Math.abs(MONTH.net))} this month
          </p>
        </div>

        <div className={styles.appSplit}>
          <div className={styles.appBarChart}>
            {TOP.map(r => <span key={r.cat} style={{ width: `${r.share * 100}%`, background: r.hue }} />)}
          </div>
          <ul className={styles.appKeys}>
            {TOP.map(r => (
              <li key={r.cat}>
                <i style={{ background: r.hue }} />
                <span>{r.label}</span>
                <span className="mono">{Math.round(r.share * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.appList}>
          {RECENT.map(tx => (
            <li key={tx.id} className={styles.rowItem}>
              <i style={{ background: CATEGORIES[tx.cat].hue }} />
              <span className={styles.rowName}>{tx.payee}</span>
              <span className={`mono ${styles.rowMeta}`}>
                {CATEGORIES[tx.cat].label} · {dateAt(tx.t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' })}
              </span>
              <span className={`fig ${styles.rowAmt}`} data-kind={tx.kind}>
                {tx.kind === 'in' ? '+' : tx.kind === 'out' ? '−' : '↔'}{money(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Reveal as="p" className={styles.caption} delay={0.1}>
        Every figure on that surface is the same call this page has been making since the first
        screen. Nothing was re-typed for the picture.
      </Reveal>
    </section>
  );
}
