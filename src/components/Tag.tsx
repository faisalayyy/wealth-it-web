'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import s from './Tag.module.css';

/**
 * A small pill label over a section title. When it scrolls into view its outline draws itself
 * round the pill while the pill settles from a little larger — a faint track underneath, the line
 * running over it.
 */
export function Tag({ children, tone = 'brand' }: { children: string; tone?: 'brand' | 'ink' }) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const svg = el.querySelector('svg')!;
      const rects = Array.from(svg.querySelectorAll('rect'));
      const size = () => {
        const { width, height } = el.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        rects.forEach(r => {
          r.setAttribute('width', `${width - 1}`);
          r.setAttribute('height', `${height - 1}`);
          r.setAttribute('rx', `${(height - 1) / 2}`);
        });
        const len = rects[1].getTotalLength();
        rects[1].style.setProperty('--length', `${len}`);
      };
      size();
      if (reducedMotion()) {
        gsap.set(rects[1], { '--p': 1 });
        return;
      }
      const tl = gsap.timeline({ paused: true, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      tl.fromTo(rects[1], { '--p': 0 }, { '--p': 1, duration: 1, ease: 'power3.inOut' }, 0).fromTo(
        svg,
        { scale: 1.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
        0,
      );
    },
    { scope: root },
  );

  return (
    <span ref={root} className={s.tag} data-tone={tone}>
      <svg className={s.svg} aria-hidden>
        <rect x="0.5" y="0.5" />
        <rect x="0.5" y="0.5" />
      </svg>
      <span className={s.text}>{children}</span>
    </span>
  );
}
