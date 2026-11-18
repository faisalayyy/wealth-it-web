import { useId } from 'react';
import { BRAND_MARK, MARK_VIEWBOX } from '@/lib/brand';

/* The gold stops of the app's PlusMark (A637): the first blade lighter, the other two deeper. */
const FIRST = ['#FFF1C7', '#F0CE7A', '#C99A3E', '#F6DB93'];
const REST = ['#EAD9A8', '#CDAA5E', '#9E7633', '#D9BB76'];

/**
 * Wealthit+'s gold mark (the app's `PlusMark`, A637): the brand's three blades, each a gold gradient
 * across its own box. Only for Wealthit+; everywhere else the mark is the lime one (Logo.tsx).
 */
export function PlusMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        {BRAND_MARK.paths.map((_, i) => (
          <linearGradient key={i} id={`${id}g${i}`} x1="0" y1="0" x2="1" y2="1">
            {(i === 0 ? FIRST : REST).map((c, k) => (
              <stop key={k} offset={k / 3} stopColor={c} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {[1, 2, 0].map(i => (
        <path key={i} d={BRAND_MARK.paths[i]} fill={`url(#${id}g${i})`} />
      ))}
    </svg>
  );
}
