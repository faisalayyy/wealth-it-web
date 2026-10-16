import type { CSSProperties, ReactNode } from 'react';
import type { ScreenName } from '@/lib/screens';
import { Screen } from './Screen';
import s from './Phone.module.css';

/**
 * A phone drawn around a real capture. `glass` is the translucent, frosted frame the walkthrough
 * uses on the brand ground; `device` is a plain dark frame. Width comes from `--w`; everything
 * else follows from it in container units. Children are laid over the screen.
 */
export function Phone({
  screen,
  variant = 'glass',
  alt,
  sizes,
  priority,
  className,
  style,
  children,
}: {
  screen?: ScreenName;
  variant?: 'glass' | 'device';
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={`${s.phone} ${className ?? ''}`} data-variant={variant} style={style}>
      <div className={s.frame}>
        <div className={s.screen}>
          {screen && <Screen name={screen} alt={alt} sizes={sizes} priority={priority} className={s.shot} />}
          {children}
          <span className={s.island} aria-hidden />
        </div>
      </div>
    </div>
  );
}

/** A capture stacked over the phone's own, for moving between screens. */
export function ScreenLayer({ screen, className, sizes, ...rest }: { screen: ScreenName; className?: string; sizes?: string; [data: `data-${string}`]: string | undefined }) {
  return <Screen name={screen} sizes={sizes} alt="" className={`${s.layer} ${className ?? ''}`} {...rest} />;
}
