import Link from 'next/link';
import { Button } from '@/components/Button';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Phone } from '@/components/Phone';
import { featurePages } from '@/lib/features';
import s from './FeatureCards.module.css';

/**
 * Everything at a glance (the reference's feature cards): a card per feature page, each with its
 * real screen rising out of a panel, its name and one line. The whole card is the link.
 */
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
          {featurePages.map(f => (
            <li key={f.slug}>
              <Link href={`/features/${f.slug}/`} className={s.card}>
                <div className={s.media} data-tone={f.dark ? 'dark' : 'light'}>
                  <Phone screen={f.thumb} variant="device" className={s.phone} sizes="(max-width: 743px) 50vw, 260px" alt="" />
                </div>
                <div className={s.meta}>
                  <h3 className={s.title}>{f.label}</h3>
                  <p className={s.summary}>{f.summary}</p>
                </div>
                <span className={s.arrow} aria-hidden>
                  <Icon name="arrow-up-right" size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
