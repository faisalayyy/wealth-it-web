import s from './CurrencyTicker.module.css';

/**
 * Where the reference shows its clients' logos drifting past, Wealthit has no clients to show, so
 * it shows what is true instead: the 26 currencies a wallet can be kept in (App/src/data/
 * constants.ts), drifting past. The dirham uses its own sign, drawn as the app draws it.
 */
const CURRENCIES = [
  { code: 'AED', sym: 'dirham' },
  { code: 'USD', sym: '$' },
  { code: 'EUR', sym: '€' },
  { code: 'GBP', sym: '£' },
  { code: 'SAR', sym: 'SR' },
  { code: 'INR', sym: '₹' },
  { code: 'PKR', sym: 'Rs' },
  { code: 'PHP', sym: '₱' },
  { code: 'EGP', sym: 'E£' },
  { code: 'BDT', sym: '৳' },
  { code: 'NPR', sym: 'रू' },
  { code: 'LKR', sym: 'Rs' },
  { code: 'KWD', sym: 'KD' },
  { code: 'QAR', sym: 'QR' },
  { code: 'OMR', sym: 'RO' },
  { code: 'BHD', sym: 'BD' },
  { code: 'JOD', sym: 'JD' },
  { code: 'CAD', sym: 'C$' },
  { code: 'AUD', sym: 'A$' },
  { code: 'SGD', sym: 'S$' },
  { code: 'MYR', sym: 'RM' },
  { code: 'CHF', sym: 'Fr' },
  { code: 'JPY', sym: '¥' },
  { code: 'CNY', sym: '元' },
  { code: 'TRY', sym: '₺' },
  { code: 'ZAR', sym: 'R' },
];

function Item({ c }: { c: (typeof CURRENCIES)[number] }) {
  return (
    <li className={s.item}>
      <span className={s.sym} aria-hidden>
        {c.sym === 'dirham' ? (
          <svg viewBox="0 0 17 24" className={s.dirham}>
            <path d="M7 2.5v19M7 2.5h5a9.5 9.5 0 0 1 0 19H7M1.5 9.5h14M1.5 14.5h14" />
          </svg>
        ) : (
          c.sym
        )}
      </span>
      <span className={s.code}>{c.code}</span>
    </li>
  );
}

export function CurrencyTicker() {
  return (
    <section className={s.ticker} aria-labelledby="ticker-title">
      <p id="ticker-title" className="cap">
        26 currencies, added up together
      </p>
      <div className={s.track}>
        <ul className={s.row} aria-label={`The currencies Wealthit keeps: ${CURRENCIES.map(c => c.code).join(', ')}`}>
          {CURRENCIES.map(c => (
            <Item key={c.code} c={c} />
          ))}
        </ul>
        <ul className={s.row} aria-hidden>
          {CURRENCIES.map(c => (
            <Item key={c.code} c={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}
