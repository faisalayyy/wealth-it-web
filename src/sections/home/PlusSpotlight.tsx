'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { PlusCard } from '@/components/PlusCard';
import { PlusMark } from '@/components/PlusMark';
import { plus } from '@/lib/site';
import s from './PlusSpotlight.module.css';

/**
 * Wealthit+ on the homepage (Faisal's pick A · Spotlight, 18 Nov): the metal card beside the pitch, on
 * a panel lit in gold, one gold button to /plus. Gold is only Wealthit+'s (CLAUDE.md).
 */
export function PlusSpotlight() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => reveal(root.current), { scope: root });
  return (
    <section ref={root} className={s.section} aria-labelledby="plus-title" data-ground="dark">
      <div className={`wrap ${s.panel}`} data-tilt="">
        <div className={s.copy}>
          <p className={s.tag} data-reveal>
            <PlusMark className={s.tagMark} />
            <span className={s.foil}>{plus.name}</span>
          </p>
          <h2 id="plus-title" className={s.title} data-reveal>
            More room for big goals<span className={s.stop}>.</span>
          </h2>
          <ul className={s.list} data-reveal>
            <li>Unlimited wallets</li>
            <li>Your full history and a year in review</li>
            <li>PDF and CSV exports, and Goals</li>
          </ul>
          <div className={s.row} data-reveal>
            <Link href="/plus/" className={s.gold}>
              Explore {plus.name}
            </Link>
            <span className={s.note}>Try it for {plus.trialDays} days. From Rs 249.92 a month, billed yearly.</span>
          </div>
        </div>
        <div className={s.card}>
          <PlusCard />
        </div>
      </div>
    </section>
  );
}
