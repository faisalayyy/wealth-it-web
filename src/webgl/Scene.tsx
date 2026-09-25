'use client';

import { Canvas } from '@react-three/fiber';
import { LedgerField } from './LedgerField';

export function Scene({ active }: { active: boolean }) {
  return (
    <Canvas
      /* One unit is one CSS pixel: R3F sizes an orthographic frustum to the canvas, so the
         DOM above and the bars below share a coordinate system. */
      orthographic
      camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: false }}
      style={{ pointerEvents: 'none' }}
    >
      <LedgerField />
    </Canvas>
  );
}
