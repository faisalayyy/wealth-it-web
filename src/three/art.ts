import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { BRAND_MARK, CHART } from '@/lib/brand';
import { THREE } from './stage';

/**
 * Small 3D illustrations in the hero keyring's materials, rendered once to transparent images
 * (public/art, by scripts/art.mjs through src/app/_lab/art) for the pieces set inside the homepage's
 * statement: an account, a budget, a bill, a goal, and the mark.
 */
export const ART = ['account', 'budget', 'bill', 'goal', 'mark'] as const;
export type ArtName = (typeof ART)[number];

export function buildArt(name: ArtName, env: THREE.Texture) {
  const scene = new THREE.Scene();
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(26, 1, 0.5, 100);
  camera.position.set(0, 0.6, 9);
  camera.lookAt(0, 0, 0);

  const gloss = (color: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.14, envMap: env, envMapIntensity: 0.7, ...extra });
  const chrome = new THREE.MeshPhysicalMaterial({ color: '#f4f5f1', metalness: 1, roughness: 0.1, envMap: env, envMapIntensity: 1.4 });
  const gold = new THREE.MeshPhysicalMaterial({ color: '#f0b94a', metalness: 0.35, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.12, envMap: env, envMapIntensity: 0.95 });
  const goldEdge = new THREE.MeshPhysicalMaterial({ color: '#d9a23a', metalness: 0.5, roughness: 0.3, envMap: env, envMapIntensity: 1 });
  const ivory = gloss('#f7f6f1', { roughness: 0.4, clearcoat: 0.6 });
  const emerald = gloss('#0d7443');
  const forest = gloss('#0e3b30');
  const mint = gloss('#4cc38a', { metalness: 0.3 });

  const group = new THREE.Group();
  scene.add(group);

  const coin = (r = 0.42, h = 0.12) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 72), [goldEdge, gold, gold]);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.78, h * 0.12, 10, 64), goldEdge);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = h / 2;
    const g = new THREE.Group();
    g.add(m, ring);
    return g;
  };

  if (name === 'account') {
    // two cards fanned, a coin in front
    const card = (mat: THREE.Material, stripe: string) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.38, 0.07, 4, 0.12), mat));
      const chip = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.24, 0.02, 2, 0.04), gold);
      chip.position.set(-0.65, 0.05, 0.045);
      const band = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.08, 0.02, 2, 0.03), gloss(stripe, { roughness: 0.5 }));
      band.position.set(-0.2, -0.4, 0.045);
      g.add(chip, band);
      return g;
    };
    const back = card(ivory, '#0e3b30');
    back.rotation.z = 0.28;
    back.position.set(0.35, 0.3, -0.25);
    const front = card(emerald, '#4cc38a');
    front.rotation.z = -0.12;
    const c = coin(0.5, 0.14);
    c.rotation.set(Math.PI / 2 - 0.25, 0, 0.2);
    c.position.set(0.95, -0.55, 0.5);
    group.add(back, front, c);
    group.rotation.set(-0.15, -0.45, 0);
  }

  if (name === 'budget') {
    const R1 = 1.2;
    const R0 = 0.62;
    const gap = 0.05;
    let a0 = Math.PI / 2;
    CHART.forEach((slice, i) => {
      const sweep = (slice.share / 100) * Math.PI * 2;
      const s = new THREE.Shape();
      s.absarc(0, 0, R1, a0 - gap / 2, a0 - sweep + gap / 2, true);
      s.absarc(0, 0, R0, a0 - sweep + gap, a0 - gap, false);
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 48 });
      g.translate(0, 0, -0.16);
      const m = new THREE.Mesh(g, gloss(slice.color, { roughness: 0.32 }));
      if (i === 0) {
        const mid = a0 - sweep / 2;
        m.position.set(Math.cos(mid) * 0.14, Math.sin(mid) * 0.14, 0.12);
      }
      group.add(m);
      a0 -= sweep;
    });
    group.rotation.set(-0.5, -0.35, 0.1);
  }

  if (name === 'bill') {
    // a calendar page: a Forest band, two chrome rings, a grid of days, the due day a gold coin
    const W = 2;
    const H = 2.1;
    const page = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.16, 5, 0.16), ivory);
    const band = new THREE.Mesh(new RoundedBoxGeometry(W, 0.55, 0.2, 5, 0.12), forest);
    band.position.y = H / 2 - 0.27;
    group.add(page, band);
    for (const x of [-0.5, 0.5]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 12, 40), chrome);
      ring.position.set(x, H / 2 + 0.02, 0.02);
      group.add(ring);
    }
    const dot = new RoundedBoxGeometry(0.22, 0.22, 0.05, 2, 0.06);
    const dim = gloss('#dcdbd3', { roughness: 0.5, clearcoat: 0.3 });
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 5; c++) {
        if (r === 1 && c === 3) continue;
        const d = new THREE.Mesh(dot, dim);
        d.position.set(-0.72 + c * 0.36, 0.22 - r * 0.42, 0.09);
        group.add(d);
      }
    const due = coin(0.2, 0.08);
    due.rotation.x = Math.PI / 2;
    due.position.set(-0.72 + 3 * 0.36, 0.22 - 0.42, 0.14);
    group.add(due);
    group.rotation.set(-0.12, -0.42, 0.05);
  }

  if (name === 'goal') {
    // coins stacked into steps, rising to a small Mint flag
    const heights = [2, 4, 6];
    heights.forEach((n, i) => {
      for (let k = 0; k < n; k++) {
        const c = coin(0.42, 0.13);
        c.position.set(-0.95 + i * 0.95, -0.95 + k * 0.14, i * -0.1);
        c.rotation.y = k * 0.7;
        group.add(c);
      }
    });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 12), chrome);
    pole.position.set(0.95, -0.95 + 6 * 0.14 + 0.5, -0.2);
    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0.55, -0.16);
    flagShape.lineTo(0, -0.34);
    flagShape.closePath();
    const flag = new THREE.Mesh(new THREE.ExtrudeGeometry(flagShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3 }), mint);
    flag.position.set(0.97, -0.95 + 6 * 0.14 + 1.03, -0.22);
    group.add(pole, flag);
    group.rotation.set(0.05, -0.5, 0);
  }

  if (name === 'mark') {
    const svg = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_MARK.viewBox}">${BRAND_MARK.paths.map(d => `<path d="${d}"/>`).join('')}</svg>`);
    const shapes = svg.paths.flatMap(p => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 9, bevelEnabled: true, bevelThickness: 3, bevelSize: 2, bevelSegments: 8, curveSegments: 64 });
    const k = 2.6 / 76;
    geo.translate(-50, -50, 0);
    geo.scale(k, -k, -k);
    geo.translate(0, 0, (9 + 3) * k);
    const leaves = new THREE.Mesh(geo, gloss('#0d7443', { metalness: 0.25 }));
    const c = coin(BRAND_MARK.coin.r * k, 10 * k);
    c.rotation.x = Math.PI / 2;
    c.position.set((BRAND_MARK.coin.cx - 50) * k, -(BRAND_MARK.coin.cy - 50) * k, 6 * k);
    group.add(leaves, c);
    group.rotation.set(-0.1, -0.45, 0);
  }

  scene.add(new THREE.HemisphereLight('#ffffff', '#c9cbc4', 1.2));
  const key = new THREE.DirectionalLight('#ffffff', 2.4);
  key.position.set(3, 5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#fff4dc', 0.9);
  rim.position.set(-5, -2, 4);
  scene.add(rim);

  // fit: centre the group and frame it
  const box = new THREE.Box3().setFromObject(group);
  const centre = box.getCenter(new THREE.Vector3());
  group.position.sub(centre);
  const size = box.getSize(new THREE.Vector3()).length();
  camera.position.set(0, size * 0.18, size * 2.15);
  camera.lookAt(0, 0, 0);
  return { scene, camera };
}
