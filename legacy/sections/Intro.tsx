'use client';

import { useRef } from 'react';
import { BP, gsap, reducedMotion, useGSAP, vh } from '@/animation/gsap';
import { Icon } from '@/components/Icon';
import { Crop } from '@/components/Screen';
import type { CropName } from '@/lib/screens';
import s from './Intro.module.css';

/**
 * "See the whole picture." The statement holds the middle of the screen, starting twice its size
 * and shrinking away to nothing, while five pieces of the real app come in from the edges of the
 * screen, pass through their places around it and gather at the centre — the Dashboard's ring,
 * an over-budget tile, the expense sentence, a cross-currency transfer and the subcategory picker.
 *
 * Then the three things you can write down, stacking one under the other: Expense, Income,
 * Transfer — the app's own + menu, in its own colours.
 */
const SNIPPETS: Array<{ crop: CropName; frame: string; alt: string }> = [
  { crop: 'snip-transfer', frame: '#6FA8B8', alt: 'A transfer: 500 US dollars sent, 1,836.25 dirhams received, at 1 USD = 3.6725 AED' },
  { crop: 'snip-ring', frame: '#8E9BC4', alt: 'The Dashboard ring: 14,398.35 dirhams spent this month' },
  { crop: 'snip-tile', frame: '#D9A066', alt: 'Food & Drink: 428.80 dirhams over budget' },
  { crop: 'snip-sentence', frame: '#C8F24E', alt: 'I spent AED 48.5 on Bar, cafe from Emirates NBD, today' },
  { crop: 'snip-picker', frame: '#B889B0', alt: 'What was it for: Groceries, Restaurant, Bar, cafe' },
];

const TAGLINES = [
  { label: 'Expense', icon: 'expense', fill: '#E2664F', text: '#AE3627' },
  { label: 'Income', icon: 'income', fill: '#5BC98C', text: '#0F6E45' },
  { label: 'Transfer', icon: 'transfer', fill: '#6FA8B8', text: '#2F6474' },
];

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(root);
      const header = q('[data-header]')[0] as HTMLElement;
      const title = q('[data-title]')[0] as HTMLElement;
      const box = q('[data-snippets]')[0] as HTMLElement;
      const snippets = q('[data-snippet]') as HTMLElement[];

      // where a snippet's container sits, and two places to send it: just past the edge of the
      // screen along the line from the centre through it, and the centre itself
      const offsets = (el: HTMLElement) => {
        const li = el.parentElement!;
        const W = box.offsetWidth;
        const H = box.offsetHeight;
        const w = li.offsetWidth;
        const h = li.offsetHeight;
        const cx = li.offsetLeft + w / 2;
        const cy = li.offsetTop + h / 2;
        const dx = cx - W / 2 || 0.001;
        const dy = cy - H / 2 || 0.001;
        const t = Math.min((W / 2 + w / 2) / Math.abs(dx), (H / 2 + h / 2) / Math.abs(dy));
        return {
          edge: { x: W / 2 + dx * t - cx, y: H / 2 + dy * t - cy },
          center: { x: W / 2 - cx, y: H / 2 - cy },
        };
      };

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
          trigger: header,
          scrub: true,
          start: () => `top-=${vh(10)} top`,
          end: () => `bottom+=${vh(50)}px bottom`,
          invalidateOnRefresh: true,
        },
      });
      // wide, the title is set at twice its size (see the CSS) and runs 2 → 0.3 of it as 1 → 0.15;
      // kept 2D so it is never lifted onto a layer and drawn as a picture
      tl.fromTo(title, { scale: 1 }, { scale: () => (innerWidth > BP.sm ? 0.15 : 0.3), duration: 2, force3D: false }, 0).to(
        title,
        { opacity: 0, duration: 0.1 },
        1.6,
      );
      snippets.forEach(el => {
        tl.set(el, { opacity: 1 }, 0)
          .set(el.parentElement, { xPercent: 0, yPercent: 0, x: 0, y: 0 }, 0)
          .fromTo(
            el,
            { x: () => offsets(el).edge.x, y: () => offsets(el).edge.y },
            { x: () => offsets(el).center.x, y: () => offsets(el).center.y, duration: 2, ease: 'power1.inOut' },
            0,
          );
      });

      // the three kinds of record rise into their places, one under another
      q('[data-tagline]').forEach(el => {
        gsap.from(el, {
          ease: 'none',
          opacity: 0.8,
          yPercent: 100,
          scrollTrigger: { trigger: el.parentElement, start: 'top center', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.intro} id="overview" aria-labelledby="intro-title" data-ground="light">
      <header className={s.header} data-header>
        <div className={s.sticky}>
          <div className={s.titleBox}>
            <h2 id="intro-title" className={`${s.title} -medium`} data-title>
              See the{'\n'}whole picture
            </h2>
          </div>
          <ul className={s.snippets} data-snippets>
            {SNIPPETS.map(sn => (
              <li key={sn.crop}>
                <div className={s.snippet} data-snippet style={{ '--frame': sn.frame } as React.CSSProperties}>
                  <Crop name={sn.crop} alt={sn.alt} className={s.crop} lazy={false} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div>
        <ul className={`${s.taglines} title-2`} style={{ '--items': TAGLINES.length } as React.CSSProperties}>
          {TAGLINES.map((t, i) => (
            <li key={t.label} style={{ '--fill': t.fill, '--text': t.text, '--index': i } as React.CSSProperties}>
              <div className={s.tagline} data-tagline>
                <span className={s.iconCard}>
                  <Icon name={t.icon} size={48} stroke={2} className={s.icon} />
                </span>
                <h3 className="-medium">{t.label}</h3>
              </div>
            </li>
          ))}
          <li />
        </ul>
      </div>
    </section>
  );
}
