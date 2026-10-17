'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { Button } from '@/components/Button';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Crop, Cut } from '@/components/Screen';
import { featurePages } from '@/lib/features';
import type { CropName } from '@/lib/screens';
import { asset } from '@/lib/site';
import s from './FeatureCards.module.css';

/**
 * Everything at a glance, as a quiet bento (chosen by the owner from four takes, 17 October 2026):
 * two large tiles with the app (Recording, and Tap to Record: the piece of the app peeks in from the
 * lower edge and rises when pointed at), and five small ones with the feature's name, one line and
 * its 3D piece from the hero keyring. The whole tile is the link; the arrow sits inside it.
 */
type Media = { crop: CropName } | { tap: true };
const TILES: Record<string, { title: string; media?: Media; art?: string }> = {
  recording: { title: 'Write it down in seconds.', media: { crop: 'record-sentence' } },
  'tap-to-record': { title: 'Pay with Apple Pay, then tap Add.', media: { tap: true } },
  accounts: { title: 'Every currency in one total.', art: 'account' },
  budgets: { title: 'Know before you overspend.', art: 'budget' },
  goals: { title: 'Watch your savings grow.', art: 'goal' },
  bills: { title: 'Bills that remember themselves.', art: 'bill' },
  home: { title: 'Your money at a glance.', art: 'mark' },
};
const ITEMS = featurePages.filter(f => TILES[f.slug]).map(f => ({ ...f, ...TILES[f.slug] }));
type Item = (typeof ITEMS)[number];

function Tile({ f }: { f: Item }) {
  return (
    <Link href={`/features/${f.slug}/`} className={s.tile} data-tap={f.media && 'tap' in f.media ? '' : undefined}>
      {f.art && (
        <picture className={s.art} aria-hidden>
          <source type="image/avif" srcSet={asset(`/art/${f.art}.avif`)} />
          <img src={asset(`/art/${f.art}.webp`)} alt="" loading="lazy" decoding="async" />
        </picture>
      )}
      <span className={s.text}>
        <span className={s.cap}>{f.label}</span>
        <span className={s.title}>{f.title}</span>
      </span>
      {f.media && (
        <span className={s.media} aria-hidden>
          {'tap' in f.media ? (
            <Cut name="tap-card" className={s.piece} sizes="(max-width: 743px) 80vw, 460px" alt="" />
          ) : (
            <Crop name={f.media.crop} className={s.piece} />
          )}
        </span>
      )}
      <span className={s.arrow} aria-hidden>
        <Icon name="arrow-up-right" size={16} />
      </span>
    </Link>
  );
}

export function FeatureCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(root.current!.querySelectorAll('[data-tile]'), {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current!.querySelector('[data-grid]'), start: 'top 85%' },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} aria-labelledby="features-title">
      <div className="wrap">
        <div className={s.head}>
          <div>
            <p className="cap">Features</p>
            <h2 id="features-title" className="display-2">
              {coined('Everything your money needs, minus the spreadsheet energy.')}
            </h2>
          </div>
          <Button label="All features" href="/features/" tone="ink" variant="secondary" />
        </div>
        <div className={s.bento} data-grid>
          <ul className={s.big}>
            {ITEMS.filter(f => f.media).map(f => (
              <li key={f.slug} data-tile>
                <Tile f={f} />
              </li>
            ))}
          </ul>
          <ul className={s.small}>
            {ITEMS.filter(f => !f.media).map(f => (
              <li key={f.slug} data-tile>
                <Tile f={f} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
