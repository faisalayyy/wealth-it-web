import { stores } from '@/lib/site';
import s from './AppButtons.module.css';

/**
 * The store buttons. The app is in neither store yet — the iPhone app is in TestFlight and Android
 * is planned — so until `stores` has URLs they say so and are not links: no badge that implies a
 * listing, and nothing that goes nowhere.
 */
export function AppButtons({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const items = [
    { key: 'ios', store: 'App Store', href: stores.ios, soon: 'Coming soon to' },
    { key: 'android', store: 'Google Play', href: stores.android, soon: 'Later on' },
  ];
  return (
    <div className={`${s.row} ${className ?? ''}`} data-tone={tone}>
      {items.map(i =>
        i.href ? (
          <a key={i.key} className={s.btn} href={i.href} rel="noopener">
            <span className={s.small}>Get it on</span>
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
