'use client';

import { useEffect, useRef } from 'react';

/** Temporary: renders the statement's illustrations (src/three/art.ts) for scripts/art.mjs. */
export default function ArtLab() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (async () => {
      const [{ THREE }, { RoomEnvironment }, { ART, buildArt }] = await Promise.all([
        import('@/three/stage'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
        import('@/three/art'),
      ]);
      const canvas = ref.current!;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(1);
      renderer.setSize(900, 900, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.setClearColor(0x000000, 0);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const out: Record<string, string> = {};
      for (const name of ART) {
        const { scene, camera } = buildArt(name, env);
        renderer.render(scene, camera);
        out[name] = canvas.toDataURL('image/png');
      }
      (window as unknown as { __art: unknown }).__art = out;
    })();
  }, []);
  return <canvas ref={ref} width={900} height={900} style={{ width: 450, height: 450, background: '#ccc' }} />;
}
