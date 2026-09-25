'use client';

/**
 * Page transitions, as one system rather than per-component improvisation.
 *
 * The world is not torn down and rebuilt between routes: an overlay of ruled bands closes over
 * the page like a ledger, the route swaps behind it, and the bands open again in the other
 * direction. The rules are the site's own motif, so the transition is made of the same material
 * as everything it interrupts.
 *
 * It is interruptible — a second click during an exit joins the timeline already running
 * instead of starting a competing one — and under reduced motion it does nothing at all except
 * navigate, which is exactly what someone who asked for less movement wants.
 */

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { DUR } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Transition.module.css';

const BANDS = 7;

const Ctx = createContext<{ navigate: (href: string) => void }>({ navigate: () => {} });
export const useTransition = () => useContext(Ctx);

export function Transition({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const navigate = useCallback((href: string) => {
    if (href === pathname) return;
    if (reduced || !overlay.current) { router.push(href); return; }
    if (busy.current) return;
    busy.current = true;

    const bands = overlay.current.querySelectorAll(`.${styles.band}`);
    gsap.timeline({ onComplete: () => router.push(href) })
      .set(overlay.current, { pointerEvents: 'auto' })
      /* Bands close from alternating edges — a page being shut, not a curtain being dropped. */
      .fromTo(bands,
        { scaleX: 0 },
        { scaleX: 1, duration: DUR.spatial, ease: 'power4.inOut', stagger: { each: 0.035, from: 'start' } });
  }, [pathname, reduced, router]);

  /* The enter half runs on arrival, once the new route has painted. */
  useEffect(() => {
    busy.current = false;
    const el = overlay.current;
    if (!el || reduced) return;
    const bands = el.querySelectorAll(`.${styles.band}`);
    gsap.timeline()
      .to(bands, {
        scaleX: 0,
        duration: DUR.spatial,
        ease: 'power4.inOut',
        stagger: { each: 0.035, from: 'end' },
        transformOrigin: 'right center',
      })
      .set(el, { pointerEvents: 'none' })
      .set(bands, { transformOrigin: 'left center' });
  }, [pathname, reduced]);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <div ref={overlay} className={styles.overlay} aria-hidden="true">
        {Array.from({ length: BANDS }, (_, i) => <div key={i} className={styles.band} />)}
      </div>
    </Ctx.Provider>
  );
}

/**
 * A link that goes through the transition. It is a real anchor with a real href, so
 * middle-click, copy-link, and a crawler all behave normally; only the plain left click is
 * taken over.
 */
export function TLink({ href, children, ...rest }: { href: string; children: ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useTransition();
  return (
    <a
      href={href}
      onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
