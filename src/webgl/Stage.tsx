'use client';

/**
 * The canvas, and the rules it has to live by.
 *
 * WebGL here is an enhancement over a page that is already complete without it. It is code-split
 * and never touches the first paint; it stops rendering the moment it is off screen or the tab
 * is hidden; its pixel ratio is capped because a field of flat bars gains nothing from a
 * three-times buffer and loses a great deal of battery; and if the device has no WebGL, or the
 * reader has asked for less movement, it simply never mounts. Nothing in the document depends
 * on it.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FieldCtx, initialFieldState, type FieldState } from './state';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Stage.module.css';

const Scene = dynamic(() => import('./Scene').then(m => m.Scene), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch { return false; }
}

export function Stage({ children }: { children: ReactNode }) {
  const state = useRef<FieldState>({ ...initialFieldState });
  const holder = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setMount(false); return; }
    if (!hasWebGL()) return;
    /* Let the page paint, settle and become interactive before a shader is compiled. */
    const ric = window.requestIdleCallback as undefined | ((cb: () => void, o?: { timeout: number }) => number);
    const idle: number = ric
      ? ric(() => setMount(true), { timeout: 1200 })
      : window.setTimeout(() => setMount(true), 400);
    return () => {
      if (ric) window.cancelIdleCallback?.(idle);
      else clearTimeout(idle);
    };
  }, [reduced]);

  /* Off screen or backgrounded: stop drawing entirely. */
  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { rootMargin: '10%' });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  return (
    <FieldCtx.Provider value={state}>
      <div ref={holder} className={styles.stage} aria-hidden="true">
        {mount && <Scene active={visible} />}
      </div>
      {children}
    </FieldCtx.Provider>
  );
}
