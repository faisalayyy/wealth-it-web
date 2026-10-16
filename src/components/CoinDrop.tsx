import s from './CoinDrop.module.css';

/** The scroll hint's little icon: coins dropping one after another, in a loop. */
export function CoinDrop({ tone = 'ink' }: { tone?: 'ink' | 'brand' }) {
  return (
    <span className={s.coin} data-tone={tone} aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} style={{ animationDelay: `${(i + 1) / 3}s` }} />
      ))}
    </span>
  );
}
