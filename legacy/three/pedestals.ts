import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { crop } from '@/lib/screens';
import { loadTexture, THREE, type Scene } from './stage';

/**
 * Budgets as an object: a card-shaped slab turning slowly above a field of pale pedestals, and on
 * its face the real Food & Drink budget from the app — over by 428.80, 123% used. The reference
 * shows its payment card like this; Wealth-it's equivalent is the spending limit.
 */
export function pedestals({ renderer, env }: { renderer: THREE.WebGLRenderer; env: THREE.Texture }): Scene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 3.2, 12);
  camera.lookAt(0, 0.2, 0);

  const stone = new THREE.MeshStandardMaterial({ color: '#eef7cf', roughness: 0.6, metalness: 0, envMap: env, envMapIntensity: 0.7 });
  const stoneLime = new THREE.MeshStandardMaterial({ color: '#d5ef7e', roughness: 0.55, envMap: env, envMapIntensity: 0.7 });
  const specs: Array<[number, number, number, number, THREE.Material]> = [
    // x, z, radius, height, material
    [-3.6, -1.4, 2.1, 2.4, stone],
    [2.4, -2.2, 2.6, 1.4, stoneLime],
    [4.6, 1.2, 1.7, 0.9, stone],
    [-1.1, 1.9, 2.2, 0.55, stoneLime],
    [0.9, -4.4, 3.0, 2.9, stone],
  ];
  specs.forEach(([x, z, r, h, material]) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 96), material);
    c.position.set(x, h / 2 - 1.2, z);
    scene.add(c);
  });

  const slab = new THREE.Group();
  const w = 2.7;
  const c = crop('budget-slab');
  const hgt = (w * c.h) / c.w + 0.5;
  const card = new THREE.Mesh(
    new RoundedBoxGeometry(w + 0.3, hgt, 0.09, 6, 0.22),
    new THREE.MeshPhysicalMaterial({ color: '#1b201e', roughness: 0.35, metalness: 0.2, clearcoat: 1, envMap: env }),
  );
  slab.add(card);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(w, (w * c.h) / c.w),
    new THREE.MeshBasicMaterial({ map: loadTexture(c.webp, renderer), toneMapped: false }),
  );
  face.position.z = 0.047;
  slab.add(face);
  slab.position.set(0.2, 0.9, 1.2);
  scene.add(slab);

  scene.add(new THREE.AmbientLight('#ffffff', 0.7));
  const sun = new THREE.DirectionalLight('#fffbe8', 2.4);
  sun.position.set(-4, 8, 6);
  scene.add(sun);

  return {
    scene,
    camera,
    resize: (wd, h) => {
      camera.position.z = wd / h > 1 ? 12 : 16;
    },
    update: (t, _dt, p) => {
      slab.rotation.z = -0.5 + Math.sin(t * 0.5) * 0.12;
      slab.rotation.y = Math.sin(t * 0.4) * 0.35 + p.x * 0.2;
      slab.rotation.x = -0.25 + Math.sin(t * 0.3) * 0.08;
      slab.position.y = 0.9 + Math.sin(t * 0.8) * 0.12;
    },
  };
}
