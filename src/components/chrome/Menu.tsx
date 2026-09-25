'use client';

/**
 * The menu is a room, not a dropdown.
 *
 * Three destinations do not need a panel, so instead of a white rectangle with a list in it the
 * page is replaced: the rules close, the names arrive one line at a time at display size, and
 * the number in the margin follows whichever one you are considering. Hovering a name changes
 * the whole environment rather than tinting a row, which is the difference between a menu that
 * is designed and a menu that is styled.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { DUR, STAGGER } from '@/lib/motion';
import { nav, site } from '@/lib/content';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import { useTransition } from '@/components/providers/Transition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Menu.module.css';

const BLURB: Record<string, string> = {
  '/': 'The whole argument, in six chapters and one ledger.',
  '/privacy/': 'What the app stores, what it sends, and why the second list is empty.',
  '/support/': 'Backups, lost phones, currencies that will not convert.',
};

export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { lock, unlock } = useSmoothScroll();
  const { navigate } = useTransition();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (open) {
      lock();
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.set(el, { pointerEvents: 'auto' })
          .to(el, { opacity: 1, duration: reduced ? 0 : DUR.ui, ease: 'none' })
          .fromTo(`.${styles.sheet}`,
            { yPercent: -101 },
            { yPercent: 0, duration: reduced ? 0 : DUR.spatial, ease: 'power4.inOut' }, 0)
          .fromTo(`.${styles.line}`,
            { yPercent: 110 },
            { yPercent: 0, duration: reduced ? 0 : 0.9, ease: 'expo.out', stagger: STAGGER.normal },
            reduced ? 0 : 0.22)
          .fromTo(`.${styles.foot} > *`,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: reduced ? 0 : DUR.ui, stagger: STAGGER.tight },
            reduced ? 0 : 0.5);
      }, el);
      /* Focus moves into the room, so a keyboard is not left behind the overlay. */
      el.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
      return () => ctx.revert();
    }

    unlock();
    gsap.to(el, { opacity: 0, duration: reduced ? 0 : DUR.ui, onComplete: () => gsap.set(el, { pointerEvents: 'none' }) });
    gsap.to(`.${styles.sheet}`, { yPercent: -101, duration: reduced ? 0 : DUR.spatial, ease: 'power4.inOut' });
  }, [open, lock, unlock, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="site-menu"
      className={styles.root}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className={styles.sheet}>
        <button className={styles.close} onClick={onClose} data-cursor="link">
          <span className="mono">Close</span>
          <span aria-hidden="true">✕</span>
        </button>

        <nav className={styles.list} aria-label="Pages">
          {nav.map((item, i) => (
            <div key={item.href} className={styles.row}>
              <span className={`mono ${styles.num}`}>{String(i + 1).padStart(2, '0')}</span>
              <a
                href={item.href}
                className={styles.link}
                data-cursor="link"
                aria-current={pathname === item.href ? 'page' : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                onClick={e => { e.preventDefault(); onClose(); navigate(item.href); }}
              >
                <span className={styles.line}>{item.label}</span>
              </a>
              <span className={`mono ${styles.blurb}`} data-lit={hovered === item.href}>
                {BLURB[item.href]}
              </span>
            </div>
          ))}
        </nav>

        <div className={styles.foot}>
          <p className="mono">{site.name} — {site.tagline}</p>
          <p className="mono">iPhone · Android · not in the stores yet</p>
        </div>
      </div>
    </div>
  );
}
