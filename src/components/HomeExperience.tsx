'use client';

/**
 * The home experience, assembled — and the one place that decides how scroll drives the field.
 *
 * The director is here rather than inside each chapter on purpose. The field is a single
 * object that persists across six sections; if every section reached in and set its own
 * uniforms, the handover between any two of them would be a negotiation between two components
 * that have never met. One timeline, declared once, in the order the reader meets it.
 */

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Stage } from '@/webgl/Stage';
import { useFieldState } from '@/webgl/state';
import { Hero } from './chapters/Hero';
import { Flow } from './chapters/Flow';
import { Pattern } from './chapters/Pattern';
import { Projection } from './chapters/Projection';
import { Product } from './chapters/Product';
import { Converge } from './chapters/Converge';
import { Intro } from './chrome/Intro';

function Director() {
  const field = useFieldState();
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const s = field.current;

    const ctx = gsap.context(() => {
      /* 02 → 03. The fold: time is thrown away, day-of-month is kept, and a year of movement
         lands on one month. Scrubbed, so the reader can take it apart again by scrolling back. */
      ScrollTrigger.create({
        trigger: '#pattern',
        start: 'top 80%',
        end: 'center center',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: self => { s.phase = 1 + self.progress; },
      });

      /* The field has said everything it can say. It leaves before the chart arrives rather
         than competing with it for the same screen. */
      ScrollTrigger.create({
        trigger: '#next',
        start: 'top 90%',
        end: 'top 30%',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => { s.fade = 1 - self.progress; },
        /* And again on refresh. The pinned chapter below adds a spacer to the document; a
           trigger that measured the page before that spacer existed believes it is already
           finished, and the field disappears before the reader has seen it once. */
        onRefresh: self => { s.fade = 1 - self.progress; },
      });

      /* Velocity reaches the shader through the same variable the CSS uses, so the page and
         the canvas are never disagreeing about how fast the hand is moving. */
      const tick = () => {
        s.velocity = Number(document.documentElement.style.getPropertyValue('--vel') || 0);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    });

    return () => ctx.revert();
  }, [field, reduced]);

  return null;
}

export function HomeExperience() {
  const root = useRef<HTMLDivElement>(null);

  /* A new page height after images, fonts and pins have settled. Without this, a trigger set
     up before layout finished measures the wrong document. */
  useIsomorphicLayoutEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 240);
    return () => clearTimeout(id);
  }, []);

  return (
    <div ref={root}>
      <Intro />
      <Stage>
        <Director />
        <Hero />
        <Flow />
        <Pattern />
        <Projection />
        <Product />
        <Converge />
      </Stage>
    </div>
  );
}
