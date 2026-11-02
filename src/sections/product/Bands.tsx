'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { fullStop } from '@/components/Stop';
import { Icon } from '@/components/Icon';
import { Shot } from '@/components/Shot';
import type { FeaturePage } from '@/lib/features';
import s from './Bands.module.css';

/** The Features page's body: each feature as a band — its line, what it does, and the app. */
export function Bands({ features }: { features: FeaturePage[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => reveal(root.current), { scope: root });
  return (
    <div ref={root} className={s.bands}>
      {features.map((f, i) => (
        <section key={f.slug} id={f.slug} className={`wrap ${s.band}`} data-flip={i % 2 ? '' : undefined} data-ground="light" aria-labelledby={`${f.slug}-title`}>
          <div className={s.copy} data-reveal>
            <p className="cap">{f.label}</p>
            <h2 id={`${f.slug}-title`} className={`display-2 ${s.title}`}>
              {fullStop(f.hero.title)}
            </h2>
            <p className={`lead ${s.text}`}>{f.hero.lead}</p>
            <Link href={`/features/${f.slug}/`} className={s.more}>
              More about {f.label.toLowerCase()}
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
          <Link href={`/features/${f.slug}/`} className={s.panel} data-dark={f.dark ? '' : undefined} data-reveal="scale" tabIndex={-1} aria-hidden>
            <Shot media={f.hero.media ?? { screens: f.hero.screens }} />
          </Link>
        </section>
      ))}
    </div>
  );
}
