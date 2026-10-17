'use client';

import { useRef } from 'react';
import { gsap, reducedMotion, SplitText, useGSAP } from '@/animation/gsap';
import { Button } from '@/components/Button';
import { coined } from '@/components/Coin';
import { ThreeCanvas } from '@/three/ThreeCanvas';
import { useJump } from './useJump';
import s from './HomeHero.module.css';

/**
 * The first screen (the reference's hero): a warm ground, the keyring of Wealthit charms hanging
 * in from the top edge — knock them with the pointer — and under it the App Store line, one
 * sentence about the app, and the two ways on: to the app, and to how it works.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const jump = useJump();

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const split = SplitText.create(root.current!.querySelector('h1')!, { type: 'chars,words', mask: 'chars' });
      gsap.from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.02, ease: 'expo.out', delay: 0.35 });
      gsap.from(root.current!.querySelector('.coin'), { scale: 0, duration: 0.9, ease: 'back.out(3)', delay: 0.95 });
      gsap.from(root.current!.querySelectorAll('[data-rise]'), { y: 24, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', delay: 0.8 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.hero} aria-labelledby="hero-title">
      <ThreeCanvas scene="keyring" className={s.canvas} onReady={() => root.current?.setAttribute('data-ready', '')} />
      <div className={`wrap ${s.content}`}>
        <h1 id="hero-title" className="display-1">
          {coined('Know where you stand.')}
        </h1>
        <p className={`lead ${s.lead}`} data-rise>
          See your accounts, cash and cards in any currency added up, along with what’s left this month, what’s due and what you’re saving for.
        </p>
        <div className={s.ctas} data-rise>
          <Button label="Get the app" href="/#get" tone="brand" onClick={jump('get')} />
          <Button label="See how it works" href="/#how" tone="ink" variant="secondary" onClick={jump('how')} />
        </div>
      </div>
    </section>
  );
}
