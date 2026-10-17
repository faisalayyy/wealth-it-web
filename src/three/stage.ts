import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * What every 3D scene on the site shares: a transparent renderer sized to its canvas, a soft studio
 * environment for reflections, and a loop that only runs while the canvas is on screen. The
 * reference plays pre-rendered videos in these places; rendering live keeps the colours the app's
 * and the phone screens real captures.
 */
export type Scene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** called every frame with seconds elapsed and the pointer (-1..1) */
  update?: (t: number, dt: number, pointer: { x: number; y: number }) => void;
  resize?: (w: number, h: number) => void;
  dispose?: () => void;
};

export function mount(canvas: HTMLCanvasElement, build: (ctx: { renderer: THREE.WebGLRenderer; env: THREE.Texture }) => Scene, opts: { still?: boolean } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  // phones draw at a lower ratio: the charms stay sharp enough and the GPU does far less
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 744 ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const s = build({ renderer, env });
  s.scene.environment = env;

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / innerWidth) * 2 - 1;
    target.y = (e.clientY / innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const size = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    s.camera.aspect = w / h;
    s.camera.updateProjectionMatrix();
    s.resize?.(w, h);
  };
  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  size();

  const clock = new THREE.Clock();
  let visible = false;
  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    pointer.x += (target.x - pointer.x) * 0.05;
    pointer.y += (target.y - pointer.y) * 0.05;
    s.update?.(clock.elapsedTime, dt, pointer);
    renderer.render(s.scene, s.camera);
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible && !opts.still) {
      clock.getDelta();
      frame();
    } else if (visible) {
      s.update?.(2, 0, pointer);
      renderer.render(s.scene, s.camera);
    }
  });
  io.observe(canvas);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onMove);
    s.dispose?.();
    s.scene.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach(x => x.dispose());
    });
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}

/** Load a texture as sRGB, for real captures on 3D surfaces. */
export function loadTexture(url: string, renderer: THREE.WebGLRenderer) {
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export { THREE };
