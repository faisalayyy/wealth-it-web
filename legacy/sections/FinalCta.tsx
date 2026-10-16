'use client';

import { useRef } from 'react';
import { reducedMotion, ScrollTrigger, useGSAP, vh } from '@/animation/gsap';
import { AppButtons } from '@/components/AppButtons';
import s from './FinalCta.module.css';

/**
 * The last word, said twice: once in lime with ink type, and underneath it again in white with
 * the lime's text colour. As the section scrolls up the screen the lime lifts away like a curtain
 * with a point in its hem — a V opening from the bottom centre — and leaves the white one behind.
 */
function Content({ decorative }: { decorative?: boolean }) {
  const Title = decorative ? 'div' : 'h2';
  const Desc = decorative ? 'div' : 'p';
  return (
    <>
      <Title className={`title-1 -medium ${s.title}`} id={decorative ? undefined : 'get-title'}>
        Open it.{'\n'}Write it down.
      </Title>
      <Desc className={`subhead-2 -medium ${s.desc}`}>
        Sign up, and your first record takes a few seconds. Nothing to connect.
      </Desc>
      <div className={s.ctas}>
        <AppButtons tone={decorative ? 'neutral' : 'brand'} />
      </div>
    </>
  );
}

export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const clone = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = clone.current!;
      if (reducedMotion()) {
        el.style.clipPath = 'polygon(0% -1%, 100% -1%, 100% 0%, 50% 1%, 50% 1%, 0% 0%)';
        return;
      }
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: () => `top+=${vh(1)}px top`,
        onUpdate: ({ progress: p }) => {
          const x = 100 * (1.01 - Math.pow(p, 0.6));
          const o = 100 * (1 - Math.pow(p, 3));
          el.style.clipPath = `polygon(0% -1%, 100% -1%, 100% ${o}%, 50% ${x}%, 50% ${x}%, 0% ${o}%)`;
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.section} id="get" aria-labelledby="get-title">
      <div className={`${s.layer} ${s.white}`} data-ground="light">
        <Content />
      </div>
      <div ref={clone} className={`${s.layer} ${s.lime}`} aria-hidden inert data-ground="lime">
        <Content decorative />
      </div>
    </section>
  );
}
