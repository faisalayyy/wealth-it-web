'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP, vh } from '@/animation/gsap';
import { Phone } from '@/components/Phone';
import s from './Statement.module.css';
import { PieceImage, pieceWidth, Words, type Part } from './Story';

/**
 * The idea in one sentence (the reference's statement): the page holds still while the sentence
 * darkens word by word, with small 3D illustrations set between the words (src/three/art.ts) —
 * a card for the accounts, the spending chart, a calendar, coins stacked to a goal, the mark. Then
 * a phone rises with Home on it, and the pieces fly down into it: everything the sentence names
 * ends up on one screen.
 */
const PARTS: Part[] = [
  'Wealthit adds up every account',
  { art: 'account', label: 'a bank card and a coin', ratio: 1.07 },
  ', every budget',
  { art: 'budget', label: 'a spending chart', ratio: 0.98 },
  ', every bill',
  { art: 'bill', label: 'a calendar with a due day marked', ratio: 0.81 },
  ' and every goal',
  { art: 'goal', label: 'coins stacked up to a flag', ratio: 1.3 },
  ' — so you always know where you stand',
  { art: 'mark', label: 'the Wealthit mark', ratio: 1.25 },
  '.',
];

export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (reducedMotion()) {
        el.dataset.static = '';
        return;
      }
      const q = gsap.utils.selector(el);
      const stage = q('[data-stage]')[0] as HTMLElement;
      const text = q('[data-text]')[0] as HTMLElement;
      const phone = q('[data-phone]')[0] as HTMLElement;
      const bits = q('[data-w], [data-chip]') as HTMLElement[];
      const chips = q('[data-chip]') as HTMLElement[];
      const step = 0.06;

      // where a piece has to travel to land in the middle of the phone's screen
      const target = (chip: HTMLElement) => {
        const st = stage.getBoundingClientRect();
        const r = chip.getBoundingClientRect();
        return { x: st.left + st.width / 2 - (r.left + r.width / 2), y: st.top + st.height * 0.74 - (r.top + r.height / 2) + vh(10) };
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      });
      bits.forEach((b, i) => {
        if (b.dataset.chip !== undefined) tl.fromTo(b, { scale: 0.6, opacity: 0.16 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' }, i * step);
        else tl.fromTo(b, { opacity: 0.16 }, { opacity: 1, duration: 0.25 }, i * step);
      });
      const fly = bits.length * step + 0.5;
      tl.fromTo(phone, { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: 'power2.out' }, fly);
      tl.to(text, { y: () => -vh(10), opacity: 0.18, duration: 1.2 }, fly);
      chips.forEach((c, i) => {
        tl.to(c, { x: () => target(c).x, y: () => target(c).y, scale: 0.4, duration: 0.9, ease: 'power2.inOut' }, fly + 0.15 + i * 0.06);
        tl.to(c, { opacity: 0, duration: 0.2 }, fly + 0.85 + i * 0.06);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} id="how" aria-label="What Wealthit is" data-ground="light">
      <div className={s.stage} data-stage>
        <p className={`statement ${s.text}`} data-text>
          <Words
            parts={PARTS}
            chip={p => (
              <span className={s.chip} data-chip data-art={'art' in p ? '' : undefined} style={{ width: pieceWidth(p) }}>
                <PieceImage p={p} className={s.crop} />
              </span>
            )}
          />
        </p>
        <div className={s.phoneRow}>
          <div data-phone>
            <Phone screen="home-dark" variant="device" className={s.phone} sizes="320px" alt="Wealthit’s Home: the total across eight wallets, spent today, and this month’s spending ring" />
          </div>
        </div>
      </div>
    </section>
  );
}
