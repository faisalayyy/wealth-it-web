'use client';
import { useEffect, useState } from 'react';
import { MQ } from '@/lib/motion';

/**
 * Read once, then track. Starts `false` so the server and the first client paint agree; the
 * real value lands in an effect, before any timeline is allowed to play.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MQ.reduced);
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}
