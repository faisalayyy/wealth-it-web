'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, reducedMotion, ScrollTrigger } from '@/animation/gsap';
import { markNavigated } from '@/animation/intro';
import { basePath } from '@/lib/site';
import s from './PageTransition.module.css';

/**
 * A quiet change of page. A click on a link to another page fades the page out with a small lift
 * while a thin line runs along the top of the window; the route changes behind it, and the new page
 * eases up into place as the line completes. The header stays put throughout. Modified clicks, new
 * tabs, links within the page and reduced motion go straight through.
 *
 * It can never leave a page invisible: if the next page hasn't arrived within a few seconds (a slow
 * network, a failed load), the page comes back and the line finishes; and a page restored from the
 * back-forward cache is always shown.
 */
export function PageTransition() {
  const bar = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const leaving = useRef(false);
  const guard = useRef(0);

  const show = (page: Element | null) => {
    window.clearTimeout(guard.current);
    leaving.current = false;
    if (page) gsap.to(page, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' });
    gsap.to(bar.current, { scaleX: 1, opacity: 0, duration: 0.35 });
  };

  // back from another site, or back and forward through the cache: whatever state it left in, show it
  useEffect(() => {
    const restore = () => show(document.querySelector('.page'));
    const onShow = (e: PageTransitionEvent) => e.persisted && restore();
    window.addEventListener('pageshow', onShow);
    window.addEventListener('popstate', restore);
    return () => {
      window.removeEventListener('pageshow', onShow);
      window.removeEventListener('popstate', restore);
    };
  }, []);

  // on the way down, before the links' own handlers: a prevented click is one next/link leaves alone,
  // while its onClick (closing the menu) still runs
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const path = url.pathname.replace(basePath, '') || '/';
      if (path === pathname || reducedMotion()) return;
      // a section this page has too (Get the app → #get) is scrolled to by the link's own handler
      if (url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
      e.preventDefault();
      const page = document.querySelector('.page');
      const go = () => {
        markNavigated();
        router.push(`${path}${url.hash}`);
        // if the next page hasn't shown up in time, bring this one back rather than leave a blank
        guard.current = window.setTimeout(() => leaving.current && show(document.querySelector('.page')), 4000);
      };
      if (!page) return go();
      leaving.current = true;
      gsap.killTweensOf([page, bar.current]);
      gsap.set(bar.current, { opacity: 1, scaleX: 0 });
      gsap.to(bar.current, { scaleX: 0.7, duration: 0.6, ease: 'power2.out' });
      gsap.to(page, {
        opacity: 0,
        y: -10,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: go,
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname, router]);

  // before the new page paints: start it hidden, then bring it in
  useLayoutEffect(() => {
    if (!leaving.current) return;
    leaving.current = false;
    window.clearTimeout(guard.current);
    const page = document.querySelector('.page');
    // land on the link's section if it named one (the download section, a support answer)
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    gsap.fromTo(page, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap
      .timeline()
      .to(bar.current, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
      .to(bar.current, { opacity: 0, duration: 0.35 }, '+=0.05');
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return <div ref={bar} className={s.bar} aria-hidden />;
}
