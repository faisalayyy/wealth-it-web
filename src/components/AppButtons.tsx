import { stores } from '@/lib/site';
import s from './AppButtons.module.css';

/**
 * The store buttons, links to the App Store and Google Play listings in `stores`. One without a URL
 * says "Coming soon" and is not a link: nothing that goes nowhere.
 */
export function AppButtons({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const items = [
    { key: 'ios', store: 'App Store', href: stores.ios, get: 'Download on the', soon: 'Coming soon to' },
    { key: 'android', store: 'Google Play', href: stores.android, get: 'Get it on', soon: 'Coming soon to' },
  ];
  return (
    <div className={`${s.row} ${className ?? ''}`} data-tone={tone}>
      {items.map(i =>
        i.href ? (
          <a key={i.key} className={s.btn} href={i.href} rel="noopener">
            <span className={s.small}>{i.get}</span>
            <span className={s.big}>{i.store}</span>
          </a>
        ) : (
          <span key={i.key} className={s.btn} data-soon aria-label={`${i.store}: ${i.soon.toLowerCase()}`}>
            <span className={s.small}>{i.soon}</span>
            <span className={s.big}>{i.store}</span>
          </span>
        ),
      )}
    </div>
  );
}
