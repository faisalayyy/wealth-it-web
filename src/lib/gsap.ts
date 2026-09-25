'use client';

/**
 * One place where GSAP is configured, and the only place plugins are registered.
 *
 * Registering in a component means registering again on every mount, and a second
 * `ScrollTrigger` registration is the classic source of triggers that refuse to die. This
 * module is imported for its side effect and is idempotent.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';

let registered = false;
if (typeof window !== 'undefined' && !registered) {
  registered = true;
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 0.72 });
  /* Sub-pixel transforms on text are the difference between crisp and smeared. */
  gsap.config({ autoSleep: 60, force3D: true });
}

export { gsap, ScrollTrigger, Flip, SplitText };
