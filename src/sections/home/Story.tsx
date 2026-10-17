'use client';

import { Fragment, useRef } from 'react';
import { gsap, reducedMotion, useGSAP } from '@/animation/gsap';
import { Phone } from '@/components/Phone';
import { PhoneVideo } from '@/components/PhoneVideo';
import { Crop, Cut } from '@/components/Screen';
import { crop as cropOf, cut as cutOf, type CropName, type CutName, type ScreenName } from '@/lib/screens';
import { asset } from '@/lib/site';
import s from './Story.module.css';

/**
 * A capability, told the reference's way: a small caption and one sentence that sharpens out of a
 * blur word by word as it comes up the screen, beside a dark panel with the real screen in a phone
 * that rises through it at its own pace. A piece of the app can sit inside the sentence.
 */
export type Piece = { crop: CropName; label: string } | { cut: CutName; label: string } | { art: string; label: string; ratio?: number };

/** A piece's width for a height of 1em: its own shape, kept between a square and a short bar. */
export function pieceWidth(p: Piece) {
  if ('art' in p) return `${(p.ratio ?? 1.25).toFixed(2)}em`;
  const { width, height } = 'crop' in p ? cropOf(p.crop) : cutOf(p.cut);
  return `${Math.min(2.6, Math.max(1.1, width / height)).toFixed(2)}em`;
}

/** The picture inside a piece. */
export function PieceImage({ p, className }: { p: Piece; className?: string }) {
  if ('art' in p)
    return (
      <picture className={className}>
        <source type="image/avif" srcSet={asset(`/art/${p.art}.avif`)} />
        <img src={asset(`/art/${p.art}.webp`)} alt={p.label} loading="lazy" decoding="async" draggable={false} />
      </picture>
    );
  return 'crop' in p ? <Crop name={p.crop} alt={p.label} className={className} /> : <Cut name={p.cut} alt={p.label} className={className} sizes="160px" />;
}
export type Part = string | Piece;
type Token = string | Piece;

// a piece never starts a line: it keeps to the word before it and the stop after it
function lines(parts: Part[]) {
  const groups: Token[][] = [];
  for (const p of parts) {
    if (typeof p !== 'string') {
      if (groups.length) groups[groups.length - 1].push(p);
      else groups.push([p]);
      continue;
    }
    const glued = !/^\s/.test(p) && typeof groups.at(-1)?.at(-1) === 'object';
    p.split(/\s+/)
      .filter(Boolean)
      .forEach((w, i) => (i === 0 && glued ? groups[groups.length - 1].push(w) : groups.push([w])));
  }
  return groups;
}

export function Words({ parts, chip }: { parts: Part[]; chip?: (p: Piece) => React.ReactNode }) {
  const piece =
    chip ??
    ((p: Piece) => (
      <span className={s.chip} data-w style={{ width: pieceWidth(p) }}>
        <PieceImage p={p} className={s.crop} />
      </span>
    ));
  const token = (t: Token) => (typeof t === 'string' ? <span data-w>{t}</span> : piece(t));
  return (
    <>
      {lines(parts).map((g, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          {g.length === 1 ? (
            token(g[0])
          ) : (
            <span style={{ whiteSpace: 'nowrap' }}>
              {g.map((t, k) => (
                <Fragment key={k}>
                  {k > 0 && !(typeof t === 'string' && typeof g[k - 1] === 'object') && ' '}
                  {token(t)}
                </Fragment>
              ))}
            </span>
          )}
        </Fragment>
      ))}
    </>
  );
}

export function Story({
  caption,
  parts,
  screen,
  video,
  alt,
  side = 'right',
  id,
}: {
  caption: string;
  parts: Part[];
  /** a still capture, or a screen recording (public/videos/<name>.mp4) */
  screen?: ScreenName;
  video?: string;
  alt: string;
  side?: 'left' | 'right';
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      gsap.fromTo(
        el.querySelectorAll('[data-w]'),
        { opacity: 0.12, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el.querySelector('[data-copy]'), start: 'top 82%', end: 'center 45%', scrub: 0.5 } },
      );
      gsap.fromTo(el.querySelector('[data-rise]'), { yPercent: 22 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.story} data-side={side} id={id}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.copy} data-copy>
          <p className="cap">{caption}</p>
          <p className={`story ${s.text}`}>
            <Words parts={parts} />
          </p>
        </div>
        <div className={s.panel}>
          <div className={s.phoneWrap} data-rise>
            {video ? (
              <PhoneVideo name={video} label={alt} className={s.phone} />
            ) : (
              <Phone screen={screen} variant="device" className={s.phone} sizes="(max-width: 743px) 60vw, 320px" alt={alt} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
