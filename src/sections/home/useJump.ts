'use client';

import type { MouseEvent } from 'react';
import { scrollToTarget, useLenis } from '@/animation/SmoothScroll';

/** A click handler that scrolls to a section of this page instead of following the link. */
export function useJump() {
  const lenis = useLenis();
  return (id: string) => (e: MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(lenis, el, 1.4);
  };
}
