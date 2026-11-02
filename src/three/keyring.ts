import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CHART } from '@/lib/brand';
import { bladeGeometries } from './blades';
import { THREE, type Scene } from './stage';

/**
 * The homepage hero's 3D, after the reference's keyring: a big ring hanging from the top edge of
 * the screen, split rings threaded on it, link chains from the split rings, and on the chains the
 * charms — the Wealthit mark (the lime blade and two Night ones) on a soft paper block, as on the
 * app's light icon (A507: the logo has no black behind it), the spending chart, a card, a receipt and a padlock — spaced evenly either side of the
 * ring's lowest point.
 *
 * Everything that moves is a solid body in a small physics world (cannon-es): every split ring,
 * every chain link and every charm hangs from the one above it on a ball joint, and the charms
 * knock against each other and the big ring instead of passing through. It starts at
 * rest, as if just hung up, bobs once as the canvas fades in, and leans a little after the pointer;
 * the pointer passing through a charm pushes it at the point it touched.
 */

const RING_R = 1.6; // the big ring
const WIRE = 0.066;
const SPLIT_R = 0.19; // a split ring
const SPLIT_W = 0.024;
const LINK_R = 0.062; // a chain link (an oval: this radius, stretched)
const LINK_W = 0.017;
const LINK_S = 1.55;
const LINK_P = 0.074; // a link's joints, either side of its centre
const DROP = 0; // the keyring starts where it hangs, at rest (a drop from above jammed the charms)
const STEP = 1 / 180;

// who collides with whom: charms with charms and the big ring; chains and split rings with nothing
const G_RING = 1;
const G_CHARM = 2;

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, renderer: THREE.WebGLRenderer, w = 512, h = 512) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

/** ExtrudeGeometry maps its caps by shape coordinates; stretch a texture over a w × h box from (x0, y0). */
function fit(tex: THREE.Texture, x0: number, y0: number, w: number, h: number) {
  tex.repeat.set(1 / w, 1 / h);
  tex.offset.set(-x0 / w, -y0 / h);
  return tex;
}

type Part = { body: CANNON.Body; obj: THREE.Object3D };
type Charm = Part & { phase: number; pushed: number; face?: number };

