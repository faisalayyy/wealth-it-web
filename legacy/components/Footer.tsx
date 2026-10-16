'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { gsap, isTouch, reducedMotion, ScrollTrigger, useGSAP } from '@/animation/gsap';
import { AppButtons } from './AppButtons';
import { Icon } from './Icon';
import { Mark } from './Logo';
import { Screen } from './Screen';
import { featurePages } from '@/lib/features';
import s from './Footer.module.css';

/**
 * The footer: five columns of links (accordions on a phone), the store buttons, a hairline, and
 * then the name set as wide as the page, its letters climbing into place one after another as it
 * scrolls up. Under it, the plain facts — and, where the reference shows its partners, a card
 * about the only partner this site has: the app itself.
 */
const LINKS = [
  { title: 'Get started', items: [{ label: 'Get the app', href: '/#get' }, { label: 'How it works', href: '/#records' }] },
  { title: 'Features', items: featurePages.map(f => ({ label: f.label, href: `/features/${f.slug}/` })) },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'The rules it keeps', href: '/about/#rules' },
    ],
  },
  { title: 'Legal', items: [{ label: 'Privacy policy', href: '/privacy/' }] },
  {
    title: 'Help',
    items: [
      { label: 'Support', href: '/support/' },
      { label: 'Backups', href: '/support/#backups' },
      { label: 'A lost phone', href: '/support/#lost' },
    ],
  },
];

const WORD = 'Wealth-it';

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      if (reducedMotion() || isTouch()) return;
      const glyphs = root.current!.querySelectorAll('[data-glyph]');
      const box = root.current!.querySelector<HTMLElement>('[data-wordmark]')!;
      const tl = gsap.timeline({ paused: true }).fromTo(
        glyphs,
        { x: -20, y: () => 0.8 * box.offsetHeight },
        { x: 0, y: 0, duration: 1, stagger: 0.05, ease: 'power1' },
      );
      let smooth: gsap.core.Tween | null = null;
      ScrollTrigger.create({
        trigger: box,
        start: 'top bottom',
        end: 'center center',
        onUpdate: ({ progress }) => {
          smooth?.kill();
          smooth = gsap.to(tl, { progress, duration: 0.7, ease: 'power4' });
        },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={`g-row-full ${s.footer} -book`} data-ground="light">
      <ul className={`${s.links} body`}>
        {LINKS.map((group, i) => (
          <li key={group.title} data-open={open === i ? '' : undefined}>
            <button type="button" className={s.groupHead} onClick={() => setOpen(o => (o === i ? null : i))} aria-expanded={open === i}>
              <span>{group.title}</span>
              <Icon name="plus" size={20} className={s.plus} />
            </button>
            <ul className={s.groupItems}>
              {group.items.map(it => (
                <li key={it.href + it.label}>
                  <Link href={it.href} className={s.link}>
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className={s.externals}>
        <AppButtons tone="brand" />
        <p className={`${s.note} caption`}>Not in the stores yet — coming to both.</p>
      </div>

      <div className={s.divider} />
      <div className={s.meta}>
        <span className={s.lang}>English</span>
        <span className="caption">© 2026 Wealth-it</span>
      </div>

      <div className={s.wordmark} data-wordmark aria-label="Wealth-it" role="img">
        <span className={s.glyphs} aria-hidden>
          <span className={s.markGlyph} data-glyph>
            <Mark className={s.mark} />
          </span>
          {[...WORD].map((ch, i) => (
            <span key={i} className={s.glyph} data-glyph>
              {ch}
            </span>
          ))}
        </span>
      </div>

      <p className={`${s.legal} caption`}>
        Wealth-it is a personal finance app that keeps its ledger on your phone. It is not a bank, does not hold or move
        money and does not give financial advice.
      </p>

      <div className={s.cards}>
        <div className={s.card}>
          <div className={s.strip} aria-hidden>
            {(['dashboard', 'budgets', 'wallets', 'stat-spending', 'schedules'] as const).map(n => (
              <Screen key={n} name={n} sizes="160px" alt="" className={s.stripShot} />
            ))}
          </div>
          <div className={s.cardGradient} />
          <p className={`${s.cardText} body -medium`}>
            <span className="caption">On this page</span>
            Every screen is Wealth-it itself — captured from the app, not drawn for the website.
          </p>
        </div>
      </div>
    </footer>
  );
}
