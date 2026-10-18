import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * What every 3D scene on the site shares: a transparent renderer sized to its canvas, a soft studio
 * environment for reflections, and a loop that only runs while the canvas is on screen. The
 * reference plays pre-rendered videos in these places; rendering live keeps the colours the app's
 * and the phone screens real captures.
 *
 * Starting never freezes the page: the environment, the scene, the shaders and the scene's own
 * warming up (the keyring's chains settling) each happen in a frame of their own, the shaders are
 * compiled in the background where the browser can, and warming runs in slices of a few
 * milliseconds. `onReady` is called once the first frame is drawn, and the canvas fades in then.
 */
export type Scene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** called every frame with seconds elapsed and the pointer (-1..1) */
  update?: (t: number, dt: number, pointer: { x: number; y: number }) => void;
  resize?: (w: number, h: number) => void;
  /** work to finish before the first frame, a slice at a time; true once done */
  warm?: (budgetMs: number) => boolean;
  dispose?: () => void;
};

const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()));

export function mount(
  canvas: HTMLCanvasElement,
  build: (ctx: { renderer: THREE.WebGLRenderer; env: THREE.Texture }) => Scene,
  opts: { still?: boolean; onReady?: () => void } = {},
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  // phones draw at a lower ratio: the charms stay sharp enough and the GPU does far less
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 744 ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  let disposed = false;
  let pmrem: THREE.PMREMGenerator | null = null;
  let env: THREE.Texture | null = null;
  let s: Scene | null = null;
  let raf = 0;
  let io: IntersectionObserver | null = null;
  let ro: ResizeObserver | null = null;

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / innerWidth) * 2 - 1;
    target.y = (e.clientY / innerHeight) * 2 - 1;
  };

  let sized = '';
  const size = () => {
    if (!s) return;
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    // resizing the drawing buffer is costly; the observer's first call repeats the size already set
    if (sized === `${w}x${h}`) return;
    sized = `${w}x${h}`;
    renderer.setSize(w, h, false);
    s.camera.aspect = w / h;
    s.camera.updateProjectionMatrix();
    s.resize?.(w, h);
  };

  const clock = new THREE.Clock();
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    pointer.x += (target.x - pointer.x) * 0.05;
    pointer.y += (target.y - pointer.y) * 0.05;
    s!.update?.(clock.elapsedTime, dt, pointer);
    renderer.render(s!.scene, s!.camera);
  };

  const start = async () => {
    await nextFrame();
    if (disposed) return;
    pmrem = new THREE.PMREMGenerator(renderer);
    env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    await nextFrame();
    if (disposed) return;
    s = build({ renderer, env });
    s.scene.environment = env;
    size();
    await nextFrame();
    if (disposed) return;
    // compile every material's shaders off the main thread where the browser allows it
    await renderer.compileAsync(s.scene, s.camera).catch(() => {});
    while (s.warm && !disposed && !s.warm(6)) await nextFrame();
    if (disposed) return;

    window.addEventListener('pointermove', onMove, { passive: true });
    ro = new ResizeObserver(size);
    ro.observe(canvas);
    io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (!e.isIntersecting) return;
      if (!opts.still) {
        clock.getDelta();
        frame();
      } else {
        s!.update?.(2, 0, pointer);
        renderer.render(s!.scene, s!.camera);
      }
    });
    io.observe(canvas);
    renderer.render(s.scene, s.camera);
    opts.onReady?.();
  };
  void start();

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    io?.disconnect();
    ro?.disconnect();
    window.removeEventListener('pointermove', onMove);
    s?.dispose?.();
    s?.scene.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach(x => x.dispose());
    });
    env?.dispose();
    pmrem?.dispose();
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
