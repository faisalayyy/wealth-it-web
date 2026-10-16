'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (process.env.NODE_ENV !== 'production') Object.assign(window, { gsap, ScrollTrigger });
}

/** Viewport helpers, in the reference's terms: vh(10) is ten per cent of the viewport height. */
export const vw = (n: number) => (n / 100) * window.innerWidth;
export const vh = (n: number) => (n / 100) * window.innerHeight;

/** Breakpoints, as measured: xs ≤743, sm ≤1023, md ≤1290. */
export const BP = { xs: 743, sm: 1023, md: 1290 } as const;

/** True on touch-first devices, where scroll-scrubbed effects are skipped (as the reference does). */
export const isTouch = () => typeof window !== 'undefined' && 'ontouchstart' in window;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
