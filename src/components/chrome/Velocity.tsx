'use client';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
/** Publishes `--vel` on the document. Rendered once, renders nothing. */
export function Velocity() { useScrollVelocity(); return null; }
