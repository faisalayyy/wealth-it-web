'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import { scrollToTarget, useLenis } from '@/animation/SmoothScroll';
import { featurePages } from '@/lib/features';
import { screenSources } from '@/lib/screens';
import { asset, webApp } from '@/lib/site';
import { Button } from './Button';
import { Icon } from './Icon';
import { Logo, Mark } from './Logo';
import s from './SiteHeader.module.css';

/**
 * The header, after butter.video's (docs/BUTTER_REFERENCE.md): two pills floating over the page.
 *
 * The left pill holds the name, the way around — Features opens a panel of the feature pages,
 * each with a real capture beside it — and two dots at its end. Once the page has scrolled, the
 * links fade and the pill folds to the name and the dots; pointing at it or tabbing into it opens
 * it again. The dots open the menu at any time: the pill widens, "Close" appears beside the dots,
 * the page behind dims, and a panel opens under the pill — four large rows, each with a picture
 * and a line that shows on hover, their rules drawing across, and the feature pages listed small
 * beneath. The dots, "Close", Escape, the dimmed page and following a link all close it.
 *
 * The right pill holds the ways in: Log in, for the web app (which says "Soon" until it has an
 * address, src/lib/site.ts), and the app itself. On phones the left pill is the whole header and
 * the menu carries both.
 */

// About is not published until its content is real (src/app/_about)
const LINKS = [
  { label: 'Help', href: '/support/' },
  { label: 'Privacy', href: '/privacy/' },
];

/** The menu's four large rows. */
const ROWS = [
  { label: 'Features', hint: 'Everything the app does', href: '/features/', thumb: 'features' },
  { label: 'Help', hint: 'Answers, and a way to write to us', href: '/support/', thumb: 'help' },
  { label: 'Privacy', hint: 'What is kept, and why', href: '/privacy/', thumb: 'privacy' },
  { label: 'Get the app', hint: 'Coming soon to iPhone', href: '/#get', thumb: 'app' },
] as const;

function Thumb({ kind }: { kind: (typeof ROWS)[number]['thumb'] }) {
  if (kind === 'features') return <img src={asset('/art/budget.webp')} alt="" loading="lazy" decoding="async" />;
  if (kind === 'app') return <img src={asset('/apple-touch-icon.png')} alt="" loading="lazy" decoding="async" />;
  if (kind === 'help') return <Mark className={s.thumbMark} tone="dark" />;
  return <Icon name="lock" size={24} />;
}

/** Log in: a link to the web app once it has an address; until then it says so. */
function LogIn({ className }: { className: string }) {
  if (webApp)
    return (
      <a href={webApp} className={className}>
        Log in
      </a>
    );
  return (
    <span className={className} data-soon title="The web app is on its way — the same account as the phone app.">
      Log in <span className={s.soon}>Soon</span>
    </span>
  );
}

