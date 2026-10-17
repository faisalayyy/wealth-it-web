import type { Media } from '@/lib/features';
import { Phone } from './Phone';
import { PhoneVideo } from './PhoneVideo';
import { Crop, Cut } from './Screen';
import { TapPhone } from './TapPhone';
import s from './Shot.module.css';

/**
 * Whatever a block shows, from the app's captures: one screen or a few in phones, a screen
 * recording playing in a phone, a piece cut from the app's own artwork, or a rectangle cut from a
 * screen — all real, none redrawn.
 */
export function Shot({ media, sizes = '(max-width: 743px) 64vw, 320px', className }: { media: Media; sizes?: string; className?: string }) {
  if ('tap' in media) {
    return (
      <div className={`${s.phones} ${className ?? ''}`}>
        <TapPhone className={s.phone} sizes={sizes} />
      </div>
    );
  }
  if ('video' in media) {
    return (
      <div className={`${s.phones} ${className ?? ''}`}>
        <PhoneVideo name={media.video} label={media.label} className={s.phone} />
      </div>
    );
  }
  if ('screen' in media) {
    return (
      <div className={`${s.phones} ${className ?? ''}`}>
        <Phone screen={media.screen} variant="device" className={s.phone} sizes={sizes} />
      </div>
    );
  }
  if ('screens' in media) {
    return (
      <div className={`${s.phones} ${className ?? ''}`} data-count={media.screens.length}>
        {media.screens.map((sc, i) => (
          <Phone key={sc} screen={sc} variant="device" className={s.phone} sizes={sizes} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
    );
  }
  if ('cut' in media) {
    return (
      <div className={`${s.cuts} ${className ?? ''}`}>
        <Cut name={media.cut} className={s.cut} />
      </div>
    );
  }
  if ('cuts' in media) {
    return (
      <div className={`${s.cuts} ${s.stack} ${className ?? ''}`}>
        {media.cuts.map((c, i) => (
          <Cut key={c} name={c} className={s.cut} />
        ))}
      </div>
    );
  }
  return (
    <div className={`${s.cuts} ${className ?? ''}`}>
      <Crop name={media.crop} className={s.cut} />
    </div>
  );
}
