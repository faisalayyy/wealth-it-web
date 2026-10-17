'use client';

import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '@/animation/gsap';
import { asset } from '@/lib/site';
import { themedVideo, useTheme } from '@/lib/theme';
import { Phone } from './Phone';
import s from './PhoneVideo.module.css';

/**
 * A screen recording of the app, playing inside the phone: muted, looping, inline, and only while
 * it is on screen (it pauses off screen, and loads nothing until it is near). With reduced motion
 * it waits on its first frame until tapped. The frames are the app's own, only resized
 * (scripts/video.swift).
 */
export function PhoneVideo({ name, label, className, poster }: { name: string; label: string; className?: string; poster?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const file = themedVideo(name, useTheme());

  useEffect(() => {
    const el = video.current!;
    const still = reducedMotion();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        if (still) return;
        if (e.intersectionRatio > 0.35) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: [0, 0.35], rootMargin: '30% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current!;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <Phone variant="device" className={className}>
      <video
        ref={video}
        className={s.video}
        src={near ? asset(`/videos/${file}.mp4`) : undefined}
        poster={asset(`/videos/${poster ?? file}.jpg`)}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className={s.toggle} onClick={toggle} aria-label={playing ? `Pause: ${label}` : `Play: ${label}`} data-playing={playing ? '' : undefined}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          {playing ? <path d="M8 6h3v12H8zM13 6h3v12h-3z" /> : <path d="M8 5.5v13l10.5-6.5z" />}
        </svg>
      </button>
    </Phone>
  );
}
