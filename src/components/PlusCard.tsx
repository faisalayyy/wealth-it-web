'use client';

import { useEffect, useRef } from 'react';
import { PlusMark } from './PlusMark';
import s from './PlusCard.module.css';

const REST_X = 9;
const REST_Y = -8;
const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));

/**
 * The Wealthit+ card (the app's PlusCard, Design & Brands' A · Metal card, locked by Faisal 17 Nov):
 * brushed metal in the theme's finish, the gold mark, "PLUS" and "Wealthit+" in foil. It turns in as
 * the page opens, a light crosses it once, then it floats and leans toward the pointer, each frame
 * moving 0.09 of the way, as the app's does. Reduce Motion: it rests, and only fades in. `still`: a
 * small card that only rests (the menu's), as the app's 76-wide one in its menu.
 */
export function PlusCard({ className, meta = 'MEMBER', still = false }: { className?: string; meta?: string; still?: boolean }) {
  const card = useRef<HTMLDivElement>(null);
  const turn = useRef<HTMLDivElement>(null);

  // it turns in when it first comes into view, wherever it is on the page
  useEffect(() => {
    const el = turn.current;
    if (!el || still) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = '';
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still]);

  useEffect(() => {
    const el = card.current;
    if (!el || still || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const area = (el.closest('[data-tilt]') as HTMLElement | null) ?? el;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      raf = 0,
      seen = true;
    const start = performance.now();
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = clamp(((e.clientX - (r.left + r.width / 2)) / r.width) * 24, 18);
      ty = clamp(((e.clientY - (r.top + r.height / 2)) / r.height) * 20, 14);
    };
    const leave = () => {
      tx = 0;
      ty = 0;
    };
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      const rx = REST_X - y;
      const ry = REST_Y + x + Math.sin((t * Math.PI * 2) / 7) * 1.6;
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--fy', `${(Math.sin((t * Math.PI * 2) / 5.2) * 5).toFixed(2)}px`);
      el.style.setProperty('--shx', `${((ry - REST_Y) * 7).toFixed(1)}px`);
      el.style.setProperty('--shy', `${((rx - REST_X) * -5).toFixed(1)}px`);
      if (seen) raf = requestAnimationFrame(frame);
    };
    // only while it can be seen
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (seen) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
    };
  }, [still]);

  return (
    <div ref={turn} className={`${s.turn} ${className ?? ''}`} data-still={still ? '' : undefined}>
      <div ref={card} className={s.card} role="img" aria-label="The Wealthit+ card">
        <span className={s.brush} />
        <span className={s.sheen} />
        {!still && <span className={s.sweep} />}
        <PlusMark className={s.mark} />
        <span className={s.plus}>PLUS</span>
        <span className={s.name}>Wealthit+</span>
        {meta && <span className={s.meta}>{meta}</span>}
      </div>
    </div>
  );
}
