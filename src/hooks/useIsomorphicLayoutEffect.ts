import { useEffect, useLayoutEffect } from 'react';
/** `useLayoutEffect` warns during SSR. Every GSAP setup in this project uses this instead. */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
