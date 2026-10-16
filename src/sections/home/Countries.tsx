import { asset } from '@/lib/site';
import s from './Countries.module.css';

/**
 * Where the reference shows its clients' logos drifting past, Wealthit shows the places it is made
 * for: the 26 countries whose money a wallet can be kept in (App/src/data/constants.ts — one
 * currency each; the euro is every Eurozone country). Two rows drift opposite ways and stop under
 * the pointer; with reduced motion they sit still, wrapped. Flags: flag-icons (MIT), served here.
 */
const ROWS: { cc: string; name: string }[][] = [
  [
    { cc: 'ae', name: 'United Arab Emirates' },
    { cc: 'sa', name: 'Saudi Arabia' },
    { cc: 'qa', name: 'Qatar' },
    { cc: 'kw', name: 'Kuwait' },
    { cc: 'om', name: 'Oman' },
    { cc: 'bh', name: 'Bahrain' },
    { cc: 'jo', name: 'Jordan' },
    { cc: 'eg', name: 'Egypt' },
    { cc: 'in', name: 'India' },
    { cc: 'pk', name: 'Pakistan' },
    { cc: 'bd', name: 'Bangladesh' },
    { cc: 'np', name: 'Nepal' },
    { cc: 'lk', name: 'Sri Lanka' },
  ],
  [
    { cc: 'ph', name: 'Philippines' },
    { cc: 'my', name: 'Malaysia' },
    { cc: 'sg', name: 'Singapore' },
    { cc: 'cn', name: 'China' },
    { cc: 'jp', name: 'Japan' },
    { cc: 'tr', name: 'Türkiye' },
    { cc: 'za', name: 'South Africa' },
    { cc: 'gb', name: 'United Kingdom' },
    { cc: 'eu', name: 'Eurozone' },
    { cc: 'ch', name: 'Switzerland' },
    { cc: 'us', name: 'United States' },
    { cc: 'ca', name: 'Canada' },
    { cc: 'au', name: 'Australia' },
  ],
];

function Pill({ cc, name }: { cc: string; name: string }) {
  return (
    <li className={s.pill}>
      <img src={asset(`/flags/${cc}.svg`)} alt="" width={28} height={28} loading="lazy" decoding="async" className={s.flag} />
      <span>{name}</span>
    </li>
  );
}

export function Countries() {
  const all = ROWS.flat();
  return (
    <section className={s.section} aria-labelledby="countries-title" data-ground="light">
      <div className={`wrap ${s.head}`}>
        <p className="cap">Made for money that crosses borders</p>
        <h2 id="countries-title" className={s.title}>
          Salary in Dubai, savings back home, a card in dollars — keep each account in its own country’s money, and see them added up.
        </h2>
      </div>
      <p className="sr-only">Wealthit keeps wallets in the money of {all.length} places: {all.map(c => c.name).join(', ')}.</p>
      <div className={s.rows} aria-hidden>
        {ROWS.map((row, i) => (
          <div key={i} className={s.track} data-dir={i % 2 ? 'right' : 'left'}>
            <ul className={s.row}>
              {row.map(c => (
                <Pill key={c.cc} {...c} />
              ))}
            </ul>
            <ul className={s.row}>
              {row.map(c => (
                <Pill key={c.cc} {...c} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
