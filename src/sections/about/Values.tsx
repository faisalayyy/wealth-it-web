'use client';

import { useRef, useState } from 'react';
import { gsap, isTouch, reducedMotion, ScrollTrigger, useGSAP, vh } from '@/animation/gsap';
import { Tag } from '@/components/Tag';
import { col } from '@/lib/grid';
import s from './Values.module.css';

/**
 * The reference's JetonValues, on the lime: a heading at the right, the values numbered down the
 * page — the one crossing the middle of the screen at full strength, the rest at half — and a
 * quote card rising in at the end.
 */
export function Values({
  tag,
  title,
  values,
  quote,
}: {
  tag: string;
  title: string;
  values: { title: string; text: string }[];
  quote: { text: string; name: string; role: string; initials: string };
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  useGSAP(
    () => {
      const articles = [...root.current!.querySelectorAll<HTMLElement>('article')];
      articles.forEach((a, i, all) => {
        const on = () => setActive(i);
        const off = () => (i !== 0 && i !== all.length - 1 ? setActive(-1) : null);
        ScrollTrigger.create({ trigger: a, start: 'top center', end: 'bottom center', onEnter: on, onEnterBack: on, onLeave: off, onLeaveBack: off });
      });
      const card = root.current!.querySelector<HTMLElement>('[data-quote]')!;
      if (!isTouch() && !reducedMotion())
        gsap.from(card, { duration: 1.2, ease: 'expo', y: () => vh(40), scale: 0.85, opacity: 0, scrollTrigger: { trigger: card.parentElement, start: 'top bottom' } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.values} data-ground="lime">
      <div className={`g-row ${s.head}`}>
        <div className="gc" style={col({ xxl: 8, md: 9, sm: 12 })}>
          <Tag tone="ink">{tag}</Tag>
          <h2 className="title-3 xs-subhead-1 -medium">{title}</h2>
        </div>
      </div>
      {values.map((v, i) => (
        <article key={v.title} className={`g-row ${s.article}`} data-active={active === i}>
          {i !== 0 && <div className={s.divider} />}
          <h3 className="gc" style={col({ xxl: 8, md: 7, sm: 16, xs: 16 })}>
            <span className="subhead-2 -medium">{String(i + 1).padStart(2, '0')}.</span>
            <span className="title-5 xs-subhead-2 -medium">{v.title}</span>
          </h3>
          <p className="gc subhead-2 xs-body -book" style={col({ xxl: 8, md: 9, sm: 12, xs: 12 }, { sm: 4, xs: 4 })}>
            {v.text}
          </p>
        </article>
      ))}
      <div className={`g-row ${s.quoteRow}`}>
        <div className="gc body -book" style={col({ xxl: 8, md: 9, sm: 12, xs: 16 })}>
          <figure className={s.quote} data-quote>
            <blockquote>{quote.text}</blockquote>
            <figcaption className={s.endorser}>
              <span className={s.avatar} aria-hidden>
                {quote.initials}
              </span>
              <span>
                <span className={s.name}>{quote.name}</span>
                <span className={s.role}>{quote.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
