'use client';

import { AppButtons } from '@/components/AppButtons';
import { CommonHeader } from '@/components/CommonHeader';
import { ThreeCanvas } from '@/three/ThreeCanvas';

/** A feature page's first screen: the common header with the homepage's coins, and the store buttons. */
export function FeatureHeader({ title, description }: { title: string[]; description: string }) {
  return (
    <CommonHeader
      title={title}
      description={description}
      cta={<AppButtons />}
      background={({ ready, className }) => <ThreeCanvas scene="discs" className={className} onReady={ready} />}
    />
  );
}
