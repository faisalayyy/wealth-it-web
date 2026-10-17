import manifest from './screens.json';
import sizes from './screens.sizes.json';
import { asset } from './site';

/**
 * Typed access to the captures in screens.json: whole screens, the app's own cut pieces, and
 * crops cut from screens. Sizes of cuts and crops come from screens.sizes.json, which
 * scripts/screens.mjs writes.
 */
export type ScreenName = keyof typeof manifest.screens;
export type CutName = keyof typeof manifest.cuts;
export type CropName = keyof typeof manifest.crops;

export const DEVICE = manifest.device; // points: 440 × 956 at 3x
export const SCREEN_W = DEVICE.w * DEVICE.scale;
export const SCREEN_H = DEVICE.h * DEVICE.scale;
export const describe = (name: ScreenName) =>
  manifest.screens[name] ?? (manifest.screens as Record<string, string>)[name.replace(/-light$/, '-dark')];

export function screenSources(name: ScreenName) {
  const b = asset(`/screens/${name}`);
  return {
    avif: `${b}-420.avif 420w, ${b}-840.avif 840w, ${b}-1320.avif 1320w`,
    webp: `${b}-420.webp 420w, ${b}-840.webp 840w, ${b}-1320.webp 1320w`,
    fallback: `${b}-840.webp`,
    /** a single URL for a texture (Three.js) */
    texture: `${b}-840.webp`,
    thumb: `${b}-420.webp`,
  };
}

export function cut(name: CutName) {
  const c = manifest.cuts[name];
  const s = (sizes.cuts as Record<string, { w: number; h: number }>)[name];
  const b = asset(`/screens/cuts/${name}`);
  return {
    alt: c.alt,
    width: s.w,
    height: s.h,
    avif: `${b}-640.avif 640w, ${b}-1280.avif 1280w`,
    webp: `${b}-640.webp 640w, ${b}-1280.webp 1280w`,
    fallback: `${b}-1280.webp`,
  };
}

export function crop(name: CropName) {
  const c = manifest.crops[name];
  const b = asset(`/screens/crops/${name}`);
  // every crop cut from a dark screen has a twin cut from the light one (scripts/screens.mjs)
  const light = c.from.endsWith('-dark') ? { avif: `${b}-light.avif`, webp: `${b}-light.webp` } : null;
  return { ...c, avif: `${b}.avif`, webp: `${b}.webp`, light, width: c.w * 2, height: c.h * 2 };
}

/** The light twin of a dark capture, for the light theme. */
export const lightTwin = (name: ScreenName) => (name.endsWith('-dark') ? (name.replace(/-dark$/, '-light') as ScreenName) : name);
