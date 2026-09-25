/**
 * The motion system, in one file, so that a component cannot quietly invent a fifth duration.
 *
 * The durations are grouped by what the movement *means*, not by how long it happens to feel.
 * An answer to a tap and a change of world are different categories of event and should never
 * share a number.
 */

export const DUR = {
  /** It heard you. Hover, press, cursor state. */
  tap: 0.14,
  /** A control changed. Toggle, reveal, label swap. */
  ui: 0.32,
  /** Something moved through space. Panel, scene element, shared layout. */
  spatial: 0.72,
  /** The world changed. Page transition, chapter hand-off, the opening. */
  cinema: 1.4,
} as const;

/** Four curves. `linear` is not laziness — a scrubbed timeline must not be eased twice. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  spring: 'back.out(1.4)',
  linear: 'none',
} as const;

/** Stagger steps. Anything slower reads as a queue rather than a group. */
export const STAGGER = { tight: 0.018, normal: 0.045, loose: 0.09 } as const;

/** Breakpoints, matching the CSS, for `gsap.matchMedia`. */
export const MQ = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  /** Pointer that can hover — the gate for cursor work and magnetism, not screen width. */
  fine: '(hover: hover) and (pointer: fine)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;
