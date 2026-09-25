'use client';

/**
 * The field itself: one instanced mesh, one material, ~470 transactions.
 *
 * The camera is orthographic and sized so that one world unit is one CSS pixel, which means
 * the DOM and the canvas share a coordinate system. That is what allows a heading in HTML and
 * a bar in WebGL to be placed against each other precisely instead of approximately.
 */

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LEDGER, SPAN, dateAt } from '@/lib/ledger';
import { vert, frag } from './shaders';
import { useFieldState } from './state';

const COLOR = {
  in: new THREE.Color('#5BC98C'),
  out: new THREE.Color('#E2664F'),
  moved: new THREE.Color('#5E6864'),
  acc: new THREE.Color('#C8F24E'),
};

export function LedgerField() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const state = useFieldState();

  /* Per-instance attributes, built once. Nothing here changes after mount — the animation is
     entirely a function of three uniforms, which is why the frame cost is flat. */
  const { geometry, count } = useMemo(() => {
    const maxAmount = Math.max(...LEDGER.map(t => t.amount));
    const n = LEDGER.length;
    const g = new THREE.InstancedBufferGeometry();
    const base = new THREE.PlaneGeometry(1, 1);
    g.index = base.index;
    g.attributes.position = base.attributes.position!;
    g.attributes.uv = base.attributes.uv!;
    g.instanceCount = n;

    const aT = new Float32Array(n);
    const aDom = new Float32Array(n);
    const aMag = new Float32Array(n);
    const aSign = new Float32Array(n);
    const aSeed = new Float32Array(n);
    const aHero = new Float32Array(n * 2);

    LEDGER.forEach((tx, i) => {
      aT[i] = tx.t / -SPAN.past;                       // −1 … 0
      const d = dateAt(tx.t);
      aDom[i] = (d.getUTCDate() - 1) / 30;             //  0 … 1
      /* Logarithmic, because the salary is three hundred times a coffee and on a linear scale
         a year of somebody's actual life is a flat line with two spikes in it. The log keeps
         the salary dominant and still gives a 40-dirham taxi a bar you can see. */
      aMag[i] = Math.log1p(tx.amount / 40) / Math.log1p(maxAmount / 40);
      aSign[i] = tx.kind === 'in' ? 1 : tx.kind === 'out' ? -1 : 0;
      const seed = ((i * 2654435761) % 1013) / 1013;
      aSeed[i] = seed;
      /* The collapsed state: packed into the block the headline figure occupies. */
      aHero[i * 2] = (seed - 0.5) * 520;
      aHero[i * 2 + 1] = (((i * 40503) % 997) / 997 - 0.5) * 150;
    });

    g.setAttribute('aT', new THREE.InstancedBufferAttribute(aT, 1));
    g.setAttribute('aDom', new THREE.InstancedBufferAttribute(aDom, 1));
    g.setAttribute('aMag', new THREE.InstancedBufferAttribute(aMag, 1));
    g.setAttribute('aSign', new THREE.InstancedBufferAttribute(aSign, 1));
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
    g.setAttribute('aHero', new THREE.InstancedBufferAttribute(aHero, 2));
    base.dispose();
    return { geometry: g, count: n };
  }, []);

  const uniforms = useMemo(() => ({
    uPhase: { value: 0 },
    uReveal: { value: 0 },
    uCursor: { value: 0.2 },
    uView: { value: new THREE.Vector2(size.width, size.height) },
    uTime: { value: 0 },
    uVel: { value: 0 },
    uFade: { value: 1 },
    uIn: { value: COLOR.in },
    uOut: { value: COLOR.out },
    uMoved: { value: COLOR.moved },
    uAcc: { value: COLOR.acc },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const s = state.current;
    const k = 1 - Math.exp(-9 * Math.min(dt, 0.05));
    u.uPhase!.value += (s.phase - u.uPhase!.value) * k;
    u.uReveal!.value += (s.reveal - u.uReveal!.value) * (1 - Math.exp(-3.2 * Math.min(dt, 0.05)));
    u.uCursor!.value += (s.cursor - u.uCursor!.value) * (1 - Math.exp(-11 * Math.min(dt, 0.05)));
    u.uFade!.value += (s.fade - u.uFade!.value) * k;
    u.uVel!.value = s.velocity;
    u.uTime!.value += dt;
    u.uView!.value.set(size.width, size.height);
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  );
}
