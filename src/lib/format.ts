/** Tiny helpers the components share. Nothing here knows about money. */
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (v: number, lo: number, hi: number) => (hi === lo ? 0 : (v - lo) / (hi - lo));
/** Smooth, frame-rate independent approach — the right way to chase a target every frame. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
