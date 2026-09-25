'use client';

/**
 * Magnetism, on a handful of elements and no more.
 *
 * The effect is worth having exactly because it is rare: if every button leans toward the
 * cursor, none of them mean anything by it. The pull is capped well below the element's own
 * radius so the pointer never loses the thing it is aiming at, and it is gated on a fine
 * pointer — a finger cannot hover, and a phone should not pay for the listener.
 */
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { MQ } from '@/lib/motion';

export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 1.6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(MQ.fine).matches) return;
    if (window.matchMedia(MQ.reduced).matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'expo.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo.out' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(r.width, r.height) * radius;
      const dist = Math.hypot(dx, dy);
      if (dist > reach) { xTo(0); yTo(0); return; }
      /* Falls off toward the edge of reach, so the pull arrives rather than switching on. */
      const falloff = 1 - dist / reach;
      xTo(dx * strength * falloff);
      yTo(dy * strength * falloff);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius]);

  return ref;
}
