import type { NextConfig } from 'next';

/**
 * A static export, served by GitHub Pages at https://wealthit.app — the domain's root, so there is
 * no base path. `PAGES_BASE_PATH` is still read, for building a copy that lives in a subdirectory.
 */
const base = process.env.PAGES_BASE_PATH ?? '';

const config: NextConfig = {
  output: 'export',
  basePath: base,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: base },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
