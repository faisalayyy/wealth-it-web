'use client';

/**
 * Scroll velocity, as a CSS variable rather than as React state.
 *
 * Velocity changes every frame; putting it through `setState` would re-render the entire page
 * sixty times a second to move a few pixels. It is written to `--vel` on <html> instead, where
 * any component can pick it up in a transform, and it decays to zero the moment scrolling
 * stops — the effect has to disappear when the hand does, or it reads as a rendering bug.
 */
import { useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import { clamp } from '@/lib/format';

export function useScrollVelocity(enabled = true) {
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    let raw = 0;
    let smooth = 0;

    const onLenis = ({ velocity }: { velocity: number }) => { raw = velocity; };
    lenis?.on('scroll', onLenis);

    /* Without Lenis (reduced motion, or before it mounts) fall back to the native delta. */
    let lastY = window.scrollY;
    const onNative = () => { raw = window.scrollY - lastY; lastY = window.scrollY; };
    if (!lenis) window.addEventListener('scroll', onNative, { passive: true });

    const tick = () => {
      smooth += (raw - smooth) * 0.12;
      raw *= 0.86;
      const v = clamp(smooth / 42, -1, 1);
      root.style.setProperty('--vel', v.toFixed(4));
      root.style.setProperty('--vel-abs', Math.abs(v).toFixed(4));
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.off('scroll', onLenis);
      window.removeEventListener('scroll', onNative);
      root.style.setProperty('--vel', '0');
      root.style.setProperty('--vel-abs', '0');
    };
  }, [lenis, enabled]);
}