export function keyring({ renderer, env }: { renderer: THREE.WebGLRenderer; env: THREE.Texture }): Scene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 100);
  camera.position.set(0, 0, 14);

  // ─── materials ──────────────────────────────────────────────────────────────────────────
  const chrome = new THREE.MeshPhysicalMaterial({ color: '#f4f5f1', metalness: 1, roughness: 0.09, envMap: env, envMapIntensity: 1.45 });
  const steel = new THREE.MeshPhysicalMaterial({ color: '#dfe1dc', metalness: 1, roughness: 0.22, envMap: env, envMapIntensity: 1.1 });
  const gloss = (color: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.14, envMap: env, envMapIntensity: 0.65, ...extra });
  // the brand's lime and paper, lacquered; Night for the blades and the card
  const lime = gloss('#77c41b', { roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.8 });
  const paper = gloss('#f5f5f3', { roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.3, envMapIntensity: 0.7 });
  const night = gloss('#141415', { roughness: 0.3, clearcoat: 0.9 });
  const ink = gloss('#111112', { roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.3 });

  const group = new THREE.Group();
  scene.add(group);

  // ─── the world ──────────────────────────────────────────────────────────────────────────
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -12, 0) });
  world.allowSleep = false;
  (world.solver as CANNON.GSSolver).iterations = 40;
  world.defaultContactMaterial.friction = 0.08; // charms slide off each other rather than jam
  world.defaultContactMaterial.restitution = 0.25;
  world.defaultContactMaterial.contactEquationStiffness = 3e7;
  world.defaultContactMaterial.contactEquationRelaxation = 3;

  const parts: Part[] = [];
  const charms: Charm[] = [];

  // the big ring: drawn as a torus, felt as a necklace of spheres along its wire
  const ringQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0.42, 0));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(RING_R, WIRE, 32, 200), chrome);
  group.add(ring);
  const ringBody = new CANNON.Body({ type: CANNON.Body.KINEMATIC, position: new CANNON.Vec3(0, DROP, 0), collisionFilterGroup: G_RING, collisionFilterMask: G_CHARM });
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const p = new THREE.Vector3(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0).applyQuaternion(ringQ);
    ringBody.addShape(new CANNON.Sphere(WIRE), new CANNON.Vec3(p.x, p.y, p.z));
  }
  world.addBody(ringBody);

  const v3 = (v: THREE.Vector3) => new CANNON.Vec3(v.x, v.y, v.z);
  const ringPoint = (deg: number) => {
    const a = THREE.MathUtils.degToRad(deg);
    const at = new THREE.Vector3(Math.sin(a) * RING_R, -Math.cos(a) * RING_R, 0).applyQuaternion(ringQ);
    const tangent = new THREE.Vector3(Math.cos(a), Math.sin(a), 0).applyQuaternion(ringQ).normalize();
    return { at, tangent };
  };

  /** a body for a part that hangs and swings but touches nothing */
  const loose = (obj: THREE.Object3D, mass: number, radius: number) => {
    const body = new CANNON.Body({ mass, linearDamping: 0.3, angularDamping: 0.5, collisionFilterGroup: 0, collisionFilterMask: 0 });
    body.addShape(new CANNON.Sphere(radius));
    world.addBody(body);
    group.add(obj);
    parts.push({ body, obj });
    return body;
  };

  const join = (a: CANNON.Body, pa: CANNON.Vec3, b: CANNON.Body, pb: CANNON.Vec3) => world.addConstraint(new CANNON.PointToPointConstraint(a, pa, b, pb, 1e6));

  // a body placed so that its point `local` sits at `world` (no rotation yet)
  const put = (body: CANNON.Body, local: CANNON.Vec3, at: CANNON.Vec3, q = new CANNON.Quaternion()) => {
    body.quaternion.copy(q);
    const l = q.vmult(local);
    body.position.set(at.x - l.x, at.y - l.y, at.z - l.z);
  };

  // ─── shared geometry: the split ring (two turns of wire) and a chain link ───────────────
  const splitGeo = (() => {
    const a = new THREE.TorusGeometry(SPLIT_R, SPLIT_W, 12, 64);
    const b = a.clone();
    a.translate(0, 0, SPLIT_W * 0.9);
    b.translate(0, 0, -SPLIT_W * 0.9);
    return mergeGeometries([a, b]);
  })();
  const linkGeo = new THREE.TorusGeometry(LINK_R, LINK_W, 8, 24).scale(1, LINK_S, 1);

  /**
   * One strand: a split ring threaded on the big ring at `deg` (0 = the bottom), `links` chain
   * links under it, and the charm on the last one by its eyelet.
   */
  const strand = (deg: number, links: number, charm: { obj: THREE.Object3D; body: CANNON.Body; eyelet: CANNON.Vec3 }, lean: number, face: number) => {
    const { at, tangent } = ringPoint(deg);
    // the split ring goes round the big ring's wire: its axis along the wire
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    const twist = new THREE.Quaternion().setFromAxisAngle(tangent, 0);
    q.premultiply(twist);
    const split = loose(new THREE.Mesh(splitGeo, steel), 0.12, SPLIT_R);
    const top = new CANNON.Vec3(0, SPLIT_R - SPLIT_W - WIRE, 0);
    const pin = v3(at).vadd(new CANNON.Vec3(0, DROP, 0));
    put(split, top, pin, new CANNON.Quaternion(q.x, q.y, q.z, q.w));
    join(ringBody, v3(at), split, top);

    // the chain hangs straight down from the split ring's bottom
    let above = split;
    let abovePoint = new CANNON.Vec3(0, -(SPLIT_R - SPLIT_W * 1.5), 0);
    let hook = split.pointToWorldFrame(abovePoint);
    for (let i = 0; i < links; i++) {
      const mesh = new THREE.Mesh(linkGeo, steel);
      const holder = new THREE.Group();
      mesh.rotation.y = i % 2 ? Math.PI / 2 : 0; // each link turned a quarter to the last, like a real chain
      holder.add(mesh);
      const link = loose(holder, 0.05, LINK_R);
      const lt = new CANNON.Vec3(0, LINK_P, 0);
      put(link, lt, hook);
      join(above, abovePoint, link, lt);
      above = link;
      abovePoint = new CANNON.Vec3(0, -LINK_P, 0);
      hook = link.pointToWorldFrame(abovePoint);
    }

    // the charm, its eyelet on the hook, leaning forward or back so neighbours start apart
    const body = charm.body;
    put(body, charm.eyelet, hook, new CANNON.Quaternion().setFromEuler(lean, lean * 0.8, 0));
    body.position.z += lean * 1.4;
    world.addBody(body);
    join(above, abovePoint, body, charm.eyelet);
    group.add(charm.obj);
    const c = { body, obj: charm.obj, phase: charms.length * 1.9, pushed: 0, face };
    parts.push(c);
    charms.push(c);
  };

  const charmBody = (mass: number) =>
    new CANNON.Body({ mass, linearDamping: 0.24, angularDamping: 0.4, collisionFilterGroup: G_CHARM, collisionFilterMask: G_CHARM | G_RING });

  // a screw eye: the little loop on top of a charm that the chain hooks into
  const eye = (y: number, r = 0.07) => {
    const g = new THREE.Group();
    const loop = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 10, 28), steel);
    loop.position.y = y + r;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.06, 10), steel);
    post.position.y = y + 0.01;
    g.add(loop, post);
    return { obj: g, eyelet: new CANNON.Vec3(0, y + r * 1.75, 0) };
  };

  // a grommet: a metal-lined hole through a flat charm
  const grommet = (x: number, y: number, depth: number) => {
    const g = new THREE.Group();
    const geo = new THREE.TorusGeometry(0.055, 0.017, 10, 28);
    const f = new THREE.Mesh(geo, steel);
    f.position.set(x, y, depth / 2 + 0.004);
    const b = f.clone();
    b.position.z = -depth / 2 - 0.004;
    g.add(f, b);
    return g;
  };

  // ─── 1 · the mark on a soft paper block, as on the app's light icon ─────────────────────
  {
    const S = 1.0;
    const D = 0.5;
    const block = new THREE.Mesh(new RoundedBoxGeometry(S, S * 0.94, D, 8, 0.22), paper);
    // the block is a little soft — pressed in at the middle of each face
    {
      const p = block.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const y = p.getY(i);
        const z = p.getZ(i);
        const k = 1 - 0.035 * Math.cos((x / S) * Math.PI) * Math.cos((y / S) * Math.PI);
        p.setXYZ(i, x * (1 + 0.02 * Math.sin(y * 3)), y, z * k);
      }
      block.geometry.computeVertexNormals();
    }
    // the blades at the size the app's icon sets them on its tile, raised off the face
    const mark = new THREE.Group();
    bladeGeometries(S * 0.56, 0.03, 0.012).forEach((geo, i) => mark.add(new THREE.Mesh(geo, i === 0 ? lime : night)));
    mark.position.z = D / 2 - 0.03;
    const { obj: e, eyelet } = eye(S * 0.47);
    const holder = new THREE.Group();
    holder.add(block, mark, e);
    const body = charmBody(1.1);
    body.addShape(new CANNON.Box(new CANNON.Vec3(S / 2, (S * 0.94) / 2, D / 2 + 0.06)));
    strand(-50, 2, { obj: holder, body, eyelet }, 0.35, -0.22);
  }

  // ─── 2 · the spending chart: a donut, its slices apart, one lifted out ──────────────────
  {
    const R1 = 0.6;
    const R0 = 0.3;
    const gap = 0.05;
    const holder = new THREE.Group();
    let a0 = Math.PI / 2;
    const most = Math.max(...CHART.map(c => c.share));
    CHART.forEach(slice => {
      const sweep = (slice.share / 100) * Math.PI * 2;
      const s = new THREE.Shape();
      const from = a0 - gap / 2;
      const to = a0 - sweep + gap / 2;
      s.absarc(0, 0, R1, from, to, true);
      s.absarc(0, 0, R0, to + (gap * (R1 - R0)) / R0 / 2, from - (gap * (R1 - R0)) / R0 / 2, false);
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 5, curveSegments: 40 });
      g.translate(0, 0, -0.08);
      const m = new THREE.Mesh(g, gloss(slice.color, { roughness: 0.32 }));
      if (slice.share === most) {
        // the biggest slice stands out, the way the app lifts the one you tap
        const mid = a0 - sweep / 2;
        m.position.set(Math.cos(mid) * 0.06, Math.sin(mid) * 0.06, 0.05);
      }
      holder.add(m);
      a0 -= sweep;
    });
    const { obj: e, eyelet } = eye(R1 + 0.02);
    holder.add(e);
    const body = charmBody(0.9);
    body.addShape(new CANNON.Cylinder(R1 + 0.04, R1 + 0.04, 0.3, 16), undefined, new CANNON.Quaternion().setFromEuler(Math.PI / 2, 0, 0));
    strand(-24, 3, { obj: holder, body, eyelet }, -0.35, 0.18);
  }

  // ─── 3 · a Night card, on a split ring through the hole in its corner ───────────────────
  {
    const W = 1.36;
    const H = 0.86;
    const D = 0.05;
    const face = canvasTexture((ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#232325');
      g.addColorStop(1, '#0b0b0c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.font = `700 ${h * 0.13}px "Plus Jakarta Sans Variable", system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#f3f3f3';
      ctx.fillText('Wealth', w * 0.92 - ctx.measureText('it').width, h * 0.22);
      ctx.fillStyle = '#77c41b';
      ctx.fillText('it', w * 0.92, h * 0.22);
      // the chip
      ctx.fillStyle = '#cfcfca';
      ctx.beginPath();
      ctx.roundRect(w * 0.1, h * 0.4, w * 0.15, h * 0.2, h * 0.03);
      ctx.fill();
      ctx.strokeStyle = 'rgba(40,40,40,0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.1 + 6, h * 0.4 + 6, w * 0.15 - 12, h * 0.2 - 12);
      // contactless
      ctx.strokeStyle = 'rgba(243,243,243,0.7)';
      ctx.lineWidth = h * 0.014;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(w * 0.3, h * 0.5, h * (0.04 + i * 0.035), -0.7, 0.7);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(243,243,243,0.72)';
      ctx.font = `500 ${h * 0.085}px ui-monospace, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('••••  ••••  ••••  4821', w * 0.1, h * 0.84);
    }, renderer, 860, 540);
    const faceMat = gloss('#ffffff', { map: face, roughness: 0.26, clearcoat: 1, envMapIntensity: 0.5 });
    const card = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 4, 0.08), [night, night, night, night, faceMat, night]);
    const hole = { x: -W / 2 + 0.12, y: H / 2 - 0.12 };
    const holder = new THREE.Group();
    holder.add(card, grommet(hole.x, hole.y, D));
    const body = charmBody(0.7);
    body.addShape(new CANNON.Box(new CANNON.Vec3(W / 2, H / 2, D / 2 + 0.03)));
    strand(2, 2, { obj: holder, body, eyelet: new CANNON.Vec3(hole.x, hole.y + 0.03, 0) }, 0.35, -0.16);
  }

  // ─── 4 · a receipt, torn off, a little curled ───────────────────────────────────────────
  {
    const W = 0.66;
    const H = 1.08;
    const teeth = 9;
    const s = new THREE.Shape();
    s.moveTo(-W / 2, H / 2);
    for (let i = 0; i <= teeth * 2; i++) s.lineTo(-W / 2 + (W * i) / (teeth * 2), H / 2 - (i % 2 ? 0.035 : 0));
    for (let i = teeth * 2; i >= 0; i--) s.lineTo(-W / 2 + (W * i) / (teeth * 2), -H / 2 + (i % 2 ? 0.035 : 0));
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false, curveSegments: 4 });
    // a gentle curl along its length
    {
      const p = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) - 0.006 + 0.07 * Math.pow(p.getY(i) / (H / 2), 2) - 0.03 * Math.pow(p.getX(i) / (W / 2), 2));
      geo.computeVertexNormals();
    }
    const print = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#f8f7f2';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#2a2b28';
      ctx.textAlign = 'center';
      ctx.font = `700 ${w * 0.075}px ui-monospace, monospace`;
      ctx.fillText('HARBOUR LANE', w / 2, h * 0.17);
      ctx.font = `500 ${w * 0.05}px ui-monospace, monospace`;
      ctx.fillStyle = '#555651';
      ctx.fillText('SUPERMARKET', w / 2, h * 0.23);
      const rows = [
        ['Milk', '7.50'],
        ['Bread', '6.25'],
        ['Dates', '24.00'],
        ['Coffee', '48.75'],
      ];
      ctx.font = `500 ${w * 0.058}px ui-monospace, monospace`;
      ctx.fillStyle = '#2a2b28';
      rows.forEach(([n, v], i) => {
        const y = h * (0.34 + i * 0.075);
        ctx.textAlign = 'left';
        ctx.fillText(n, w * 0.12, y);
        ctx.textAlign = 'right';
        ctx.fillText(v, w * 0.88, y);
      });
      ctx.setLineDash([w * 0.02, w * 0.015]);
      ctx.strokeStyle = '#7d7e78';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.64);
      ctx.lineTo(w * 0.88, h * 0.64);
      ctx.stroke();
      ctx.font = `700 ${w * 0.068}px ui-monospace, monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('TOTAL', w * 0.12, h * 0.72);
      ctx.textAlign = 'right';
      ctx.fillText('AED 86.50', w * 0.88, h * 0.72);
      // a barcode
      ctx.fillStyle = '#2a2b28';
      let x = w * 0.18;
      let seed = 7;
      while (x < w * 0.82) {
        seed = (seed * 9301 + 49297) % 233280;
        const bw = 2 + (seed % 5) * 1.6;
        ctx.fillRect(x, h * 0.8, bw, h * 0.08);
        x += bw + 3 + (seed % 3) * 2;
      }
    }, renderer, 420, 690);
    const paper = new THREE.MeshPhysicalMaterial({ color: '#ffffff', map: fit(print, -W / 2, -H / 2, W, H), roughness: 0.85, sheen: 0.4, envMap: env, envMapIntensity: 0.35, side: THREE.DoubleSide });
    const edge = new THREE.MeshPhysicalMaterial({ color: '#efeee8', roughness: 0.9, envMap: env, envMapIntensity: 0.3 });
    const receipt = new THREE.Mesh(geo, [paper, edge]);
    const holder = new THREE.Group();
    const hy = H / 2 - 0.1;
    holder.add(receipt, grommet(0, hy, 0.06));
    const body = charmBody(0.35);
    body.addShape(new CANNON.Box(new CANNON.Vec3(W / 2, H / 2, 0.05)));
    strand(27, 4, { obj: holder, body, eyelet: new CANNON.Vec3(0, hy + 0.03, 0) }, -0.35, 0.24);
  }

  // ─── 5 · a padlock: private by design ───────────────────────────────────────────────────
  {
    const W = 0.66;
    const H = 0.56;
    const D = 0.26;
    const bodyMesh = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.1), lime);
    const ringR = 0.2;
    const legs = 0.16;
    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(new THREE.LineCurve3(new THREE.Vector3(-ringR, H / 2 - 0.04, 0), new THREE.Vector3(-ringR, H / 2 + legs, 0)));
    path.add(
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-ringR, H / 2 + legs, 0),
        new THREE.Vector3(-ringR, H / 2 + legs + ringR * 1.33, 0),
        new THREE.Vector3(ringR, H / 2 + legs + ringR * 1.33, 0),
        new THREE.Vector3(ringR, H / 2 + legs, 0),
      ),
    );
    path.add(new THREE.LineCurve3(new THREE.Vector3(ringR, H / 2 + legs, 0), new THREE.Vector3(ringR, H / 2 - 0.04, 0)));
    const shackle = new THREE.Mesh(new THREE.TubeGeometry(path, 64, 0.052, 14, false), chrome);
    const keyhole = new THREE.Group();
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 24), ink);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, 0.03, D / 2 + 0.002);
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.02), ink);
    slot.position.set(0, -0.04, D / 2 + 0.002);
    keyhole.add(hole, slot);
    const holder = new THREE.Group();
    holder.add(bodyMesh, shackle, keyhole);
    const top = H / 2 + legs + ringR;
    const body = charmBody(1);
    body.addShape(new CANNON.Box(new CANNON.Vec3(W / 2, H / 2, D / 2 + 0.02)));
    body.addShape(new CANNON.Sphere(ringR), new CANNON.Vec3(0, H / 2 + legs * 0.7, 0));
    strand(52, 1, { obj: holder, body, eyelet: new CANNON.Vec3(0, top - 0.02, 0) }, 0.35, -0.2);
  }

  scene.add(new THREE.HemisphereLight('#ffffff', '#c9cbc4', 1.15));
  const key = new THREE.DirectionalLight('#ffffff', 2.3);
  key.position.set(3, 5, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#fff4dc', 0.9);
  rim.position.set(-5, -2, 4);
  scene.add(rim);

  // ─── drawing what the bodies did ────────────────────────────────────────────────────────
  const sync = () => {
    ring.position.set(ringBody.position.x, ringBody.position.y, ringBody.position.z);
    ring.quaternion.set(ringBody.quaternion.x, ringBody.quaternion.y, ringBody.quaternion.z, ringBody.quaternion.w).multiply(ringQ);
    for (const p of parts) {
      p.obj.position.set(p.body.position.x, p.body.position.y, p.body.position.z);
      p.obj.quaternion.set(p.body.quaternion.x, p.body.quaternion.y, p.body.quaternion.z, p.body.quaternion.w);
    }
  };

  // ─── the big ring's own motion: a bob as it appears, a slow sway, a lean after the pointer ─
  let dropAt = NaN; // NaN: still settling, before the first frame
  const lean = { x: 0, y: 0 };
  const euler = new CANNON.Vec3();
  const place = (t: number) => {
    const live = Number.isNaN(dropAt) ? 0 : 1;
    const tau = live ? Math.max(0, t - dropAt) : 0;
    // as if it had just been hung up: it dips, comes back, and settles
    const y = -0.2 * Math.exp(-2.2 * tau) * Math.sin(5.2 * tau);
    const rz = live * (Math.sin(t * 0.5) * 0.03 - lean.x * 0.07);
    const ry = live * lean.x * 0.12;
    // a kinematic body moves by its velocity: aim it at where it should be after this step
    ringBody.velocity.set(0, (y - ringBody.position.y) / STEP, 0);
    ringBody.quaternion.toEuler(euler);
    ringBody.angularVelocity.set(0, (ry - euler.y) / STEP, (rz - euler.z) / STEP);
  };
  // A chain resists being twisted: each charm turns back, slowly, to face the way it hangs —
  // mostly towards the viewer — after a push has spun it.
  const front = new CANNON.Vec3(0, 0, 1);
  const fwd = new CANNON.Vec3();
  const face = () => {
    for (const c of charms) {
      if (c.face === undefined) continue;
      c.body.quaternion.vmult(front, fwd);
      let err = c.face - Math.atan2(fwd.x, fwd.z);
      err = Math.atan2(Math.sin(err), Math.cos(err));
      c.body.torque.y += c.body.mass * (0.7 * err - 0.16 * c.body.angularVelocity.y);
    }
  };
  const breeze = (t: number) => {
    for (const c of charms) {
      const f = 0.04 * Math.sin(t * 0.8 + c.phase) * c.body.mass;
      c.body.applyForce(new CANNON.Vec3(f, 0, 0.6 * f));
    }
    face();
  };
  // settling the chains before the first frame, a slice at a time (stage.ts calls `warm`) instead of
  // 720 steps at once, which froze the page for a second on a phone
  const WARM = 720;
  let warmed = 0;
  const warm = (budgetMs: number) => {
    const end = performance.now() + budgetMs;
    if (warmed === 0) for (const p of parts) (p.body.linearDamping = 0.95), (p.body.angularDamping = 0.95);
    while (warmed < WARM && performance.now() < end) {
      place(0);
      face();
      world.step(STEP);
      warmed++;
    }
    if (warmed < WARM) return false;
    for (const p of parts) {
      const charm = charms.includes(p as Charm);
      p.body.linearDamping = charm ? 0.24 : 0.3;
      p.body.angularDamping = charm ? 0.4 : 0.5;
    }
    sync();
    return true;
  };

  // ─── the pointer ────────────────────────────────────────────────────────────────────────
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const ptr = { x: 0, y: 0, vx: 0, vy: 0, t: 0 };
  const hit = new THREE.Vector3();
  const onMove = (e: PointerEvent) => {
    const now = performance.now();
    const dt = Math.max(8, now - ptr.t) / 1000;
    if (ptr.t && now - ptr.t < 200) {
      ptr.vx = ptr.vx * 0.4 + ((e.clientX - ptr.x) / dt) * 0.6;
      ptr.vy = ptr.vy * 0.4 + ((e.clientY - ptr.y) / dt) * 0.6;
    } else {
      ptr.vx = ptr.vy = 0;
    }
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    ptr.t = now;

    const rect = canvas.getBoundingClientRect();
    if (e.clientY > rect.bottom || e.clientY < rect.top) return;
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const speed = Math.min(Math.hypot(ptr.vx, ptr.vy), 2400);
    if (speed < 40) return;
    for (const c of charms) {
      if (now - c.pushed < 120) continue;
      const hits = raycaster.intersectObject(c.obj, true);
      if (!hits.length) continue;
      c.pushed = now;
      // the push, in the ring's space: the way the pointer went, and a little into the screen
      const k = (speed / 2400) * 1.15 * c.body.mass;
      const dir = new CANNON.Vec3(ptr.vx / speed, -ptr.vy / speed, -0.3);
      group.worldToLocal(hit.copy(hits[0].point));
      const rel = new CANNON.Vec3(hit.x - c.body.position.x, hit.y - c.body.position.y, hit.z - c.body.position.z);
      c.body.applyImpulse(dir.scale(k), rel);
    }
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let acc = 0;
  if (process.env.NODE_ENV !== 'production') (window as unknown as { __keyring: unknown }).__keyring = { world, charms, parts };

  return {
    scene,
    camera,
    warm,
    resize: (w, h) => {
      const aspect = w / h;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const scale = aspect < 0.8 ? 0.76 : aspect < 1.2 ? 0.86 : 1.05;
      group.scale.setScalar(scale);
      // the big ring's centre above the screen: what shows is its lower arc and what hangs on it
      group.position.y = halfH + RING_R * 0.22 * scale;
    },
    update: (t, dt, pointer) => {
      if (dt === 0) {
        // a still frame (reduced motion): already settled while warming, so only drawn
        sync();
        return;
      }
      if (Number.isNaN(dropAt)) dropAt = t;
      lean.x += (pointer.x - lean.x) * 0.04;
      // at most four steps a frame: a slow frame slows the swing a touch instead of piling up more
      // steps for the next one, which is how a busy phone starts to stutter
      acc = Math.min(acc + Math.min(dt, 0.05), STEP * 4);
      let at = t - acc;
      while (acc >= STEP) {
        at += STEP;
        place(at);
        breeze(at);
        world.step(STEP);
        acc -= STEP;
      }
      sync();
    },
    dispose: () => window.removeEventListener('pointermove', onMove),
  };
}
