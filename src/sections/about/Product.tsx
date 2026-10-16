'use client';

import type { ReactNode } from 'react';
import { FeatureStack, type Feature } from '@/components/FeatureStack';
import { Media, type MediaSpec } from '@/components/Media';
import { Tag } from '@/components/Tag';
import { col } from '@/lib/grid';
import s from './Product.module.css';

/**
 * The reference's JetonProduct, on the lime: a small picture, the product in a heading and a
 * paragraph, the store buttons, three figures in a row — true ones — and then the features,
 * one full screen each, stacked.
 */
export function Product({
  thumb,
  tag,
  title,
  description,
  cta,
  stats,
  features,
  id,
}: {
  thumb: MediaSpec;
  tag: string;
  title: string;
  description: string;
  cta?: ReactNode;
  stats?: { value: string; label: string }[];
  features: Feature[];
  id?: string;
}) {
  return (
    <section className={s.product} id={id} data-ground="lime">
      <div className={`g-row ${s.center} ${s.thumbRow}`}>
        <div className="gc" style={col({ xxl: 2, md: 3, sm: 4, xs: 6 })}>
          <div className={s.thumb}>
            <Media spec={thumb} />
          </div>
        </div>
      </div>
      <div className={`g-row ${s.center} ${s.titleRow}`}>
        <div className="gc" style={col({ xxl: 10, sm: 12, xs: 16 })}>
          <Tag tone="ink">{tag}</Tag>
          <h2 className={`title-3 xs-title-4 -medium ${s.title}`}>{title}</h2>
        </div>
      </div>
      <div className={`g-row ${s.center} ${s.descRow}`}>
        <div className="gc" style={col({ xxl: 8, md: 10, sm: 12, xs: 16 })}>
          <p className="subhead-2 -medium">{description}</p>
        </div>
      </div>
      {cta && (
        <div className={`g-row ${s.center} ${s.ctaRow}`}>
          <div className={s.ctas}>{cta}</div>
        </div>
      )}
      {stats && stats.length > 0 && (
        <div className={`g-row ${s.center} ${s.statsRow}`}>
          <ul className={`gc ${s.stats}`} style={col({ xxl: 14, sm: 16 })}>
            {stats.map(st => (
              <li key={st.label}>
                <div className="subhead-2 xs-title-5 -medium">{st.value}</div>
                <div className="body -book">{st.label}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!stats?.length && <div className={s.gap} />}
      <FeatureStack items={features} />
    </section>
  );
}
