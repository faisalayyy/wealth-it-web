'use client';

import { CommonHeader } from '@/components/CommonHeader';
import { ContactButton } from '@/components/Contact';
import { ThreeCanvas } from '@/three/ThreeCanvas';

/**
 * The About page's first screen: the common header over the flipping slabs (the reference's
 * company video, live), with the way to get in touch. The slabs fade up once they have loaded.
 */
export function AboutHeader({ title, description }: { title: string[]; description: string }) {
  return (
    <CommonHeader
      title={title}
      description={description}
      cta={<ContactButton label="Get in touch" />}
      background={({ ready, className }) => <ThreeCanvas scene="slabs" className={className} onReady={ready} />}
    />
  );
}