function useGetApp() {
  const lenis = useLenis();
  return (after?: () => void) => (e: MouseEvent) => {
    after?.();
    const el = document.getElementById('get');
    if (el) {
      e.preventDefault();
      scrollToTarget(lenis, el, 1.4);
    }
  };
}

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const getApp = useGetApp();
  const [compact, setCompact] = useState(false);
  const [pointer, setPointer] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [features, setFeatures] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hover, setHover] = useState(0);
  const root = useRef<HTMLElement>(null);
  const dots = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const menuId = useId();

  // fold the pill once the page is under way
  useEffect(() => {
    const on = () => setCompact(window.scrollY > 120);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // close everything on navigation
  useEffect(() => {
    setFeatures(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setFeatures(false);
      setMenu(m => {
        if (m) dots.current?.focus();
        return false;
      });
    };
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setFeatures(false);
    };
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', away);
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('pointerdown', away);
    };
  }, []);

  // on phones the menu covers the page, so the page holds still under it
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 899px)').matches;
    if (menu && phone) lenis?.stop();
    else lenis?.start();
  }, [menu, lenis]);

  const open = !compact || pointer || focusIn || menu; // the pill at full width
  const showLinks = !menu && (!compact || pointer || focusIn); // its links on show
  const active = (href: string) => pathname.startsWith(href);
  const close = () => {
    setFeatures(false);
    setMenu(false);
  };
  const toggle = () => {
    setFeatures(false);
    setMenu(m => !m);
  };
  const blur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusIn(false);
  };

  return (
    <header
      ref={root}
      className={s.header}
      data-compact={compact ? '' : undefined}
      data-folded={open ? undefined : ''}
      data-links={showLinks ? '' : undefined}
      data-menu={menu ? '' : undefined}
    >
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <div className={s.shade} onClick={close} aria-hidden />
      <div
        className={s.left}
        onMouseEnter={() => setPointer(true)}
        onMouseLeave={() => {
          setPointer(false);
          setFeatures(false);
        }}
        onFocus={() => setFocusIn(true)}
        onBlur={blur}
      >
        <div className={s.bar}>
          <Link href="/" className={s.home} aria-label="Wealthit, home" onClick={close}>
            <Logo />
          </Link>
          <nav aria-label="Main" className={s.nav} inert={!showLinks}>
            <ul className={s.links}>
              <li onMouseEnter={() => !menu && setFeatures(true)}>
                <button
                  type="button"
                  className={s.link}
                  aria-expanded={features}
                  aria-controls={panelId}
                  data-active={pathname.startsWith('/features') ? '' : undefined}
                  onClick={() => setFeatures(o => !o)}
                >
                  Features
                  <Icon name="chevron-down" size={14} className={s.chevron} />
                </button>
              </li>
              {LINKS.map(l => (
                <li key={l.href} onMouseEnter={() => setFeatures(false)}>
                  <Link href={l.href} className={s.link} data-active={active(l.href) ? '' : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button ref={dots} type="button" className={s.dots} aria-expanded={menu} aria-controls={menuId} aria-label={menu ? 'Close menu' : 'Open menu'} onClick={toggle}>
            <span className={s.closeLabel} aria-hidden>
              Close
            </span>
            <svg width="3" height="11" viewBox="0 0 3 11" aria-hidden>
              <rect width="3" height="3" rx="1" />
              <rect y="8" width="3" height="3" rx="1" />
            </svg>
          </button>
        </div>

        {/* the features panel opens down out of the pill */}
        <div id={panelId} className={s.panel} data-open={features ? '' : undefined} inert={!features}>
          <ul className={s.rows}>
            {featurePages.map((f, i) => (
              <li key={f.slug} onMouseEnter={() => setHover(i)}>
                <Link href={`/features/${f.slug}/`} className={s.row} onFocus={() => setHover(i)} onClick={close}>
                  <span className={s.rowLabel}>{f.label}</span>
                  <span className={s.rowText}>{f.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={s.side}>
            <div className={s.preview} aria-hidden>
              {featurePages.map((f, i) => (
                <img key={f.slug} src={screenSources(f.thumb).thumb} alt="" data-on={hover === i ? '' : undefined} loading="lazy" decoding="async" />
              ))}
            </div>
            <Link href="/features/" className={s.all} onClick={close}>
              All features
            </Link>
          </div>
        </div>

        {/* the menu: under the pill, from the two dots */}
        <div id={menuId} className={s.menu} data-open={menu ? '' : undefined} inert={!menu}>
          <nav aria-label="Menu">
            <ul className={s.menuRows}>
              {ROWS.map((r, i) => (
                <li key={r.href} className={s.menuItem} style={{ '--i': i } as React.CSSProperties}>
                  <Link href={r.href} className={s.menuRow} data-active={active(r.href) ? '' : undefined} onClick={r.href === '/#get' ? getApp(close) : close}>
                    <span className={s.menuMain}>
                      <span className={s.thumb} data-kind={r.thumb}>
                        <Thumb kind={r.thumb} />
                      </span>
                      <span className={s.menuLabel}>{r.label}</span>
                    </span>
                    <span className={s.menuHint}>{r.hint}</span>
                  </Link>
                  <span className={s.rule} aria-hidden />
                </li>
              ))}
            </ul>
            <ul className={s.more}>
              {featurePages.map((f, i) => (
                <li key={f.slug} style={{ '--i': i } as React.CSSProperties}>
                  <Link href={`/features/${f.slug}/`} className={s.moreLink} onClick={close}>
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.menuCta}>
            <Button label="Get the app" href="/#get" tone="brand" onClick={getApp(close)} className={s.menuButton} />
            <LogIn className={s.menuLogin} />
          </div>
        </div>
      </div>

      <div className={s.right}>
        <LogIn className={s.login} />
        <Button label="Get the app" href="/#get" tone="ink" size="sm" onClick={getApp()} />
      </div>
    </header>
  );
}
