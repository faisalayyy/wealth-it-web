import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { screenSources } from '@/lib/screens';
import { loadTexture, THREE, type Scene } from './stage';

/**
 * The app in the world: a phone standing inside a great ribbed ring — the Dashboard's category
 * ring, built as architecture — with the real Dashboard capture on its screen. The camera drifts
 * round it slowly. This is the reference's 3D-phone film, made with the app's own drawing.
 */
const HUES = ['#8E9BC4', '#D9A066', '#C98A8A', '#C4B36A', '#6FBFA0', '#B889B0', '#6FA8B8'];
const SHARES = [50, 16, 10, 9, 7, 6, 2];

export function ringPhone({ renderer, env }: { renderer: THREE.WebGLRenderer; env: THREE.Texture }): Scene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.4, 12);

  // the ring: one fin per few degrees, each fin in the colour of the arc it belongs to
  const FINS = 140;
  const R = 3.5;
  const fin = new THREE.BoxGeometry(0.06, 1.1, 1.5);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05, envMap: env, envMapIntensity: 0.6 });
  const ring = new THREE.InstancedMesh(fin, mat, FINS);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();
  const bounds: number[] = [];
  SHARES.reduce((acc, s) => (bounds.push(acc + s), acc + s), 0);
  for (let i = 0; i < FINS; i++) {
    const a = (i / FINS) * Math.PI * 2;
    const pct = (i / FINS) * 100;
    const hue = HUES[bounds.findIndex(b => pct < b)];
    q.setFromEuler(new THREE.Euler(0, 0, -a));
    m.compose(new THREE.Vector3(Math.sin(a) * R, Math.cos(a) * R, 0), q, new THREE.Vector3(1, 1, 1));
    ring.setMatrixAt(i, m);
    ring.setColorAt(i, col.set(hue).multiplyScalar(0.5));
  }
  ring.position.z = -1.2;
  scene.add(ring);

  // the phone
  const phone = new THREE.Group();
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(1.9, 4.05, 0.2, 8, 0.28),
    new THREE.MeshPhysicalMaterial({ color: '#2a2e2c', roughness: 0.3, metalness: 0.7, clearcoat: 1, envMap: env }),
  );
  phone.add(body);
  const tex = loadTexture(screenSources('dashboard').texture, renderer);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.74, 1.74 * (874 / 402)),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
  );
  screen.position.z = 0.101;
  phone.add(screen);
  // round the screen's corners with a mask of the body colour would cost a shader; a thin bezel
  // plane behind the screen reads the same at this size
  scene.add(phone);

  scene.add(new THREE.AmbientLight('#ffffff', 0.45));
  const key = new THREE.DirectionalLight('#ffffff', 2);
  key.position.set(3, 5, 7);
  scene.add(key);
  const lime = new THREE.PointLight('#c8f24e', 18, 12);
  lime.position.set(-2.5, -1.5, 2.5);
  scene.add(lime);

  let wide = true;
  return {
    scene,
    camera,
    resize: (w, h) => {
      wide = w / h > 1;
      camera.position.z = wide ? 17 : 19;
      scene.position.x = wide ? 3.4 : 0;
      scene.position.y = wide ? 0 : -0.4;
    },
    update: (t, _dt, p) => {
      ring.rotation.z = -t * 0.04;
      phone.rotation.y = Math.sin(t * 0.35) * 0.22 + p.x * 0.15;
      phone.rotation.x = Math.sin(t * 0.25) * 0.05 - p.y * 0.06;
      phone.position.y = Math.sin(t * 0.6) * 0.06;
      camera.position.x = Math.sin(t * 0.12) * 1.2;
      camera.lookAt(scene.position.x, scene.position.y, 0);
    },
  };
}
