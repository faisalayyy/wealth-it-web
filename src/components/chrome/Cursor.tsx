'use client';

/**
 * The cursor as an instrument, not a blob.
 *
 * There is no large circle trailing the pointer. The default state is a 6px dot that sits
 * almost exactly under the real cursor — near enough to feel like the cursor rather than like
 * something chasing it. What changes is the *mode*, and the mode is declared by the markup:
 * any element can carry `data-cursor="scrub"` and the pointer becomes a time scrubber over it.
 * That keeps the behaviour next to the thing it describes instead of in a registry here.
 *
 * Modes:
 *   default  a dot
 *   link     a ring that opens, and the dot shrinks into its centre
 *   scrub    a vertical rule — the pointer is reading a position in time
 *   drag     a horizontal bar with ends — the pointer can take hold of something
 *   hide     over the real controls, where the OS cursor is better than anything here
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { MQ } from '@/lib/motion';
import styles from './Cursor.module.css';

type Mode = 'default' | 'link' | 'scrub' | 'drag' | 'hide';

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const fine = window.matchMedia(MQ.fine).matches && !window.matchMedia(MQ.reduced).matches;
    setEnabled(fine);
    if (!fine) return;

    const d = dot.current!, r = ring.current!, l = labelRef.current!;
    /* The dot is quick and the ring is slow. That difference is the whole sense of mass. */
    const dx = gsap.quickTo(d, 'x', { duration: 0.09, ease: 'power3.out' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.09, ease: 'power3.out' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.42, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.42, ease: 'power3.out' });
    const lx = gsap.quickTo(l, 'x', { duration: 0.24, ease: 'power3.out' });
    const ly = gsap.quickTo(l, 'y', { duration: 0.24, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY);
      rx(e.clientX); ry(e.clientY);
      lx(e.clientX); ly(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      const next = (el?.dataset.cursor as Mode | undefined) ?? 'default';
      setMode(next);
      setLabel(el?.dataset.cursorLabel ?? '');
    };

    const onDown = () => gsap.to([d, r], { scale: 0.7, duration: 0.14, ease: 'power3.out' });
    const onUp = () => gsap.to([d, r], { scale: 1, duration: 0.3, ease: 'expo.out' });
    const onLeaveWindow = () => setMode('hide');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeaveWindow);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeaveWindow);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className={styles.root} data-mode={mode} aria-hidden="true">
      <div ref={ring} className={styles.ring} />
      <div ref={dot} className={styles.dot} />
      <div ref={labelRef} className={styles.label}>
        <span className="mono">{label}</span>
      </div>
    </div>
  );
}
