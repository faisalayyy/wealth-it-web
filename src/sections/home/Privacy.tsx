'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { fullStop } from '@/components/Stop';
import { Icon } from '@/components/Icon';
import { PhoneVideo } from '@/components/PhoneVideo';
import s from './Privacy.module.css';

/**
 * Private by design (the app's tenth poster): a Night panel lit like the top of the app's Home,
 * with what keeps your money yours —
 * every line is in the privacy policy (src/app/privacy) — and a recording of hiding the amounts.
 */
const POINTS = [
  { icon: 'lock', title: 'Lock it', text: 'With a PIN, your face or your fingerprint. The PIN stays in your phone’s secure storage.' },
  { icon: 'eye-off', title: 'Hide amounts', text: 'One tap, and the person next to you can’t read a thing.' },
  { icon: 'key', title: 'Only you can read', text: 'Turn it on and your records are locked with a key only you hold, so not even Wealthit can read them. Or keep them on your phone only.' },
  { icon: 'bank', title: 'No bank login', text: 'Wealthit never asks for your bank password.' },
  { icon: 'shield', title: 'Nothing tracked', text: 'No tracking, advertising or analytics service. Only which parts you use, never what you record.' },
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
            {fullStop('For your eyes only.')}
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
          <PhoneVideo name="hide-amounts-dark" label="Hiding every amount on Home with a tap on the eye, and showing them again" className={s.phone} />
        </div>
      </div>
    </section>
  );
}
