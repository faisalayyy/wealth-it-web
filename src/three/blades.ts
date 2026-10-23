import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { BRAND_MARK } from '@/lib/brand';
import { THREE } from './stage';

/**
 * The mark's three blades (src/lib/brand.ts) as solids, the lime one first: centred on the origin,
 * `width` across, `depth` deep with a rounded `bevel`, standing on z = 0 and facing +z.
 */
export function bladeGeometries(width: number, depth: number, bevel: number) {
  const { box } = BRAND_MARK;
  const k = width / box.w;
  return BRAND_MARK.paths.map(d => {
    const svg = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
    const shapes = svg.paths.flatMap(p => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: depth / k,
      bevelEnabled: true,
      bevelThickness: bevel / k,
      bevelSize: (bevel * 0.6) / k,
      bevelSegments: 6,
      curveSegments: 10,
    });
    geo.translate(-(box.x + box.w / 2), -(box.y + box.h / 2), 0);
    // SVG's y runs down: turn it over about x (a rotation, so the faces stay outward), which also
    // sends the extrusion backwards — bring it forward again
    geo.scale(k, -k, -k);
    geo.translate(0, 0, depth + bevel);
    return geo;
  });
}
