import { crop, cut, describe, screenSources, SCREEN_H, SCREEN_W, type CropName, type CutName, type ScreenName } from '@/lib/screens';

/** One capture from the app, resized and never retouched. AVIF first, WebP behind it. */
export function Screen({
  name,
  sizes = '(max-width: 743px) 70vw, 400px',
  priority = false,
  alt,
  className,
  ...rest
}: {
  name: ScreenName;
  sizes?: string;
  priority?: boolean;
  alt?: string;
  className?: string;
  [data: `data-${string}`]: string | undefined;
}) {
  const src = screenSources(name);
  return (
    <picture className={className} {...rest}>
      <source type="image/avif" srcSet={src.avif} sizes={sizes} />
      <source type="image/webp" srcSet={src.webp} sizes={sizes} />
      <img
        src={src.fallback}
        width={SCREEN_W}
        height={SCREEN_H}
        alt={alt ?? `Wealthit: ${describe(name)}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

/** A rectangle cut from a capture. */
export function Crop({ name, alt = '', className, lazy = true }: { name: CropName; alt?: string; className?: string; lazy?: boolean }) {
  const c = crop(name);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={c.avif} />
      <img src={c.webp} width={c.width} height={c.height} alt={alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" draggable={false} />
    </picture>
  );
}

/** One of the pieces the app's captures were cut into — a sheet, a row, a notification — at its own shape. */
export function Cut({ name, className, sizes = '(max-width: 743px) 90vw, 560px', lazy = true, alt }: { name: CutName; className?: string; sizes?: string; lazy?: boolean; alt?: string }) {
  const c = cut(name);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={c.avif} sizes={sizes} />
      <source type="image/webp" srcSet={c.webp} sizes={sizes} />
      <img src={c.fallback} width={c.width} height={c.height} alt={alt ?? c.alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" draggable={false} />
    </picture>
  );
}
