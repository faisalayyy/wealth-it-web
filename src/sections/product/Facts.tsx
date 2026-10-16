'use client';

import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { coined } from '@/components/Coin';
import type { Fact } from '@/lib/features';
import s from './Facts.module.css';

/** The smaller things, as a grid of cards: a title and a line or two each. */
export function Facts({ title = 'And the smaller things.', facts }: { title?: string; facts: Fact[] }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => reveal(root.current), { scope: root });
  return (
    <section ref={root} className={s.section} data-ground="light">
      <div className="wrap">
        <h2 className={`display-2 ${s.title}`} data-reveal>
          {coined(title)}
        </h2>
        <ul className={s.grid}>
          {facts.map(f => (
            <li key={f.title} className={s.card} data-reveal>
              <span className={s.dot} aria-hidden />
              <h3 className={s.name}>{f.title}</h3>
              <p className={s.text}>{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
