import { THREE, type Scene } from './stage';

/**
 * The hero's discs: lime coins travelling round a ring. They pile up at one spot, arriving at the
 * back of the pile, then peel off its front one after another and go round again — for a moment
 * every loop they close into a full ring, and for a moment they all sit in one stack. The ring
 * itself turns slowly, carrying the pile round with it, and tumbles: left to right, and over.
 *
 * - Every coin follows the same path round the ring, a fixed beat behind the one ahead, crawling
 *   through the pile and running everywhere else. Each goes round exactly once a loop, so the last
 *   frame is the first. The ring's spin and tumble are steady turns, each a whole number of
 *   loops long, so together they come back round too — every 192 seconds — with no seam.
 * - Each coin stands square to the ring, so its plane passes through the ring's axis, and no coin
 *   reaches that axis: two coins can only meet at their inner edges, and in the pile, where they
 *   are closest, they are kept more than a coin's thickness apart.
 */

const LOOP = 8;
/** the whole ring turns once every four loops, the same way the coins run */
const TURN = LOOP * 4;
/** and tumbles: left to right once every six loops, and over once every eight */
const ACROSS = LOOP * 6;
const OVER = LOOP * 8;
const N = 16;
const R = 1;
const THICK = 0.032;
/** the ring's radius, to the coins' centres */
const RING = 2.5;
/** how far behind the coin ahead each one runs, in loops */
const STAGGER = 0.5 / (N - 1);
/** the part of the loop a coin spends crawling through the pile, and the ease in and out of it */
const DWELL = 0.48;
const EASE = 0.08;
/** crawling speed, as a share of running speed */
const SLOW = 0.09;

const TAU = Math.PI * 2;
const wrap = (x: number) => x - Math.floor(x);
const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/** angle round the ring by loop position, from the speed: slow through the pile, fast elsewhere */
const STEPS = 2048;
const table = new Float32Array(STEPS + 1);
for (let k = 1; k <= STEPS; k++) {
  const x = (k - 0.5) / STEPS;
  const running = smooth(DWELL, DWELL + EASE, x) * (1 - smooth(1 - EASE, 1, x));
  table[k] = table[k - 1] + (SLOW + (1 - SLOW) * running) / STEPS;
}
for (let k = 1; k <= STEPS; k++) table[k] *= TAU / table[STEPS];
const travel = (x: number) => {
  const f = wrap(x) * STEPS;
  const k = Math.min(STEPS - 1, Math.floor(f));
  return Math.floor(x) * TAU + table[k] + (table[k + 1] - table[k]) * (f - k);
};
/** the middle of the pile, at the moment all the coins are in it */
const LEAVE = DWELL + EASE / 2;
const PILE = (travel(LEAVE) + travel(LEAVE - (N - 1) * STAGGER)) / 2;

/**
 * The ring is tipped toward the viewer, seen from about forty degrees above, so it reads as a
 * circle: the coins at its sides turn their faces to the viewer and the ones at its front and back
 * stand edge-on. The pile sits at its right end; coins leave it toward the viewer and come back
 * round the far side.
 */
const AXIS = new THREE.Vector3(-0.2, 1, 0.85).normalize();
const E1 = new THREE.Vector3(1, 0, 0).addScaledVector(AXIS, -AXIS.x).normalize();
const E2 = new THREE.Vector3().crossVectors(E1, AXIS);
const Y = new THREE.Vector3(0, 1, 0);

export type DiscPose = { position: THREE.Vector3; normal: THREE.Vector3 }[];

/** Where every coin is at loop position `u` (0..1), with the ring turned by `turn`, in its own space. */
export function pose(u: number, out: DiscPose = Array.from({ length: N }, () => ({ position: new THREE.Vector3(), normal: new THREE.Vector3() })), turn = 0) {
  for (let i = 0; i < N; i++) {
    const a = travel(u - i * STAGGER) - PILE + turn;
    const c = Math.cos(a);
    const s = Math.sin(a);
    out[i].position.copy(E1).multiplyScalar(c * RING).addScaledVector(E2, s * RING);
    out[i].normal.copy(E2).multiplyScalar(c).addScaledVector(E1, -s);
  }
  return out;
}

export function discs({ env }: { renderer: THREE.WebGLRenderer; env: THREE.Texture }): Scene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 1, 100);
  camera.position.set(0, 0, 24);

  // opaque, so the coins sort by depth per pixel and an edge never flickers through a face
  const face = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#b9e636'),
    roughness: 0.4,
    metalness: 0,
    // a light coat: as the ring tumbles, a coin seen at a steep angle mirrors more of the room,
    // and a full coat turns it olive
    clearcoat: 0.45,
    clearcoatRoughness: 0.25,
    sheen: 0.2,
    sheenColor: new THREE.Color('#f4ffd2'),
    envMap: env,
    envMapIntensity: 0.35,
  });
  const rim = new THREE.MeshStandardMaterial({ color: '#fbffe8', roughness: 0.15, metalness: 0.1, emissive: '#f4ffd0', emissiveIntensity: 0.35 });

  const geo = new THREE.CylinderGeometry(R, R, THICK, 160, 1, false);
  const group = new THREE.Group();
  scene.add(group);
  const tumble = new THREE.Group();
  group.add(tumble);
  const meshes = Array.from({ length: N }, () => {
    const mesh = new THREE.Mesh(geo, [rim, face, face]);
    tumble.add(mesh);
    return mesh;
  });

  // lit from the sky and the lime below it, so a coin turned from the key light stays lime, not olive
  scene.add(new THREE.HemisphereLight('#fbffe9', '#c2e85a', 1.25));
  const key = new THREE.DirectionalLight('#ffffff', 2.2);
  key.position.set(4, 6, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight('#e9ffb0', 1.1);
  fill.position.set(-6, -3, 4);
  scene.add(fill);
  // tumbling, the ring shows the viewer its coins' undersides too: light those from below
  const under = new THREE.DirectionalLight('#f1ffc4', 1.4);
  under.position.set(1, -7, 5);
  scene.add(under);
  // a near light, so each face shades across itself instead of reading as one flat fill
  const glow = new THREE.PointLight('#f6ffd8', 60, 0, 1.6);
  scene.add(glow);

  const state = pose(0);
  // in development, `window.__discs = 0.5` pins the loop at a point, for looking at one frame
  const pin = process.env.NODE_ENV === 'production' ? null : (window as unknown as { __discs?: number; __discsPose?: typeof pose });
  if (pin) pin.__discsPose = pose;

  return {
    scene,
    camera,
    resize: (w, h) => {
      const aspect = w / h;
      const wide = aspect > 1;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * aspect;
      // the ring sits in the top right on a wide screen, and between the words on a tall one
      group.position.set(halfW * (wide ? 0.16 : 0), halfH * (wide ? 0.3 : 0.08), 0);
      group.scale.setScalar(wide ? halfW * 0.218 : halfW * 0.328);
      glow.position.set(-halfW * 0.2, halfH * 0.9, 9);
    },
    update: (t, _dt, p) => {
      // the page opens on the coins gathered in one stack, just before the first peels away
      const u = pin?.__discs ?? wrap(t / LOOP + LEAVE - 0.03);
      pose(u, state, TAU * wrap(t / TURN));
      meshes.forEach((mesh, i) => {
        mesh.position.copy(state[i].position);
        mesh.quaternion.setFromUnitVectors(Y, state[i].normal);
      });
      tumble.rotation.set(TAU * wrap(t / OVER), TAU * wrap(t / ACROSS), 0);
      group.rotation.y = p.x * 0.1;
      group.rotation.x = p.y * 0.06;
    },
  };
}
