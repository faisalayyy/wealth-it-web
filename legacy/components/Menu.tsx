'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { gsap } from '@/animation/gsap';
import { scrollToTarget, useLenis } from '@/animation/SmoothScroll';
import { screenSources, type ScreenName } from '@/lib/screens';
import { menu } from '@/lib/site';
import { Button } from './Button';
import { Icon } from './Icon';
import s from './Menu.module.css';

/**
 * The floating menu at the bottom of every screen.
 *
 * On a wide screen it is a pill of items — home, the feature pages in a drawer, About, and a filled
 * "Get the app" at the end; the drawer slides up out of the pill with a thumbnail — a real
 * capture — beside its links, and the page behind dims a little. Below 1024px it collapses into
 * one "Menu" pill that opens a full-screen list.
 */

type Group = Extract<(typeof menu)[number], { type: 'group' }>;

function useAnchor() {
  const pathname = usePathname();
  const lenis = useLenis();
  // `here`: scroll to the hash on whichever page this is, if the page has it (the download section)
  return (href: string, after?: () => void, here = false) => (e: MouseEvent) => {
    after?.();
    const [path, hash] = href.split('#');
    if (hash && (here || ((path === '/' || path === '') && pathname === '/'))) {
      const el = document.getElementById(hash);
      if (el) {
        e.preventDefault();
        scrollToTarget(lenis, el, 1.6);
        if (pathname === '/') history.replaceState(null, '', `#${hash}`);
      }
    }
  };
}

/**
 * Which ground lies under a point — `lime`, `light` or `dark` — as the sections declare it with
 * `data-ground`. The last one in the page that covers the point wins, so a layer painted over a
 * section counts over it; a polygon clip-path (the final section's curtain) counts by its shape.
 */
function groundAt(x: number, y: number) {
  let ground = 'light';
  document.querySelectorAll<HTMLElement>('[data-ground]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom || !insideClip(el, r, x, y)) return;
    ground = el.dataset.ground!;
  });
  return ground;
}

