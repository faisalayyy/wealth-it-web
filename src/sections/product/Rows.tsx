'use client';

import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { Shot } from '@/components/Shot';
import type { Row } from '@/lib/features';
import s from './Rows.module.css';

/**
 * The reference's feature rows: a caption, a short headline and a few lines beside a large rounded
 * panel holding the app, the sides swapping row by row.
 */
export function Rows({ rows, id }: { rows: Row[]; id?: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => reveal(root.current), { scope: root });
  return (
    <section ref={root} className={s.rows} id={id} data-ground="light">
      {rows.map((r, i) => (
        <article key={r.title} className={`wrap ${s.row}`} data-flip={i % 2 ? '' : undefined}>
          <div className={s.copy} data-reveal>
            <p className="cap">{r.cap}</p>
            <h2 className={`story ${s.title}`}>{r.title}</h2>
            <p className={`lead ${s.text}`}>{r.text}</p>
          </div>
          <div className={s.panel} data-dark={r.media.dark ? '' : undefined} data-reveal="scale">
            <Shot media={r.media} />
          </div>
        </article>
      ))}
    </section>
  );
}
