'use client';

/**
 * The bridge between scroll and the scene.
 *
 * Deliberately a mutable ref rather than React state: these four numbers change on every
 * frame, and routing them through `setState` would re-render the page sixty times a second to
 * move a uniform. GSAP writes into it, the render loop reads out of it, and React is not
 * involved in either direction.
 */
import { createContext, useContext, type MutableRefObject } from 'react';

export interface FieldState {
  /** 0 collapsed · 1 flowed along time · 2 folded onto one month. */
  phase: number;
  /** 0 → 1, the opening. */
  reveal: number;
  /** −1 … 0, the reader's position in the recorded year. */
  cursor: number;
  /** Whole-field opacity, so the page can move past it. */
  fade: number;
  velocity: number;
}

export const initialFieldState: FieldState = { phase: 0, reveal: 0, cursor: 0.2, fade: 1, velocity: 0 };

export const FieldCtx = createContext<MutableRefObject<FieldState> | null>(null);

export function useFieldState(): MutableRefObject<FieldState> {
  const ctx = useContext(FieldCtx);
  if (!ctx) throw new Error('useFieldState must be used inside <Stage>');
  return ctx;
}
