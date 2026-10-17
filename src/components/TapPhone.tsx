'use client';

import { useEffect, useRef } from 'react';
import { reducedMotion } from '@/animation/gsap';
import { Icon } from './Icon';
import { Phone } from './Phone';
import { Cut } from './Screen';
import s from './TapPhone.module.css';

/**
 * Tap to Record, as it happens: the iPhone's Lock Screen (the real capture the App Store poster
 * uses), and Wealthit's card arriving on it after an Apple Pay payment (drawn by the poster from the
 * app's TapLiveActivity.swift, media-src/app), lifted a little out of the screen the way the poster
 * shows it. Add is pressed, the card goes, and a note beside the phone says it was recorded. It plays
 * while on screen; with reduced motion the card simply sits on the Lock Screen.
 */
export function TapPhone({ className, sizes = '(max-width: 743px) 70vw, 340px', note = true }: { className?: string; sizes?: string; note?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reducedMotion()) {
      el.dataset.still = '';
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.dataset.play = '';
      else delete el.dataset.play;
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${s.tap} ${className ?? ''}`}>
      <Phone screen="lockscreen" exact variant="device" className={s.phone} sizes={sizes} alt="A phone’s Lock Screen" />
      <div className={s.card}>
        <Cut name="tap-card" className={s.cut} sizes={sizes} />
        <span className={s.press} aria-hidden />
      </div>
      {note && (
        <p className={s.note} aria-hidden>
          <Icon name="check" size={16} stroke={2.2} /> Recorded in Groceries
        </p>
      )}
    </div>
  );
}
