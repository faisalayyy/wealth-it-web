import type { NextConfig } from 'next';

/**
 * Static export, because the host is GitHub Pages and there is no server in this product's
 * world — not for the app, and not for the site that argues for it.
 *
 * `basePath` is the project-site subdirectory. Next rewrites its own asset and <Link> URLs
 * through it automatically; anything written by hand (a font URL in CSS, an <img src>) has to
 * go through `asset()` in `src/lib/asset.ts` instead. On the day there is a real domain, both
 * lines below come out and `asset()` becomes the identity function.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/wealth-it-web';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
