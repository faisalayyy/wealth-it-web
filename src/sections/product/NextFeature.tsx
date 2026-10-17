import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Phone } from '@/components/Phone';
import { TapPhone } from '@/components/TapPhone';
import type { FeaturePage } from '@/lib/features';
import s from './NextFeature.module.css';

/** The way on: the next feature page, as one wide card. */
export function NextFeature({ feature }: { feature: FeaturePage }) {
  return (
    <section className={s.section} data-ground="light">
      <div className="wrap">
        <Link href={`/features/${feature.slug}/`} className={s.card} data-dark={feature.dark ? '' : undefined}>
          <span className={s.copy}>
            <span className={`cap ${s.cap}`}>Up next</span>
            <span className={`display-2 ${s.title}`}>{feature.label}</span>
            <span className={s.summary}>{feature.summary}</span>
            <span className={s.arrow} aria-hidden>
              <Icon name="arrow-right" size={20} />
            </span>
          </span>
          <span className={s.media} aria-hidden>
            {feature.hero.media && 'tap' in feature.hero.media ? (
              <TapPhone className={s.phone} sizes="240px" note={false} />
            ) : (
              <Phone screen={feature.thumb} variant="device" className={s.phone} sizes="240px" alt="" />
            )}
          </span>
        </Link>
      </div>
    </section>
  );
}
