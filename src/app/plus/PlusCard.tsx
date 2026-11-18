'use client';

import { useEffect, useRef } from 'react';
import { PlusMark } from '@/components/PlusMark';
import s from './card.module.css';

const REST_X = 9;
const REST_Y = -8;
const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));

/**
 * The Wealthit+ card (the app's PlusCard, Design & Brands' A · Metal card, locked by Faisal 17 Nov):
 * brushed metal in the theme's finish, the gold mark, "PLUS" and "Wealthit+" in foil. It turns in as
 * the page opens, a light crosses it once, then it floats and leans toward the pointer, each frame
 * moving 0.09 of the way, as the app's does. Reduce Motion: it rests, and only fades in.
 */
export function PlusCard({ className, meta = 'MEMBER' }: { className?: string; meta?: string }) {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = card.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  }, []);

  return (
    <div className={`${s.turn} ${className ?? ''}`}>
      <div ref={card} className={s.card} role="img" aria-label="The Wealthit+ card">
        <span className={s.brush} />
        <span className={s.sheen} />
        <span className={s.sweep} />
        <PlusMark className={s.mark} />
        <span className={s.plus}>PLUS</span>
        <span className={s.name}>Wealthit+</span>
        {meta && <span className={s.meta}>{meta}</span>}
      </div>
    </div>
  );
}
