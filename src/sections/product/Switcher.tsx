'use client';

import { useEffect, useState } from 'react';
import { scrollToTarget, useLenis } from '@/animation/SmoothScroll';
import s from './Switcher.module.css';

/**
 * The reference's floating section switcher: a pill at the bottom of the screen while a list of
 * sections is in view, naming each one and lighting the one you are reading; a click scrolls there.
 */
export function Switcher({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const lenis = useLenis();
  const [active, setActive] = useState(items[0]?.id);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const els = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach(e => io.observe(e));
    const on = () => {
      const first = els[0]?.getBoundingClientRect();
      const last = els[els.length - 1]?.getBoundingClientRect();
      setShown(!!first && !!last && first.top < innerHeight * 0.6 && last.bottom > innerHeight * 0.4);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', on);
    };
  }, [items]);

  return (
    <nav className={s.bar} data-shown={shown ? '' : undefined} aria-label={label} inert={!shown}>
      {items.map(i => (
        <a
          key={i.id}
          href={`#${i.id}`}
          className={s.item}
          aria-current={active === i.id ? 'true' : undefined}
          onClick={e => {
            const el = document.getElementById(i.id);
            if (!el) return;
            e.preventDefault();
            scrollToTarget(lenis, el, 1.2);
          }}
        >
          {i.label}
        </a>
      ))}
    </nav>
  );
}