function insideClip(el: HTMLElement, r: DOMRect, x: number, y: number) {
  const clip = getComputedStyle(el).clipPath;
  if (!clip.startsWith('polygon(')) return true;
  const pts = clip
    .slice(8, -1)
    .split(',')
    .map(pair => pair.trim().split(/\s+/))
    .filter(pair => pair.length === 2)
    .map(pair => pair.map((v, i) => (v.endsWith('%') ? (parseFloat(v) / 100) * (i ? r.height : r.width) : parseFloat(v))));
  const px = x - r.left;
  const py = y - r.top;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function Thumb({ name }: { name: string }) {
  return <img src={screenSources(name as ScreenName).thumb} alt="" loading="lazy" decoding="async" />;
}

function Drawer({ group, id, onNavigate }: { group: Group; id: string; onNavigate: (href: string) => (e: MouseEvent) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={s.drawer} id={id}>
      <div className={s.slot}>
        <ul className={s.links}>
          {group.items.map((it, i) => (
            <li key={it.href} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)}>
              <Link href={it.href} className={s.link} data-on={hover === i ? '' : undefined} onClick={onNavigate(it.href)}>
                <span className={s.dot} />
                <span className={s.linkLabel}>{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={s.thumbnail} aria-hidden>
          {group.items.map((it, i) => (
            <span key={it.href} data-on={hover === i ? '' : undefined}>
              <Thumb name={it.thumb} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Menu() {
  const pathname = usePathname();
  const anchor = useAnchor();
  const [open, setOpen] = useState<number | null>(null);
  const [overlay, setOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // the pill takes its colour from what it floats over: white on lime, lime on white or dark.
  // Checked once a frame while the page moves, at the middle of whichever pill is showing.
  useEffect(() => {
    const nav = navRef.current!;
    let raf = 0;
    const check = () => {
      raf = 0;
      const pill = [nav.querySelector(`.${s.bar}`), nav.querySelector(`.${s.menuButton}`)]
        .map(el => el?.getBoundingClientRect())
        .find(r => r && r.width > 0);
      if (pill) nav.dataset.over = groundAt(pill.left + pill.width / 2, pill.top + pill.height / 2);
    };
    const queue = () => {
      raf ||= requestAnimationFrame(check);
    };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    queue();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
    };
  }, [pathname]);

  // the full-screen list on phones: it rises from below, its rows after it
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const rows = el.querySelectorAll('[data-row]');
    if (overlay) {
      lenis?.stop();
      gsap.set(el, { visibility: 'visible' });
      gsap.fromTo(el, { yPercent: 101 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' });
      gsap.fromTo(rows, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.04, delay: 0.1 });
    } else {
      lenis?.start();
      gsap.to(el, { yPercent: 101, duration: 0.7, ease: 'power4.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) });
    }
  }, [overlay, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setOverlay(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setOverlay(false);
  const isActive = (href: string) => href === pathname || (href !== '/' && pathname.startsWith(href.replace(/#.*/, '')) && !href.includes('#'));

  const items: ReactNode = menu.map((item, i) => {
    if (item.type === 'home')
      return (
        <li key="home">
          <Link href="/" className={s.button} data-active={pathname === '/' ? '' : undefined} aria-label="Home">
            <span className={s.bg} />
            <Icon name="home" size={24} />
          </Link>
        </li>
      );
    if (item.type === 'link')
      return (
        <li key={item.href}>
          <Link href={item.href} className={s.button} data-active={isActive(item.href) ? '' : undefined}>
            <span className={s.bg} />
            <span>{item.label}</span>
          </Link>
        </li>
      );
    if (item.type === 'cta')
      return (
        <li key={item.href}>
          <Link href={item.href} className={`${s.button} ${s.cta}`} onClick={anchor(item.href, undefined, true)}>
            <span className={s.bg} />
            <span>{item.label}</span>
          </Link>
        </li>
      );
    const id = `menu-drawer-${i}`;
    return (
      <li key={item.label} className={s.group} data-open={open === i ? '' : undefined} onMouseEnter={() => setOpen(i)} onMouseLeave={() => setOpen(null)}>
        <button
          type="button"
          className={s.button}
          data-active={pathname.startsWith(item.base) ? '' : undefined}
          aria-expanded={open === i}
          aria-controls={id}
          onClick={() => setOpen(i)}
          onFocus={() => setOpen(i)}
        >
          <span className={s.bg} />
          <span>{item.label}</span>
          <Icon name="chevron-down" size={16} className={s.chevron} />
        </button>
        <Drawer group={item} id={id} onNavigate={href => anchor(href, () => setOpen(null))} />
      </li>
    );
  });

  return (
    // every page opens on a lime header, so the pill starts white and never flashes lime first
    <nav ref={navRef} className={s.menu} aria-label="Menu" data-over="lime" data-open={open !== null ? '' : undefined}>
      <ul className={s.bar}>{items}</ul>
      <div className={s.shade} aria-hidden />

      {/* phones */}
      <button type="button" className={s.menuButton} aria-expanded={overlay} aria-controls="menu-overlay" onClick={() => setOverlay(o => !o)}>
        <span className={s.bg} />
        <span>Menu</span>
        <svg className={s.burger} viewBox="0 0 24 24" aria-hidden>
          <path d="M4 9h16" />
          <path d="M4 15h16" />
        </svg>
      </button>

      <div ref={overlayRef} id="menu-overlay" className={s.overlay} data-open={overlay ? '' : undefined} inert={!overlay}>
        <div className={s.overlayCtas} data-row>
          <Button label="Privacy" href="/privacy/" tone="neutral" variant="secondary" />
          <Button label="Get Wealth-it" href="/#get" tone="neutral" variant="primary" />
        </div>
        <ul className={s.list}>
          <li data-row>
            <Link href="/" className={s.row} data-active={pathname === '/' ? '' : undefined} onClick={close}>
              <span className={s.rowThumb}>
                <Thumb name="dashboard" />
              </span>
              <span>Homepage</span>
            </Link>
          </li>
          {menu.map(item =>
            item.type === 'group' ? (
              <li key={item.label} className={s.section}>
                <p className={s.sectionLabel} data-row>
                  {item.label}
                </p>
                <ul>
                  {item.items.map(it => (
                    <li key={it.href} data-row>
                      <Link href={it.href} className={s.row} data-active={isActive(it.href) ? '' : undefined} onClick={anchor(it.href, close)}>
                        <span className={s.rowThumb}>
                          <Thumb name={it.thumb} />
                        </span>
                        <span>{it.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : item.type === 'link' || item.type === 'cta' ? (
              <li key={item.href} className={s.section} data-row>
                <Link
                  href={item.href}
                  className={s.row}
                  data-active={item.type === 'link' && isActive(item.href) ? '' : undefined}
                  onClick={item.type === 'cta' ? anchor(item.href, close, true) : close}
                >
                  <span className={`${s.rowThumb} ${s.rowThumbPlain}`}>
                    <Icon name={item.icon} size={22} />
                  </span>
                  <span className={s.rowLabel}>{item.label}</span>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </nav>
  );
}
