'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { gsap, reducedMotion, ScrollTrigger } from './gsap';

/**
 * Lenis on GSAP's ticker, so smooth scrolling and every ScrollTrigger share one clock. Off for
 * anyone who has asked for less motion; touch scrolling stays native.
 */
const Ctx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(Ctx);

/** Scroll to an element or position, smoothly where that is welcome. */
export function scrollToTarget(lenis: Lenis | null, target: HTMLElement | number, duration = 1.2) {
  if (lenis) lenis.scrollTo(target, { duration, easing: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) });
  else if (typeof target === 'number') window.scrollTo(0, target);
  else target.scrollIntoView();
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const l = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    l.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
    };
  }, []);

  return <Ctx.Provider value={lenis}>{children}</Ctx.Provider>;
}
