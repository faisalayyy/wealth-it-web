/**
 * The brand's shapes, from the app, for the places the site draws them itself.
 */

/**
 * The mark (App/src/ui/brandMark.ts, A365) on its 100-unit grid: the two leaves as paths (each two
 * arcs meeting in sharp tips) and the coin.
 */
export const BRAND_MARK = {
  viewBox: '0 0 100 100',
  paths: [
    'M42.750 78.400A40.986 40.986 0 0 1 13.339 33.112A40.986 40.986 0 0 1 42.750 78.400Z',
    'M57.250 78.400A40.986 40.986 0 0 1 86.661 33.112A40.986 40.986 0 0 1 57.250 78.400Z',
  ],
  coin: { cx: 50, cy: 32.4, r: 10.8 },
} as const;

/** The spending ring's slices: share of the month and the category's colour (App/src/data/categories.ts). */
export const CHART = [
  { share: 34, color: '#D9A066' }, // Food & Drink
  { share: 20, color: '#6FA8B8' }, // Transportation
  { share: 15, color: '#B889B0' }, // Life & Entertainment
  { share: 12, color: '#8E9BC4' }, // Housing
  { share: 11, color: '#C4B36A' }, // Shopping
  { share: 8, color: '#6FBFA0' }, // Communication, PC
] as const;
