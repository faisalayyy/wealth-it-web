import { gsap, isTouch, reducedMotion, vh } from './gsap';

/**
 * The reference's `v-parallax`: an element drifts from `v` to `−v` screen-heights as its parent
 * crosses the screen, scrubbed, inside a parent that clips it. Negative values move against the
 * scroll. Off on touch screens and with reduced motion. Call inside `useGSAP` so it is cleaned up.
 */
export function parallax(el: HTMLElement | null | undefined, v: number) {
  if (!el || isTouch() || reducedMotion()) return;
  gsap.fromTo(
    el,
    { y: () => vh(v * 100) },
    {
      y: () => vh(-v * 100),
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: () => `top+=${vh(v * 100)} bottom`,
        end: () => `bottom+=${vh(-v * 100)} top`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}
