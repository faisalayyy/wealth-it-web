'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion, SplitText, useGSAP } from '@/animation/gsap';
import { introLate } from '@/animation/intro';
import { Button } from '@/components/Button';
import { fullStop } from '@/components/Stop';
import { Icon } from '@/components/Icon';
import { ThreeCanvas } from '@/three/ThreeCanvas';
import { useJump } from './useJump';
import s from './HomeHero.module.css';

/**
 * The first screen (the reference's hero): a warm ground, the keyring of Wealthit charms hanging
 * in from the top edge (knock them with the pointer), and under it the brand's line,
 * a line that turns through the everyday moments the app is for, one sentence about it, the two
 * ways on, and three plain facts.
 *
 * The headline rises letter by letter out of masks that leave room for descenders and side
 * bearings, and the split is undone when it lands, so nothing is ever clipped at rest. When the
 * scripts arrive late, the intro is skipped and what is already showing stays.
 */
const MOMENTS = ['payday', 'rent day', 'the coffee runs', 'the trip fund', 'your savings era'];

const FACTS = [
  { icon: 'globe', label: '26 currencies' },
  { icon: 'shield', label: 'No ads, no tracking' },
  { icon: 'check', label: 'Synced across your devices' },
];

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const jump = useJump();
  const [moment, setMoment] = useState(0);
  const turn = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // on a slow connection the headline has been on screen a while before the scripts arrive:
      // hiding it again to play the intro would look like the page stuck, so it simply stays
      if (reducedMotion() || introLate()) return;
      const split = SplitText.create(root.current!.querySelector('h1')!, { type: 'chars,words', mask: 'chars', charsClass: 'hc' });
      gsap.from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.02, ease: 'expo.out', delay: 0.35, onComplete: () => split.revert() });
      gsap.from(root.current!.querySelectorAll('[data-rise]'), { y: 24, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', delay: 0.75 });
    },
    { scope: root },
  );

  // the box is as wide as the moment showing, so the line stays centred as the words change
  useEffect(() => {
    const box = turn.current;
    const word = box?.children[moment] as HTMLElement | undefined;
    if (box && word) box.style.width = `${word.offsetWidth}px`;
  }, [moment]);

  // the moments turn every 2.4 s while the hero is on screen, and hold still with reduced motion
  useEffect(() => {
    if (reducedMotion()) return;
    let seen = true;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting));
    io.observe(root.current!);
    const id = window.setInterval(() => seen && !document.hidden && setMoment(m => (m + 1) % MOMENTS.length), 2400);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={root} className={s.hero} aria-labelledby="hero-title">
      <ThreeCanvas scene="keyring" className={s.canvas} onReady={() => root.current?.setAttribute('data-ready', '')} />
      <div className={`wrap ${s.content}`}>
        <h1 id="hero-title" className={`display-1 ${s.title}`}>
          {fullStop('Know where you stand.')}
        </h1>
        <p className={s.moments} data-rise>
          <span>Money habits for</span>{' '}
          <span ref={turn} className={s.turn} aria-hidden>
            {MOMENTS.map((m, i) => (
              <span key={m} className={s.word} data-on={i === moment ? '' : undefined} data-past={i === (moment + MOMENTS.length - 1) % MOMENTS.length ? '' : undefined}>
                {m}.
              </span>
            ))}
          </span>
          <span className="sr-only">{MOMENTS.join(', ')}.</span>
        </p>
        <p className={`lead ${s.lead}`} data-rise>
          Your accounts, cash and cards in any currency, added up. Plus budgets that warn you early and goals you can watch grow.
        </p>
        <div className={s.ctas} data-rise>
          <Button label="Get the app" href="/#get" tone="brand" onClick={jump('get')} />
          <Button label="See how it works" href="/how-it-works/" tone="ink" variant="secondary" />
        </div>
        <ul className={s.facts} data-rise>
          {FACTS.map(f => (
            <li key={f.label}>
              <Icon name={f.icon} size={16} stroke={1.8} />
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
