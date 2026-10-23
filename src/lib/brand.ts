/**
 * The brand's shapes, from the app, for the places the site draws them itself.
 */

/**
 * The mark (App/src/ui/brandMark.ts, A418, final drawing A422): Faisal's three blades, the first
 * upright and lime, the next two leaning 17° and 30°, each standing a step higher, every corner
 * rounded. The figures are the app's (`brand/source/blades.json` on its 100-unit grid), drawn here as
 * outlines: each blade's inset quad grown by its corner radius. `box` is the mark's own box on the
 * grid, so a viewBox of it fits the mark exactly; `blade` is one blade's width, the unit of its clear
 * space and of the gap before the name.
 */
export const BRAND_MARK = {
  box: { x: 0, y: 3.62, w: 100, h: 92.76 },
  blade: 19.185,
  paths: [
    'M0.803 82.49L16.124 93.524A1.932 1.932 0 0 0 19.185 91.956L19.185 20.361A1.932 1.932 0 0 0 18.483 18.871L3.162 6.229A1.932 1.932 0 0 0 0 7.72L0 80.922A1.932 1.932 0 0 0 0.803 82.49Z',
    'M24.69 78.982L36.607 93.568A1.932 1.932 0 0 0 39.954 92.903L56.944 36.595A1.932 1.932 0 0 0 56.668 34.916L45.166 18.763A1.932 1.932 0 0 0 41.741 19.328L24.336 77.203A1.932 1.932 0 0 0 24.69 78.982Z',
    'M52.72 73.139L60.467 90.345A1.932 1.932 0 0 0 63.904 90.515L99.547 28.591A1.932 1.932 0 0 0 99.682 26.952L92.74 8.348A1.932 1.932 0 0 0 89.255 8.06L52.807 71.381A1.932 1.932 0 0 0 52.72 73.139Z',
  ],
} as const;

/** The mark's box as an SVG viewBox. */
export const MARK_VIEWBOX = `${BRAND_MARK.box.x} ${BRAND_MARK.box.y} ${BRAND_MARK.box.w} ${BRAND_MARK.box.h}`;

/**
 * The spending ring's slices, in the order the app draws the built-in groups whatever their amounts
 * (App/src/data/palette.ts, RING_ORDER), each in its Opal colour as the app shows it in dark (A433):
 * share of the month and colour.
 */
export const CHART = [
  { share: 12, color: '#7BA0D6' }, // Housing, blue
  { share: 34, color: '#B9D794' }, // Food & Drink, leaf
  { share: 15, color: '#CA99D6' }, // Life & Entertainment, lilac
  { share: 20, color: '#E8E0AA' }, // Transportation, cream
  { share: 11, color: '#E5A3C7' }, // Shopping, pink
  { share: 8, color: '#9ADFE8' }, // Communication, PC, aqua
] as const;
