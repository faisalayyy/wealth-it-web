import Link from 'next/link';
import { Button } from '@/components/Button';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Phone } from '@/components/Phone';
import { TapPhone } from '@/components/TapPhone';
import { featurePages } from '@/lib/features';
import s from './FeatureCards.module.css';

/**
 * Everything at a glance (the reference's feature cards): a card per feature page, each with its
 * real screen rising out of a panel, its name and one line, and the arrow inside the picture. The
 * whole card is the link. Tap to Record leads, across the full width.
 */
// Tap to Record first: it is the one that needs no typing at all
const CARDS = [...featurePages].sort((a, b) => Number(b.slug === 'tap-to-record') - Number(a.slug === 'tap-to-record'));

export function FeatureCards() {
  return (
    <section className={s.section} aria-labelledby="features-title">
      <div className="wrap">
        <div className={s.head}>
          <div>
            <p className="cap">Features</p>
            <h2 id="features-title" className="display-2">
              {coined('Everything your money needs, on one phone.')}
            </h2>
          </div>
          <Button label="All features" href="/features/" tone="ink" variant="secondary" />
        </div>
        <ul className={s.cards}>
          {CARDS.map(f => (
            <li key={f.slug} className={f.slug === 'tap-to-record' ? s.wide : undefined}>
              <Link href={`/features/${f.slug}/`} className={s.card} data-wide={f.slug === 'tap-to-record' ? '' : undefined}>
                <div className={s.media} data-tone={f.slug === 'tap-to-record' ? 'tap' : f.dark ? 'dark' : 'light'}>
                  {f.slug === 'tap-to-record' ? (
                    <TapPhone className={s.phone} sizes="(max-width: 743px) 50vw, 260px" note={false} />
                  ) : (
                    <Phone screen={f.thumb} variant="device" className={s.phone} sizes="(max-width: 743px) 50vw, 260px" alt="" />
                  )}
                  <span className={s.arrow} aria-hidden>
                    <Icon name="arrow-up-right" size={18} />
                  </span>
                </div>
                <div className={s.meta}>
                  <h3 className={s.title}>{f.label}</h3>
                  <p className={s.summary}>{f.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
