'use client';

import { useRef } from 'react';
import { gsap, isTouch, reducedMotion, ScrollTrigger, useGSAP, vw } from '@/animation/gsap';
import { Screen } from '@/components/Screen';
import s from './Principles.module.css';

/**
 * Where the reference quotes its customers, Wealth-it states its rules. There are no testimonials
 * to show — the app has not shipped — and inventing some would break the first rule of this site.
 * These are the rules the app is actually built on (its docs/DECISIONS.md), each one something a
 * person can check for themselves.
 *
 * The cards start as a deck, each a little smaller and tucked under the one before, and deal
 * themselves out into a column as the section scrolls past, over a giant real capture.
 */
const RULES = [
  {
    title: 'Balances are worked out, never stored',
    text: 'Every figure comes from what you recorded, so nothing can fall out of step with anything else.',
    who: 'Ledger',
    tint: '#8E9BC4',
  },
  {
    title: 'A transfer is never spending',
    text: 'Moving money between your own wallets changes two balances — and no budget, total or chart.',
    who: 'Transfers',
    tint: '#6FBFA0',
  },
  {
    title: 'No invented exchange rates',
    text: 'A rate you actually got, the dirham’s peg, or the day’s published rate. Anything else is shown in its own currency and named.',
    who: 'Currencies',
    tint: '#C8F24E',
  },
  {
    title: 'A payment can never post twice',
    text: 'Each scheduled payment knows its own date, so opening the app twice on rent day still records the rent once.',
    who: 'Planning',
    tint: '#D9A066',
  },
];

export function Principles() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion() || isTouch()) return;
      const q = gsap.utils.selector(root);
      const list = q('[data-cards]')[0] as HTMLElement;
      const cards = q('[data-card-li]') as HTMLElement[];

      const measure = () => {
        const margin = (vw(100) * 120) / 1700;
        const gap = (vw(100) * 6) / 1700;
        const heights = cards.map(c => c.offsetHeight);
        const align = heights[0];
        const smallest = Math.min(...heights);
        return { margin, gap, heights, align, smallest, bounds: list.offsetHeight };
      };
      let m = measure();
      ScrollTrigger.addEventListener('refreshInit', () => (m = measure()));

      cards.slice(1).forEach((li, e) => {
        const card = li.firstElementChild as HTMLElement;
        const i = e + 1;
        const geo = () => {
          const h = m.heights[i];
          const offset = h - m.align;
          const top = li.offsetTop + offset;
          const bottom = m.bounds - top - h;
          return { h, offset, top, bottom, gap: m.gap * i };
        };
        gsap.from(card, {
          ease: 'none',
          y: () => -geo().top + geo().gap,
          scale: 1 - 0.07 * i,
          scrollTrigger: {
            trigger: list,
            start: () => `top+=${m.margin + geo().h - geo().offset} bottom`,
            end: () => `bottom+=${m.margin - geo().bottom - geo().offset - geo().gap} bottom`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        if (m.heights[i] > m.smallest) {
          gsap.from(card, {
            ease: 'none',
            clipPath: () => `inset(${m.heights[i] - m.smallest}px 0 0 0 round 16px)`,
            scrollTrigger: {
              trigger: li,
              start: () => `top+=${m.margin} bottom`,
              end: () => `bottom+=${m.margin - 0.5 * m.heights[i]} bottom`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      // the capture behind drifts a little slower than the page
      const bg = q('[data-bg]')[0];
      gsap.fromTo(bg, { yPercent: -6.6 }, { yPercent: 6.6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} id="rules" aria-labelledby="rules-title" data-ground="dark">
      <div className={s.background} aria-hidden>
        <div className={s.capture} data-bg>
          <Screen name="activity" sizes="100vw" alt="" className={s.shot} />
        </div>
        <div className={s.veil} />
      </div>
      <div className={`g-row ${s.center}`}>
        <h2 id="rules-title" className={`g-col title-3 xs-title-4 -medium ${s.title}`}>
          Built on a few{'\n'}firm rules
        </h2>
      </div>
      <ul className={`${s.cards} body -book`} data-cards>
        {RULES.map(r => (
          <li key={r.title} data-card-li>
            <div className={s.card}>
              <p>{r.title}</p>
              <p className={s.text}>{r.text}</p>
              <div className={s.who}>
                <span className={s.avatar} style={{ background: r.tint }} aria-hidden>
                  {r.who.slice(0, 2)}
                </span>
                <span>{r.who}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
