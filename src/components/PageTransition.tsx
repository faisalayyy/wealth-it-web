'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, reducedMotion, ScrollTrigger } from '@/animation/gsap';
import { basePath } from '@/lib/site';
import s from './PageTransition.module.css';

/**
 * A quiet change of page. A click on a link to another page fades the page out with a small lift
 * while a thin line runs along the top of the window; the route changes behind it, and the new page
 * eases up into place as the line completes. The header stays put throughout. Modified clicks, new
 * tabs, links within the page and reduced motion go straight through.
 */
export function PageTransition() {
  const bar = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const leaving = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const path = url.pathname.replace(basePath, '') || '/';
      if (path === pathname || reducedMotion()) return;
      e.preventDefault();
      leaving.current = true;
      const page = document.querySelector('.page');
      gsap.killTweensOf([page, bar.current]);
      gsap.set(bar.current, { opacity: 1, scaleX: 0 });
      gsap.to(bar.current, { scaleX: 0.7, duration: 0.6, ease: 'power2.out' });
      gsap.to(page, {
        opacity: 0,
        y: -10,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => router.push(`${path}${url.hash}`),
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname, router]);

  // before the new page paints: start it hidden, then bring it in
  useLayoutEffect(() => {
    if (!leaving.current) return;
    leaving.current = false;
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
