/**
 * One mapping, used by both sides.
 *
 * The shader places a transaction at `(aT + 0.5) * width * 0.94` from the centre. The axis, the
 * scrub rule and the readout in the DOM have to land on exactly the same pixel or the
 * illusion — that the HTML and the canvas are one object — comes apart immediately. So the
 * constant lives here and neither side is allowed its own copy.
 */
import { SPAN } from '@/lib/ledger';
import { clamp } from '@/lib/format';

const SPREAD = 0.94;

/** −1 … 0 (a year ago … today) → 0 … 1 across the viewport. */
export const normToFrac = (aT: number) => (1 - SPREAD) / 2 + (aT + 1) * SPREAD;
export const fracToNorm = (frac: number) => clamp((frac - (1 - SPREAD) / 2) / SPREAD - 1, -1, 0);

/** …and the same thing again in days, which is what the ledger speaks. */
export const dayToFrac = (t: number) => normToFrac(t / -SPAN.past);
export const fracToDay = (frac: number) => Math.round(fracToNorm(frac) * -SPAN.past);
