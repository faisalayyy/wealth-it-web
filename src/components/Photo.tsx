import { asset } from '@/lib/site';

/**
 * A photograph (public/people, from media-src/people via scripts/compose.mjs; credits in
 * media-src/people/CREDITS.md), AVIF first, at two widths.
 */
export function Photo({ name, alt, className, sizes = '(max-width: 743px) 100vw, 50vw', lazy = true, width = 1800, height, focus }: { name: string; alt: string; className?: string; sizes?: string; lazy?: boolean; width?: number; height: number; /** object-position, where a cropped photo should keep its subject */ focus?: string }) {
  const b = asset(`/people/${name}`);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={`${b}-900.avif 900w, ${b}-1800.avif 1800w`} sizes={sizes} />
      <img src={`${b}-1800.webp`} srcSet={`${b}-900.webp 900w, ${b}-1800.webp 1800w`} sizes={sizes} width={width} height={height} alt={alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" style={focus ? { objectPosition: focus } : undefined} />
    </picture>
  );
}
