import localFont from 'next/font/local';

/**
 * The display face, self-hosted through `next/font/local`.
 *
 * Self-hosted because a site whose argument is that nothing leaves your phone should not open
 * by asking Google for a typeface. Through `next/font` rather than a hand-written @font-face
 * because it emits the right URL under a base path, preloads without being told twice, and
 * generates a metric-matched fallback so the first paint does not jump when the real face
 * lands. Four weights, subset to Latin, 46 KB in total. OFL licence in `src/fonts/OFL.txt`.
 */
export const display = localFont({
  src: [
    { path: '../fonts/plus-jakarta-sans-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/plus-jakarta-sans-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/plus-jakarta-sans-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/plus-jakarta-sans-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
