'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP, vh } from '@/animation/gsap';
import { Phone } from '@/components/Phone';
import s from './Statement.module.css';
import { PieceImage, pieceWidth, Words, type Part } from './Story';

/**
 * The idea in one sentence (the reference's statement): the page holds still while the sentence
 * darkens word by word, with pieces of the real app set between the words — the total across every
 * wallet, a budget that is over, a bill waiting, a goal, the month's spending ring. Then a phone
 * rises with Home on it, and the pieces fly down into it: everything the sentence names ends up on
 * one screen.
 */
const PARTS: Part[] = [
  'Wealthit adds up every account',
  { crop: 'total', label: 'remaining this month across six wallets: AED 97,749.56' },
  ', every budget',
  { crop: 'over-tile', label: 'Food & Drink, AED 391.88 over budget' },
  ', every bill',
  { cut: 'bill-waiting', label: 'Electricity & water, due 11 October, AED 420' },
  ' and every goal',
  { crop: 'goal-card', label: 'a new car: AED 6,500 saved of AED 20,000' },
  ' — so you always know where you stand',
  { crop: 'ring', label: 'spent this month: AED 8,302.62, by category' },
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
              <span className={s.chip} data-chip style={{ width: pieceWidth(p) }}>
                <PieceImage p={p} className={s.crop} />
              </span>
            )}
          />
        </p>
        <div className={s.phoneRow}>
          <div data-phone>
            <Phone screen="home-light" variant="device" className={s.phone} sizes="320px" alt="Wealthit's Home: AED 97,749.56 remaining this month across six wallets" />
          </div>
        </div>
      </div>
    </section>
  );
}
