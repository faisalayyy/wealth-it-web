/**
 * Paths that Next does not rewrite for us.
 *
 * `<Link>`, `next/image` and the framework's own bundles all pick up `basePath` on their own.
 * A URL written by hand — a font in a stylesheet, a preload, an og:image — does not, and a bare
 * `/fonts/x.woff2` on a project site is a request to somebody else's page. Everything of that
 * kind goes through here. On a real domain `NEXT_PUBLIC_BASE_PATH` is empty and this returns
 * exactly what it was given.
 */
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

export const asset = (path: string) => `${base}${path}`;
export const BASE_PATH = base;
