'use client';

/**
 * The one entrance animation on the site.
 *
 * Every block of copy arrives the same way — masked, from below, once — because a page where
 * each section has invented its own entrance reads as a showreel rather than as a document.
 * Lines are split only when the browser can do it without shifting layout, and under reduced
 * motion the whole thing is a no-op: the text is simply there.
 */

import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { STAGGER } from '@/lib/motion';

export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  lines = false,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Split into lines and stagger them. For display type only — never for body copy. */
  lines?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      if (lines) {
        const split = new SplitText(el, { type: 'lines', linesClass: 'reveal-line' });
        /* Each line gets a clipping parent, so the type rises out of an edge rather than
           fading in place. The wrappers are removed with the split on cleanup. */
        split.lines.forEach(line => {
          const wrap = document.createElement('span');
          wrap.style.display = 'block';
          wrap.style.overflow = 'hidden';
          line.parentNode?.insertBefore(wrap, line);
          wrap.appendChild(line);
        });
        gsap.set(split.lines, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => gsap.to(split.lines, {
            yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: STAGGER.normal, delay,
          }),
        });
        return () => split.revert();
      }

      gsap.set(el, { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay }),
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, lines, delay]);

  return createElement(Tag, { ref, className }, children);
}
