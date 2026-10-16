'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Phone } from '@/components/Phone';
import s from './Privacy.module.css';

/**
 * Private by design (the app's tenth poster): a Forest panel with what keeps your money yours —
 * every line is in the privacy policy (src/app/privacy) — and Home with its amounts hidden.
 */
const POINTS = [
  { icon: 'lock', title: 'Face ID or a PIN', text: 'Lock the app. The PIN stays in your phone’s keychain.' },
  { icon: 'eye-off', title: 'Hide amounts', text: 'One tap, and the person next to you can’t read a thing.' },
  { icon: 'bank', title: 'No bank login', text: 'Wealthit never asks for your bank password.' },
  { icon: 'shield', title: 'Nothing tracked', text: 'No tracking, no advertising, no analytics.' },
  { icon: 'trash', title: 'Delete it any time', text: 'From your profile. Sixty days later, everything is gone for good.' },
];

export function Privacy() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => reveal(root.current), { scope: root });
  return (
    <section ref={root} className={s.section} aria-labelledby="privacy-title" data-ground="dark">
      <div className={`wrap ${s.panel}`}>
        <div className={s.copy}>
          <p className={`cap ${s.cap}`} data-reveal>
            Private by design
          </p>
          <h2 id="privacy-title" className={`display-2 ${s.title}`} data-reveal>
            {coined('For your eyes only.')}
          </h2>
          <ul className={s.points}>
            {POINTS.map(p => (
              <li key={p.title} className={s.point} data-reveal>
                <span className={s.icon} aria-hidden>
                  <Icon name={p.icon} size={20} />
                </span>
                <span>
                  <strong>{p.title}</strong>
                  <span className={s.text}>{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/privacy/" className={s.more} data-reveal>
            Read the privacy policy
            <Icon name="arrow-up-right" size={16} />
          </Link>
        </div>
        <div className={s.media} data-reveal="scale">
          <Phone screen="home-hidden-dark" variant="device" className={s.phone} sizes="(max-width: 743px) 60vw, 320px" alt="Home with every amount hidden" />
        </div>
      </div>
    </section>
  );
}
