import Link from 'next/link';
import { Button } from './Button';
import { Logo } from './Logo';
import s from './Navbar.module.css';

/**
 * The top bar: the wordmark, and two actions. It sits over the first screen and scrolls away with
 * it — the floating menu at the bottom does the navigating from then on. The site itself has
 * nothing to log into — accounts live in the app — so the actions are the privacy page and the way to get the app.
 */
export function Navbar({ tone = 'brand' }: { tone?: 'brand' | 'white' }) {
  return (
    <nav className={s.navbar} aria-label="Top">
      <div className={`g-row-full ${s.row}`}>
        <Link href="/" className={s.home} aria-label="Wealth-it, home">
          <Logo tone="ink" />
        </Link>
        <div className={s.ctas}>
          <Button label="Privacy" href="/privacy/" tone={tone === 'brand' ? 'neutral' : 'brand'} variant="secondary" />
          <Button label="Get Wealth-it" href="/#get" tone={tone === 'brand' ? 'neutral' : 'brand'} variant="primary" className={s.last} />
        </div>
      </div>
    </nav>
  );
}
