import type { CSSProperties } from 'react';
import type { CropName, ScreenName } from '@/lib/screens';
import { asset } from '@/lib/site';
import { FlutedGlass } from './FlutedGlass';
import { Mark } from './Logo';
import { Phone } from './Phone';
import { Crop } from './Screen';
import s from './Media.module.css';

/**
 * Where the reference shows a photograph, the site shows the app: real captures standing in a
 * coloured panel, sized to whatever frame they are given (container units, so one panel works as
 * a full-bleed band or a thumbnail), or a crop cut from a capture, filling its frame. Pages about
 * the company rather than the app use the brand instead: fluted glass, the mark, or a person's
 * initials where a portrait will go.
 */
type Ground = 'lime' | 'ink' | 'pale';
export type MediaSpec =
  | { screens: ScreenName[]; ground?: Ground }
  | { crop: CropName; alt: string }
  | { brand: 'glass' | 'mark'; ground?: Ground }
  | { initials: string; name: string; ground?: Ground }
  /** a photograph in public/<photo>-{800,1400,2000}.{avif,webp}, filling its frame */
  | { photo: string; alt: string; width: number; height: number };

export function Media({ spec, className, sizes = '(max-width: 743px) 40vw, 20vw' }: { spec: MediaSpec; className?: string; sizes?: string }) {
  if ('crop' in spec) return <Crop name={spec.crop} alt={spec.alt} className={`${s.crop} ${className ?? ''}`} />;
  if ('brand' in spec)
    return (
      <div className={`${s.panel} ${className ?? ''}`} data-ground={spec.ground ?? 'lime'} aria-hidden>
        {spec.brand === 'glass' ? <FlutedGlass /> : <Mark className={s.mark} />}
      </div>
    );
  if ('photo' in spec) {
    const set = (ext: string) => [800, 1400, 2000].map(w => `${asset(`/${spec.photo}-${w}.${ext}`)} ${w}w`).join(', ');
    return (
      <picture className={`${s.crop} ${className ?? ''}`}>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <img src={asset(`/${spec.photo}-1400.webp`)} srcSet={set('webp')} sizes={sizes} width={spec.width} height={spec.height} alt={spec.alt} loading="lazy" decoding="async" />
      </picture>
    );
  }
  if ('initials' in spec)
    return (
      <div className={`${s.panel} ${className ?? ''}`} data-ground={spec.ground ?? 'lime'} role="img" aria-label={`${spec.name}, portrait to come`}>
        <span className={s.initials}>{spec.initials}</span>
      </div>
    );
  return (
    <div className={`${s.panel} ${className ?? ''}`} data-ground={spec.ground ?? 'pale'} style={{ '--n': spec.screens.length } as CSSProperties}>
      {spec.screens.map(sc => (
        <Phone key={sc} screen={sc} variant="device" sizes={sizes} className={s.phone} />
      ))}
    </div>
  );
}
