'use client';

import { AppButtons } from '@/components/AppButtons';
import { CommonHeader } from '@/components/CommonHeader';
import { ThreeCanvas } from '@/three/ThreeCanvas';

/**
 * The homepage's first screen: the common header with the coins moving through the ground, what
 * the app is in one line, and the store buttons. The 3D fades up once it has loaded.
 */
export function Hero() {
  return (
    <CommonHeader
      id="top"
      title={['Know where', 'you stand.']}
      description="Every wallet, every budget, and all of it on your phone."
      cta={<AppButtons />}
      background={({ ready, className }) => <ThreeCanvas scene="discs" className={className} onReady={ready} />}
    />
  );
}
