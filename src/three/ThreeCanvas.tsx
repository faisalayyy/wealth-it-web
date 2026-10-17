'use client';

import { useEffect, useRef } from 'react';
import { reducedMotion } from '@/animation/gsap';

/**
 * A canvas that loads Three.js (and its scene) only when it is about to be seen, and only once the
 * page has loaded and the browser is idle, so the first paint and the first taps never wait for
 * WebGL. `scene` names a module in src/three.
 */
const whenIdle = (fn: () => void) => {
  const go = () => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 300));
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
};
const SCENES = {
  slabs: () => import('./slabs').then(m => m.slabs),
  keyring: () => import('./keyring').then(m => m.keyring),
};

export function ThreeCanvas({ scene, className, onReady }: { scene: keyof typeof SCENES; className?: string; onReady?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const start = async () => {
      const [{ mount }, build] = await Promise.all([import('./stage'), SCENES[scene]()]);
      if (cancelled) return;
      try {
        dispose = mount(canvas, build, { still: reducedMotion() });
        onReady?.();
      } catch {
        /* no WebGL: the ground colour behind the canvas stands in */
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          whenIdle(() => void start());
        }
      },
      { rootMargin: '50% 0px' },
    );
    io.observe(canvas);
    return () => {
      cancelled = true;
      io.disconnect();
      dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
