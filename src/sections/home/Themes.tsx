'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { Phone } from '@/components/Phone';
import { Screen } from '@/components/Screen';
import type { ScreenName } from '@/lib/screens';
import s from './Themes.module.css';

/**
 * Make it yours (the reference's "Get the look"): a dark card at the left showing one real screen,
 * and the ways Home can look, listed large at the right in two tones. Pointing at a name, focusing
 * it, or tapping it puts that screen in the card.
 */
const VIEWS: { name: string; where: string; screen: ScreenName; alt: string }[] = [
  { name: 'Light', where: 'Home', screen: 'home-light', alt: 'Home in the light theme' },
  { name: 'Dark', where: 'Home', screen: 'home-dark', alt: 'Home in the dark theme' },
  { name: 'Hidden', where: 'Amounts', screen: 'home-hidden-dark', alt: 'Home with every amount hidden' },
  { name: 'Your order', where: 'Customise', screen: 'customise-light', alt: 'Customise Home: choosing what Home shows, and in what order' },
];

export function Themes() {
  const [on, setOn] = useState(0);
  return (
    <section className={s.section} aria-labelledby="themes-title" data-ground="light">
      <div className={`wrap ${s.grid}`}>
        <div className={s.media}>
          <Phone variant="device" className={s.phone} sizes="(max-width: 743px) 60vw, 320px">
            {VIEWS.map((v, i) => (
              <Screen key={v.screen} name={v.screen} alt={i === on ? v.alt : ''} sizes="(max-width: 743px) 60vw, 320px" className={s.shot} data-on={i === on ? '' : undefined} />
            ))}
          </Phone>
        </div>
        <div>
          <p id="themes-title" className="cap">
            Make it yours
          </p>
          <ul className={s.list}>
            {VIEWS.map((v, i) => (
              <li key={v.name}>
                <button type="button" className={s.item} aria-pressed={i === on} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)}>
                  <span>{v.name}</span> <span className={s.where}>{v.where}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className={`lead ${s.note}`}>Light or dark, amounts on show or hidden from the person next to you, and Home in the order you choose.</p>
          <Link href="/features/home/" className={s.more}>
            More about Home & widgets
            <Icon name="arrow-up-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
