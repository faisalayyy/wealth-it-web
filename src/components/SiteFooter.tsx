'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, isTouch, reducedMotion, useGSAP } from '@/animation/gsap';
import { featurePages } from '@/lib/features';
import { contactEmail, site, socials } from '@/lib/site';
import { Icon } from './Icon';
import { Mark } from './Logo';
import s from './SiteFooter.module.css';

/**
 * The footer: the page ends in a sheet with rounded bottom corners, lifted off a warm grey footer —
 * the way around, the way to write to us, where to follow, the legal line, and the name across the whole width
 * ("it" in the lime) on a glow of the brand's greens, rising into place as it comes into
 * view. `sheet` is the colour of the page above it, so its rounded lip matches.
 */
const COLUMNS = [
  { title: 'Features', links: [...featurePages.map(f => ({ label: f.label, href: `/features/${f.slug}/` })), { label: 'All features', href: '/features/' }] },
  {
    title: 'Help',
    links: [
      { label: 'Help & FAQs', href: '/support/' },
      { label: 'Account & sign-in', href: '/support/#account' },
    ],
  },
  {
    title: 'Get in touch',
    links: [
      { label: contactEmail, href: `mailto:${contactEmail}` },
      { label: 'Get the app', href: '/#get' },
    ],
  },
  { title: 'Follow along', links: socials.map(so => ({ label: `${so.label} ${so.handle}`, href: so.href, icon: so.icon })) },
  { title: 'Legal', links: [{ label: 'Privacy policy', href: '/privacy/' }] },
] as { title: string; links: { label: string; href: string; icon?: string }[] }[];

export function SiteFooter({ sheet = 'var(--n-50)' }: { sheet?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion() || isTouch()) return;
      gsap.from(root.current!.querySelectorAll('[data-glyph]'), {
        yPercent: 60,
        opacity: 0,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current!.querySelector('[data-word]'), start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={s.footer} style={{ '--sheet': sheet } as React.CSSProperties}>
      <div className={s.lip} aria-hidden />
      <div className={`wrap ${s.top}`}>
        <div className={s.brand}>
          <Mark className={s.mark} />
          <p className={s.tagline}>{site.tagline}</p>
        </div>
      </div>
      <div className={`wrap ${s.columns}`}>
        {COLUMNS.map(c => (
          <div key={c.title}>
            <p className="cap">{c.title}</p>
            <ul>
              {c.links.map(l => (
                <li key={l.href}>
                  {l.href.startsWith('mailto:') ? (
                    <a href={l.href} className={s.link}>
                      {l.label}
                    </a>
                  ) : l.href.startsWith('http') ? (
                    <a href={l.href} className={`${s.link} ${s.social}`} target="_blank" rel="noopener me">
                      {l.icon && <Icon name={l.icon} size={17} />}
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className={s.link}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={s.word} data-word aria-hidden>
        {[...'Wealthit'].map((ch, i) => (
          <span key={i} data-glyph data-it={i > 5 ? '' : undefined}>
            {ch}
          </span>
        ))}
      </div>
      <div className={`wrap ${s.legal} cap`}>
        <p>
          Wealthit is a personal finance app. It isn’t a bank, doesn’t hold or move money and doesn’t give financial
          advice. No tracking, advertising or analytics service.
        </p>
        <p>© {new Date().getFullYear()} Wealthit</p>
      </div>
    </footer>
  );
}
