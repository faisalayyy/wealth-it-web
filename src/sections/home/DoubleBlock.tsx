'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@/animation/gsap';
import { reveal } from '@/animation/reveal';
import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import s from './DoubleBlock.module.css';

/**
 * Two big claims side by side (the reference's double block), each a card with a round arrow to
 * its feature page, a photograph in the middle — the Wallets screen in someone's hand, a couple at
 * the shops — and one line under it.
 */
const BLOCKS: { title: string; text: string; href: string; photo: { name: string; h: number; alt: string; at?: string } }[] = [
  {
    title: 'Every currency. One total.',
    text: 'Dirhams, rupees and dollars, each in its own wallet, added up at the rate you got, a fixed peg or the day’s rate. If there is no rate, it says so — it never guesses.',
    href: '/features/accounts/',
    photo: { name: 'street-phone', h: 2700, alt: 'A hand holding a phone showing Wealthit’s Wallets: accounts in dirhams, dollars, dinars and rupees', at: '50% 32%' },
  },
  {
    title: 'A heads-up before you overspend.',
    text: 'When a budget is nearly used up, you hear about it while there is still time to do something — with what is left and how much that is a day.',
    href: '/features/budgets/',
    photo: { name: 'supermarket', h: 1201, alt: 'A couple shopping for groceries; she checks her phone', at: '70% 40%' },
  },
];

export function DoubleBlock() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => reveal(root.current), { scope: root });
  return (
    <section ref={root} className={s.section} aria-label="Currencies and budgets" data-ground="light">
      <ul className={`wrap ${s.grid}`}>
        {BLOCKS.map(b => (
          <li key={b.href} className={s.card} data-reveal="scale">
            <div className={s.top}>
              <h2 className={s.title}>{coined(b.title)}</h2>
              <Link href={b.href} className={s.arrow} aria-label={`More about this: ${b.title}`}>
                <Icon name="arrow-up-right" size={18} />
              </Link>
            </div>
            <div className={s.media} data-photo>
              <Photo name={b.photo.name} alt={b.photo.alt} height={b.photo.h} className={s.photo} sizes="(max-width: 743px) 100vw, 46vw" focus={b.photo.at} />
            </div>
            <p className={s.text}>{b.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
