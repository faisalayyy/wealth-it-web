import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CHART } from '@/lib/brand';
import { bladeGeometries } from './blades';
import { THREE } from './stage';

/**
 * Small 3D illustrations in the hero keyring's materials, rendered once to transparent images
 * (public/art, by scripts/art.mjs through src/app/_lab/art) for the pieces set inside the homepage's
 * statement (an account, a budget, a bill, a goal, the mark) and the menu's rows (a card being
 * tapped, a chat, a padlock, a phone).
 */
export const ART = ['account', 'budget', 'bill', 'goal', 'mark', 'tap', 'help', 'privacy', 'app'] as const;
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
  // the brand's lime, Blade White, Night and ink (App/brand/README.md); a card's chip in plain metal
  const lime = gloss('#77c41b', { roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.8 });
  const limeEdge = gloss('#5f9e14', { roughness: 0.3, clearcoat: 0.8 });
  const blade = gloss('#f3f3f3', { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 });
  const paper = gloss('#f5f5f3', { roughness: 0.4, clearcoat: 0.6 });
  const night = gloss('#141415', { roughness: 0.3, clearcoat: 0.9 });
  const ink = gloss('#111112', { roughness: 0.42, clearcoat: 0.55 });
  const chip = new THREE.MeshPhysicalMaterial({ color: '#d4d4cf', metalness: 0.8, roughness: 0.25, envMap: env, envMapIntensity: 1.1 });

  const group = new THREE.Group();
  scene.add(group);

  // a coin in the lime: the dot the mark grows from in the app's opening
  const coin = (r = 0.42, h = 0.12) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 72), [limeEdge, lime, lime]);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.78, h * 0.12, 10, 64), limeEdge);
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
      const c = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.24, 0.02, 2, 0.04), chip);
      c.position.set(-0.65, 0.05, 0.045);
      const band = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.08, 0.02, 2, 0.03), gloss(stripe, { roughness: 0.5 }));
      band.position.set(-0.2, -0.4, 0.045);
      g.add(c, band);
      return g;
    };
    const back = card(blade, '#0b0b0c');
    back.rotation.z = 0.28;
    back.position.set(0.35, 0.3, -0.25);
    const front = card(night, '#77c41b');
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
    const most = Math.max(...CHART.map(c => c.share));
    CHART.forEach(slice => {
      const sweep = (slice.share / 100) * Math.PI * 2;
      const s = new THREE.Shape();
      s.absarc(0, 0, R1, a0 - gap / 2, a0 - sweep + gap / 2, true);
      s.absarc(0, 0, R0, a0 - sweep + gap, a0 - gap, false);
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 48 });
      g.translate(0, 0, -0.16);
      const m = new THREE.Mesh(g, gloss(slice.color, { roughness: 0.32 }));
      if (slice.share === most) {
        const mid = a0 - sweep / 2;
        m.position.set(Math.cos(mid) * 0.14, Math.sin(mid) * 0.14, 0.12);
      }
      group.add(m);
      a0 -= sweep;
    });
    group.rotation.set(-0.5, -0.35, 0.1);
  }

  if (name === 'bill') {
    // a calendar page: a Night band, two chrome rings, a grid of days, the due day a lime coin
    const W = 2;
    const H = 2.1;
    const page = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.16, 5, 0.16), paper);
    const band = new THREE.Mesh(new RoundedBoxGeometry(W, 0.55, 0.2, 5, 0.12), night);
    band.position.y = H / 2 - 0.27;
    group.add(page, band);
    for (const x of [-0.5, 0.5]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 12, 40), chrome);
      ring.position.set(x, H / 2 + 0.02, 0.02);
      group.add(ring);
    }
    const dot = new RoundedBoxGeometry(0.22, 0.22, 0.05, 2, 0.06);
    const dim = gloss('#dadad5', { roughness: 0.5, clearcoat: 0.3 });
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
    // coins stacked into steps, rising to a small Night flag
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
    const flag = new THREE.Mesh(new THREE.ExtrudeGeometry(flagShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3 }), night);
    flag.position.set(0.97, -0.95 + 6 * 0.14 + 1.03, -0.22);
    group.add(pole, flag);
    group.rotation.set(0.05, -0.5, 0);
  }

  if (name === 'mark') {
    // the app's light icon (A507): the blades over the paper tile, the mark 0.534 of its width
    const T = 2.3;
    group.add(new THREE.Mesh(new RoundedBoxGeometry(T, T, 0.36, 8, 0.5), paper));
    bladeGeometries(T * 0.534, 0.12, 0.04).forEach((geo, i) => {
      const m = new THREE.Mesh(geo, i === 0 ? lime : night);
      m.position.set(0, 0.03, 0.18);
      group.add(m);
    });
    group.rotation.set(-0.1, -0.45, 0);
  }

  if (name === 'tap') {
    // a card tilted towards a reader, and the contactless waves coming off it
    const card = new THREE.Group();
    card.add(new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.38, 0.07, 4, 0.12), night));
    const c = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.24, 0.02, 2, 0.04), chip);
    c.position.set(-0.65, 0.12, 0.045);
    const band = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.08, 0.02, 2, 0.03), gloss('#77c41b', { roughness: 0.5 }));
    band.position.set(-0.2, -0.4, 0.045);
    card.add(c, band);
    card.rotation.set(0, 0, -0.18);
    group.add(card);
    [0.32, 0.56, 0.8].forEach((r, i) => {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(r, 0.055, 14, 48, Math.PI * 0.62), i === 1 ? lime : chrome);
      arc.rotation.z = -Math.PI * 0.31;
      arc.position.set(1.0, 0.55, 0.2);
      group.add(arc);
    });
    group.rotation.set(-0.12, -0.42, 0);
  }

  if (name === 'help') {
    // a speech bubble, the three dots of someone writing back
    const s = new THREE.Shape();
    const w = 2.1;
    const h = 1.4;
    const r = 0.55;
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(-w / 2 + 0.75, -h / 2);
    s.lineTo(-w / 2 + 0.35, -h / 2 - 0.42);
    s.lineTo(-w / 2 + 1.05, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
    s.lineTo(w / 2, h / 2 - r);
    s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
    s.lineTo(-w / 2 + r, h / 2);
    s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(-w / 2, -h / 2 + r);
    s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 8, curveSegments: 40 });
    geo.translate(0, 0, -0.11);
    group.add(new THREE.Mesh(geo, blade));
    [-0.5, 0, 0.5].forEach((x, i) => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 24), i === 2 ? lime : ink);
      dot.scale.z = 0.6;
      dot.position.set(x, 0, 0.22);
      group.add(dot);
    });
    group.rotation.set(-0.1, -0.45, 0.04);
  }

  if (name === 'privacy') {
    // the keyring's padlock: a lime body, a chrome shackle, an ink keyhole
    const W = 1.5;
    const H = 1.25;
    const D = 0.56;
    const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.22), lime);
    const ringR = 0.46;
    const legs = 0.34;
    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(new THREE.LineCurve3(new THREE.Vector3(-ringR, H / 2 - 0.08, 0), new THREE.Vector3(-ringR, H / 2 + legs, 0)));
    path.add(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-ringR, H / 2 + legs, 0),
        new THREE.Vector3(-ringR, H / 2 + legs + ringR * 1.33, 0),
        new THREE.Vector3(ringR, H / 2 + legs + ringR * 1.33, 0),
        new THREE.Vector3(ringR, H / 2 + legs, 0),
      ),
    );
    path.add(new THREE.LineCurve3(new THREE.Vector3(ringR, H / 2 + legs, 0), new THREE.Vector3(ringR, H / 2 - 0.08, 0)));
    const shackle = new THREE.Mesh(new THREE.TubeGeometry(path, 64, 0.12, 18, false), chrome);
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32), ink);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, 0.07, D / 2 + 0.005);
    const slot = new THREE.Mesh(new RoundedBoxGeometry(0.09, 0.28, 0.04, 2, 0.02), ink);
    slot.position.set(0, -0.1, D / 2 + 0.005);
    group.add(body, shackle, hole, slot);
    group.rotation.set(-0.08, -0.5, 0.06);
  }

  if (name === 'app') {
    // a phone with the mark on its screen
    const W = 1.3;
    const H = 2.6;
    const shell = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.16, 6, 0.2), gloss('#121313', { roughness: 0.25, clearcoat: 1 }));
    const screen = new THREE.Mesh(new RoundedBoxGeometry(W - 0.12, H - 0.12, 0.02, 4, 0.15), gloss('#0b0b0c', { roughness: 0.4, clearcoat: 0.5 }));
    screen.position.z = 0.08;
    const island = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.1, 0.02, 2, 0.05), gloss('#050505'));
    island.position.set(0, H / 2 - 0.2, 0.095);
    group.add(shell, screen, island);
    // the app's opening at rest: the blades in the middle of the screen
    bladeGeometries(0.62, 0.03, 0.012).forEach((geo, i) => {
      const m = new THREE.Mesh(geo, i === 0 ? lime : blade);
      m.position.set(0, 0.12, 0.09);
      group.add(m);
    });
    group.rotation.set(-0.08, -0.5, 0.08);
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
