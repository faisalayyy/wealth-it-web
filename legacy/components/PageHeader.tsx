'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, SplitText, useGSAP } from '@/animation/gsap';
import s from './PageHeader.module.css';

/**
 * The header of an inner page — the reference's shorter header: the brand ground, a title set
 * large at the bottom left with its letters rising in, and one line beside it.
 */
export function PageHeader({ title, description }: { title: string; description: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const split = SplitText.create(root.current!.querySelector('h1')!, { type: 'chars,words', mask: 'chars', charsClass: 'hc' });
      gsap.from(split.chars, { yPercent: 105, rotate: 3, duration: 0.8, stagger: 0.01, ease: 'power3', delay: 0.2 });
    },
    { scope: root },
  );
  return (
    <header ref={root} className={s.header} data-ground="lime">
      <div className={`g-row ${s.row}`}>
        <div className={`g-col ${s.left}`}>
          <h1 className="title-2 -medium">{title}</h1>
        </div>
        <div className={`g-col ${s.right}`}>
          <p className="subhead-2 -medium">{description}</p>
        </div>
      </div>
    </header>
  );
}
