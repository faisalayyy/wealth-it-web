import type { ReactNode } from 'react';
import { Tag } from './Tag';
import s from './MediumHero.module.css';

/**
 * The reference's MediumHero in its brand tone: a rounded lime card inset from the page's edges,
 * everything centred — a tag, a heading, a line or two, and a button.
 */
export function MediumHero({ tag, title, description, cta }: { tag: string; title: string; description: string; cta?: ReactNode }) {
  return (
    <section className={s.section} data-ground="light">
      <div className={`g-row-full ${s.card}`} data-ground="lime">
        <Tag tone="ink">{tag}</Tag>
        <h2 className="title-3 xs-title-4 -medium">{title}</h2>
        <p className={`subhead-2 -medium ${s.description}`}>{description}</p>
        {cta && <div className={s.ctas}>{cta}</div>}
      </div>
    </section>
  );
}
