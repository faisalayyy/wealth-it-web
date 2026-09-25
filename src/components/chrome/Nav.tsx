'use client';

/**
 * Not a navbar. A rule across the top of the document with four things sitting on it: the
 * name, where you are, a way to leave, and the one action.
 *
 * It changes with scroll rather than staying fixed and full: at the top it is spread to the
 * page's margins; once the reader is inside the document it draws in and the chapter marker
 * starts counting. The site is a document before it is an experience, and this is its running
 * head.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { TLink } from '@/components/providers/Transition';
import { useMagnetic } from '@/hooks/useMagnetic';
import { CHAPTERS } from '@/lib/content';
import styles from './Nav.module.css';

export function Nav({ onOpenMenu, menuOpen }: { onOpenMenu: () => void; menuOpen: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const cta = useMagnetic<HTMLAnchorElement>(0.4);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top top-=40',
        end: 99999,
        onUpdate: self => el.setAttribute('data-condensed', String(self.scroll() > 40)),
      });

      /* The running head reports the chapter you are actually in, which means the chapter has
         to say so. Each one registers a trigger against its own section. */
      if (!isHome) return;
      CHAPTERS.forEach(c => {
        const section = document.getElementById(c.id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: self => self.isActive && setChapter(`${c.index} · ${c.kicker}`),
        });
      });
    }, el);
    return () => ctx.revert();
  }, [isHome, pathname]);

  return (
    <header ref={root} className={styles.nav} data-condensed="false">
      <TLink href="/" className={styles.mark} data-cursor="link" aria-label="Wealth-it, home">
        <span className={styles.markGlyph} aria-hidden="true" />
        <span className={styles.markText}>Wealth&#8209;it</span>
      </TLink>

      <div className={styles.here} aria-hidden="true">
        <span className="mono">{chapter ?? ''}</span>
      </div>

      <div className={styles.right}>
        <a
          ref={cta}
          href="#enter"
          className={styles.cta}
          data-cursor="link"
          onClick={e => {
            e.preventDefault();
            document.getElementById('enter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <span className="mono">Get the app</span>
        </a>
        <button
          className={styles.menuBtn}
          onClick={onOpenMenu}
          data-cursor="link"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span className="sr-only">Open menu</span>
          <span className={styles.menuRules} aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>
      </div>
    </header>
  );
}
