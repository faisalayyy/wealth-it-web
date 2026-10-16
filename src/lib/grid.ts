import type { CSSProperties } from 'react';

/** Spans (or offsets) per breakpoint, in sixteenths: xxl above 1290, md to 1290, sm to 1023, xs to 743. */
type Sizes = { xxl?: number; md?: number; sm?: number; xs?: number };

/**
 * The style for a `.gc` column: `col({ xxl: 6, md: 7, sm: 10, xs: 16 }, { xxl: 3, md: 1, sm: 0 })`
 * is the reference's `xxl-6 md-7 sm-10 xs-16 xxl-offset-3 md-offset-1 sm-offset-0`.
 */
export function col(span: Sizes, offset: Sizes = {}): CSSProperties {
  const style: Record<string, number> = {};
  for (const [bp, v] of Object.entries(span)) if (v !== undefined) style[`--w-${bp}`] = v;
  for (const [bp, v] of Object.entries(offset)) if (v !== undefined) style[`--o-${bp}`] = v;
  return style as CSSProperties;
}
