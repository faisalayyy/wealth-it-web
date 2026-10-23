import { BRAND_MARK, MARK_VIEWBOX } from '@/lib/brand';
import s from './Logo.module.css';

const INK = { auto: 'var(--logo-ink)', light: 'var(--night)', dark: 'var(--blade-white)' } as const;

/**
 * The mark (App/src/ui/brandMark.ts, A418, A422): three blades, each a step higher, the first upright
 * and lime on every ground; the other two Night on light grounds and Blade White on dark. `mono`
 * draws it in one colour. `auto` follows the site's theme. In a square box it sits centred, whole.
 */
export function Mark({ className, tone = 'auto', mono }: { className?: string; tone?: 'auto' | 'light' | 'dark'; mono?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden>
      {BRAND_MARK.paths.map((d, i) => (
        <path key={d} d={d} fill={mono ?? (i === 0 ? 'var(--lime)' : INK[tone])} />
      ))}
    </svg>
  );
}

/**
 * The horizontal logo (App/brand/README.md): the mark stands on the baseline, 1.1 capitals tall, a
 * blade's width before the name; "Wealth" and "it" in two colours so it is never read as
 * "Wealth-hit" (A386): "Wealth" as the two blades, "it" the lime on every ground (A423). `auto`
 * follows the site's theme.
 */
export function Logo({ tone = 'auto', className }: { tone?: 'auto' | 'light' | 'dark'; className?: string }) {
  return (
    <span className={`${s.logo} ${className ?? ''}`} data-tone={tone}>
      <Mark className={s.mark} tone={tone} />
      <span className={s.name}>
        Wealth<span className={s.it}>it</span>
      </span>
    </span>
  );
}
