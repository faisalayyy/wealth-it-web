'use client';

import { useEffect, useState } from 'react';
import { BP } from '@/animation/gsap';
import { Icon } from './Icon';
import { Media, type MediaSpec } from './Media';
import { ScrollStack } from './ScrollStack';
import s from './FeatureStack.module.css';

/**
 * The reference's product features, in its ScrollStack: one full-screen card per feature, laid out
 * on the sixteen-column table in one of its three ways —
 *   text           title, a paragraph, a large picture to the right, a small one and a line below;
 *   text-inverted  the same with the paragraph and the picture on the right (a text card that
 *                  follows another text card turns this way, as on the reference);
 *   list           title, paragraph, a picture on the left and a numbered list on the right —
 *                  an accordion on a phone.
 */
export type Feature = {
  name: string;
  title: string;
  description: string;
  text?: string;
  list?: { title: string; text: string }[];
  images: MediaSpec[];
};

function layouts(items: Feature[]) {
  let last: string | null = null;
  return items.map(it => {
    let l = it.list ? 'list' : 'text';
    if (last === 'text' && l === 'text') l = 'text-inverted';
    last = l;
    return l;
  });
}

function List({ items }: { items: NonNullable<Feature['list']> }) {
  const [phone, setPhone] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    const mq = matchMedia(`(max-width: ${BP.xs}px)`);
    const set = () => setPhone(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return (
    <ul className={s.list}>
      {items.map((it, i) => {
        const expanded = !phone || open === i;
        return (
          <li key={it.title}>
            <button type="button" className={s.header} disabled={!phone} aria-expanded={expanded} onClick={() => setOpen(open === i ? null : i)}>
              <span className={`${s.index} body -book`}>{String(i + 1).padStart(2, '0')}.</span>
              <h4 className="subhead-2 xs-body -book">{it.title}</h4>
              <Icon name="plus" size={20} className={s.plus} />
            </button>
            <p className="body -book" hidden={!expanded}>
              {it.text}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export function FeatureStack({ items }: { items: Feature[] }) {
  const kinds = layouts(items);
  return (
    <ScrollStack
      views={items.map((it, i) => ({
        name: it.name,
        content: (
          <article className={`g-table ${s.article}`} data-layout={kinds[i]}>
            <div className={s.title}>
              <h3 className="title-4 -medium">{it.title}</h3>
            </div>
            <div className={s.description}>
              <p className="subhead-2 -book">{it.description}</p>
            </div>
            {it.text && (
              <div className={s.text}>
                <p className="body -book">{it.text}</p>
              </div>
            )}
            {it.list && <List items={it.list} />}
            {it.images.map((m, k) => (
              <figure key={k} className={s.figure}>
                <Media spec={m} sizes={k === 0 ? '(max-width: 743px) 50vw, 25vw' : '10vw'} />
              </figure>
            ))}
          </article>
        ),
      }))}
    />
  );
}
