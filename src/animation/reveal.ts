import { gsap, reducedMotion, ScrollTrigger } from './gsap';
import { introLate } from './intro';

/**
 * The entrance every block on the site shares: anything marked `data-reveal` inside `root` rises a
 * little and fades in as it comes up the screen, in order, once. `data-reveal="scale"` grows from
 * 96% instead, for panels. Call inside `useGSAP` so it is cleaned up; reduced motion shows all.
 */
export function reveal(root: HTMLElement | null) {
  if (!root || reducedMotion()) return;
  // what is already on screen when the scripts arrive late stays as it is
  const late = introLate();
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(i => !late || i.getBoundingClientRect().top > innerHeight);
  if (!items.length) return;
  gsap.set(items, { opacity: 0, y: 28 });
  gsap.set(items.filter(i => i.dataset.reveal === 'scale'), { y: 40, scale: 0.96 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: batch =>
      gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
}
