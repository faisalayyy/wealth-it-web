import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { THREE, type Scene } from './stage';

/**
 * The About page's ground — the reference's company video, rebuilt live in the app's colours.
 * Three tall rounded slabs stand side by side like the flutes of one column, and four times a loop
 * they flip end over end about their own centres in a wave from left to right, then settle flush
 * for a beat. The rounds alternate quick and slow. Each flip is half a turn, so after four every
 * slab is back where it started: a loop with no seam (the video's 9 seconds, played 1.5× slower). Each face shades from a yellow lime
 * at one end to a green lime at the other, so a flip shows as the gradient changing ends.
 *
 * Timings and proportions are the video's own, measured frame by frame (each slab's top and bottom
 * edge every 0.1s): the moments each slab stands edge-on, and how long each flip takes. A slab is
 * 6.4 times as tall as it is wide (the video's are about twice as deep as they are wide; these are
 * as deep as they are wide). Framing follows the video's portrait
 * frame, which the slabs fill 47.5% of across and two-thirds of down, cropped like
 * `object-fit: cover` — on a wide screen they run past the top and bottom.
 */

const LOOP = 9;
/** played this many times slower than the video: its 9 seconds take 13.5 */
const SLOW = 1.5;
/** per round: when each slab (left, middle, right) starts its half-turn, and how long it takes */
const ROUNDS = [
  { start: [0.2, 0.35, 0.5], turn: 1.3 },
  { start: [2.3, 2.43, 2.55], turn: 1.7 },
  { start: [4.78, 4.93, 5.08], turn: 1.25 },
  { start: [6.76, 6.92, 7.06], turn: 1.72 },
];

const W = 1;
const H = 6.4;
// thinner than the video's (about twice the width), at the owner's request
const D = 1;
// flush, at the owner's request: each slab turns about its own horizontal axis and never leaves its
// own width, so neighbours cannot cut into one another
const GAP = 0;
const GROUP_W = W * 3 + GAP * 2;
const FRAME_W = GROUP_W / 0.475;
const FRAME_H = FRAME_W * 1.5;
/** drawn at a third of the video's size, at the owner's request */
const ZOOM = 0.33;

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function slabs({ renderer, env }: { renderer: THREE.WebGLRenderer; env: THREE.Texture }): Scene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 1, 200);

  // squarer than the video's, at the owner's request: a slight round on each edge, not a capsule
  const geo = new RoundedBoxGeometry(W, H, D, 6, 0.16);
  // a two-tone face: yellow lime at one end, green lime at the other
  const pos = geo.getAttribute('position');
  const colors = new Float32Array(pos.count * 3);
  const top = new THREE.Color('#1c9c60');
  const bottom = new THREE.Color('#0b5e37');
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const k = (pos.getY(i) + H / 2) / H;
    c.copy(bottom).lerp(top, k * k * (3 - 2 * k));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.3,
    sheen: 0.25,
    sheenColor: new THREE.Color('#c9f2dc'),
    envMap: env,
    envMapIntensity: 0.45,
  });

  const group = new THREE.Group();
  scene.add(group);
  const slabsList = [-1, 0, 1].map(k => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.x = k * (W + GAP);
    mesh.castShadow = true;
    group.add(mesh);
    return mesh;
  });

  // a wall just behind the slabs that shows nothing but their shadows, so the shadows move and
  // change shape with every flip while the page's own lime shows through everywhere else
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ color: '#02130d', opacity: 0.32 }));
  wall.position.z = -D / 2 - 1.1;
  wall.receiveShadow = true;
  scene.add(wall);

  scene.add(new THREE.HemisphereLight('#f3fff8', '#0d7443', 1.15));
  // the key light, high at the left, throws the shadows down and to the right on the wall
  const key = new THREE.DirectionalLight('#ffffff', 1.9);
  key.position.set(-3.5, 5, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 20;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.5, far: 30 });
  scene.add(key);
  const rim = new THREE.DirectionalLight('#ffeec8', 0.9);
  rim.position.set(-6, -4, 5);
  scene.add(rim);

  // in development, `window.__slabs = 3.5` pins the loop at that second, for looking at one frame
  const pin = process.env.NODE_ENV === 'production' ? null : (window as unknown as { __slabs?: number });

  return {
    scene,
    camera,
    resize: (w, h) => {
      const aspect = w / h;
      // cover: the portrait frame fills the screen, cropped on whichever side it overflows
      const visibleH = Math.min(FRAME_H, FRAME_W / aspect) / ZOOM;
      camera.position.set(0, 0, visibleH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      camera.lookAt(0, 0, 0);
    },
    update: (t, _dt, p) => {
      const u = pin?.__slabs ?? (((t / SLOW) % LOOP) + LOOP) % LOOP;
      slabsList.forEach((mesh, i) => {
        let turns = 0;
        for (const r of ROUNDS) turns += ease(clamp((u - r.start[i]) / r.turn));
        mesh.rotation.x = Math.PI * turns;
      });
      group.rotation.y = p.x * 0.06;
      group.rotation.x = p.y * 0.04;
    },
  };
}
