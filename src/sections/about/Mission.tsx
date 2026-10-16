'use client';

import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { parallax } from '@/animation/parallax';
import { Media, type MediaSpec } from '@/components/Media';
import { Tag } from '@/components/Tag';
import { col } from '@/lib/grid';
import s from './Mission.module.css';

/**
 * The reference's JetonMission: a tag and a statement, a paragraph, a picture the width of the
 * screen drifting against the scroll, then a smaller heading with a paragraph and a second picture
 * beside it. The pictures here are the app, not photographs.
 */
export function Mission({
  tag,
  title,
  description,
  media,
  secondary,
  id,
}: {
  tag: string;
  title: string;
  description: string[];
  media: MediaSpec;
  secondary?: { title: string; text: string[]; media: MediaSpec };
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      parallax(root.current!.querySelector<HTMLElement>('[data-parallax="wide"]'), -0.2);
      parallax(root.current!.querySelector<HTMLElement>('[data-parallax="small"]'), -0.022);
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.mission} id={id} data-ground="light">
      <div className="g-row">
        <div className={`gc ${s.head}`} style={col({ xxl: 9, md: 12, sm: 14, xs: 16 })}>
          <Tag>{tag}</Tag>
          <h2 className="title-3 -medium">{title}</h2>
        </div>
      </div>
      <div className="g-row">
        <div className={`gc subhead-2 -medium ${s.lead} ${s.textBlock}`} style={col({ xxl: 6, md: 8, sm: 10, xs: 16 })}>
          {description.map(p => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
      <div className={s.wideFrame}>
        <div className={s.wide} data-parallax="wide">
          <Media spec={media} sizes={'photo' in media ? '100vw' : '(max-width: 743px) 30vw, 20vw'} />
        </div>
      </div>
      {secondary && (
        <article className={`g-row ${s.secondary}`}>
          <h3 className="gc title-5 -medium" style={col({ xxl: 6, md: 8, sm: 10, xs: 16 })}>
            {secondary.title}
          </h3>
          <div className="gc" style={col({ xxl: 6, md: 7, sm: 10, xs: 16 }, { xxl: 3, md: 1, sm: 0 })}>
            <div className={`body -book ${s.text} ${s.textBlock}`}>
              {secondary.text.map(p => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className={s.smallFrame}>
              <div className={s.small} data-parallax="small">
                <Media spec={secondary.media} sizes="(max-width: 743px) 30vw, 12vw" />
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
