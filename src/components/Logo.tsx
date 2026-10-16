import { BRAND_MARK } from '@/lib/brand';
import s from './Logo.module.css';

/**
 * The mark (App/src/ui/brandMark.ts, A365): two matching leaves opening from one point and a gold
 * coin rising between them. Leaves are Emerald on light grounds and Mint on dark; the coin is
 * always Gold. `mono` draws it in one colour.
 */
export function Mark({ className, tone = 'light', mono }: { className?: string; tone?: 'light' | 'dark'; mono?: string }) {
  const leaf = mono ?? (tone === 'dark' ? 'var(--mint)' : 'var(--emerald)');
  return (
    <svg viewBox={BRAND_MARK.viewBox} className={className} aria-hidden>
      {BRAND_MARK.paths.map(d => (
        <path key={d} d={d} fill={leaf} />
      ))}
      <circle {...BRAND_MARK.coin} fill={mono ?? 'var(--gold)'} />
    </svg>
  );
}

/**
 * The logo: the mark and the name, "Wealth" and "it" in two colours so it is never read as
 * "Wealth-hit" (A386) — Night and Emerald on light grounds, Ivory and Mint on dark.
 */
export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span className={`${s.logo} ${className ?? ''}`} data-tone={tone}>
      <Mark className={s.mark} tone={tone} />
      <span className={s.name}>
        Wealth<span className={s.it}>it</span>
      </span>
    </span>
  );
}
