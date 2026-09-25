'use client';

/**
 * The single scrolling layer.
 *
 * Lenis does not replace the scrollbar with a fake one — it eases the real scroll position, so
 * keyboard navigation, anchor links, find-in-page and the browser's own scroll restoration all
 * keep working. Three things have to be true for it to cooperate with GSAP, and all three are
 * here rather than scattered across the components that depend on them:
 *
 *   1. ScrollTrigger updates on Lenis's scroll event, not on the native one.
 *   2. Lenis is driven by GSAP's ticker, so there is one requestAnimationFrame loop on the
 *      page instead of two fighting for the same frame.
 *   3. lagSmoothing is off, because GSAP's frame-skip correction and a scrubbed timeline
 *      disagree about what a dropped frame means.
 *
 * It also exposes the instance, so the menu can lock the page without anybody reaching for
 * `overflow: hidden` and losing the scroll position.
 */

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollApi {
  lenis: Lenis | null;
  lock: () => void;
  unlock: () => void;
  scrollTo: (target: string | number, opts?: { offset?: number; immediate?: boolean }) => void;
}

const Ctx = createContext<ScrollApi>({ lenis: null, lock: () => {}, unlock: () => {}, scrollTo: () => {} });
export const useSmoothScroll = () => useContext(Ctx);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);
  const [, force] = useState(0);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    /* Someone who has asked for less movement gets the browser's own scroll, untouched. */
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      /* A long, flat tail: the page keeps a little weight after the wheel stops, which is what
         makes scroll-linked scenes feel attached to the hand rather than to the event. */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      /* Touch devices have their own excellent inertia. Borrowing it beats simulating it. */
      syncTouch: false,
    });
    ref.current = lenis;
    force(n => n + 1);

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      ref.current = null;
    };
  }, [reduced]);

  /* A new route is a new document height. Start at the top, then let every trigger re-measure
     once the browser has actually laid the page out. */
  useEffect(() => {
    ref.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const api: ScrollApi = {
    lenis: ref.current,
    lock: () => ref.current?.stop(),
    unlock: () => ref.current?.start(),
    scrollTo: (target, opts) =>
      ref.current
        ? ref.current.scrollTo(target, { offset: opts?.offset ?? 0, immediate: opts?.immediate })
        : typeof target === 'number'
          ? window.scrollTo({ top: target, behavior: opts?.immediate ? 'auto' : 'smooth' })
          : document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
