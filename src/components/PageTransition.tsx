'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap, reducedMotion, ScrollTrigger } from '@/animation/gsap';
import { basePath } from '@/lib/site';
import s from './PageTransition.module.css';

/**
 * Pages never simply swap. A click on any link to another page raises a lime panel from the
 * bottom with a progress line along its edge; the route changes behind it, and it lifts away.
 * Modified clicks, new tabs, in-page anchors and reduced motion go straight through.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const covered = useRef(false);

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
      const panel = ref.current!;
      covered.current = true;
      gsap.killTweensOf([panel, bar.current]);
      gsap.set(panel, { display: 'block', yPercent: 100 });
      gsap.set(bar.current, { scaleX: 0 });
      gsap
        .timeline()
        .to(panel, { yPercent: 0, duration: 0.65, ease: 'power4.inOut' })
        .to(bar.current, { scaleX: 0.7, duration: 0.5, ease: 'power2.out' }, 0.2)
        .add(() => router.push(`${path}${url.hash}`));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname, router]);

  useEffect(() => {
    if (!covered.current) return;
    covered.current = false;
    const panel = ref.current!;
    // land on the link's section if it named one (the download section, a support answer)
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    gsap
      .timeline()
      .to(bar.current, { scaleX: 1, duration: 0.25, ease: 'power2.out' })
      .to(panel, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.05')
      .set(panel, { display: 'none' });
  }, [pathname]);

  return (
    <div ref={ref} className={s.panel} aria-hidden>
      <div ref={bar} className={s.progress} />
    </div>
  );
}
