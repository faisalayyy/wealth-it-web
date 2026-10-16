import type { CSSProperties } from 'react';
import s from './FlutedGlass.module.css';

/**
 * The About page's ground, in place of the reference's video of the same thing: five tall panels
 * of fluted glass across the width, light drifting slowly up and down through each at its own
 * pace. Drawn in CSS — no video to load and nothing that runs when it cannot be seen.
 */
const PANELS = [
  { w: 25, d: 0 },
  { w: 17.5, d: -3.1 },
  { w: 18.25, d: -5.4 },
  { w: 17.5, d: -1.7 },
  { w: 21.75, d: -6.8 },
];

export function FlutedGlass({ className }: { className?: string }) {
  return (
    <div className={`${s.glass} ${className ?? ''}`} aria-hidden>
      {PANELS.map((p, i) => (
        <span key={i} className={s.panel} style={{ '--w': `${p.w}%`, '--d': `${p.d}s` } as CSSProperties} />
      ))}
    </div>
  );
}
