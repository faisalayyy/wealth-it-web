'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/animation/gsap';
import { Icon } from '@/components/Icon';
import { Tag } from '@/components/Tag';
import s from './Currencies.module.css';

/**
 * Currencies. A wallet can hold any of eight; totals convert only at a rate the app can stand
 * behind. The converter here uses the one rate that never needs fetching — the dirham's peg to the
 * dollar, 3.6725 since 1997 — which is also the rate the app falls back to between those two.
 */
const PEG = 3.6725;
const fmt = (n: number) => (Number.isFinite(n) ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '');

function Converter() {
  const [amount, setAmount] = useState('100');
  const [swapped, setSwapped] = useState(false);
  const from = swapped ? { code: 'AED', name: 'UAE Dirham', sym: 'dirham' } : { code: 'USD', name: 'US Dollar', sym: '$' };
  const to = swapped ? { code: 'USD', name: 'US Dollar', sym: '$' } : { code: 'AED', name: 'UAE Dirham', sym: 'dirham' };
  const n = parseFloat(amount.replace(/,/g, ''));
  const result = swapped ? n / PEG : n * PEG;

  const Chip = ({ c }: { c: typeof from }) => (
    <span className={s.chip}>
      <span className={s.coin} data-code={c.code}>
        {c.sym === 'dirham' ? (
          <svg viewBox="0 0 17 24" aria-hidden>
            <path d="M7 2.5v19M7 2.5h5a9.5 9.5 0 0 1 0 19H7M1.5 9.5h14M1.5 14.5h14" />
          </svg>
        ) : (
          c.sym
        )}
      </span>
      <span className="-medium">{c.code}</span>
      <span className={s.chipName}>{c.name}</span>
    </span>
  );

  return (
    <div className={s.converter}>
      <label className={s.field}>
        <Chip c={from} />
        <span className={s.amountRow}>
          <input
            className={`${s.input} subhead-1 -medium`}
            inputMode="decimal"
            value={amount}
            aria-label={`Amount in ${from.code}`}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, '').slice(0, 12))}
          />
        </span>
      </label>
      <div className={s.swapRow}>
        <button type="button" className={s.swap} data-swapped={swapped} onClick={() => setSwapped(v => !v)} aria-label="Swap currencies">
          <Icon name="swap" size={20} />
        </button>
      </div>
      <div className={s.field} aria-live="polite">
        <Chip c={to} />
        <span className={`${s.output} subhead-1 -medium`}>{amount ? fmt(result) : '0.00'}</span>
      </div>
      <p className={`${s.rate} caption`}>1 USD = {PEG} AED · the published peg</p>
    </div>
  );
}

export function Currencies() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let physics: Awaited<ReturnType<typeof import('@/animation/coins')['coins']>> | null = null;
    const triggers: ScrollTrigger[] = [];
    let cancelled = false;
    const font = getComputedStyle(document.body).fontFamily;
    const load = async () => {
      const { coins } = await import('@/animation/coins');
      if (cancelled) return;
      physics = coins({ section: root.current!, canvas: canvas.current!, obstacles: [card.current!], font });
      triggers.push(
        ScrollTrigger.create({ trigger: root.current, start: 'top top', once: true, onEnter: () => physics?.start() }),
        ScrollTrigger.create({ trigger: root.current, start: 'top center', end: 'bottom center', onToggle: self => self.isActive && physics?.bump(self.getVelocity()) }),
        ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: self => physics?.visible(self.isActive) }),
      );
      ScrollTrigger.addEventListener('refresh', () => physics?.resize());
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          void load();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(root.current!);
    return () => {
      cancelled = true;
      io.disconnect();
      triggers.forEach(t => t.kill());
      physics?.destroy();
    };
  }, []);

  return (
    <section ref={root} className={s.section} id="currencies" aria-labelledby="currencies-title" data-ground="light">
      <canvas ref={canvas} className={s.canvas} aria-hidden />
      <div className={s.head}>
        <Tag>Currencies</Tag>
        <h2 id="currencies-title" className="title-3 xs-title-4 -medium">
          Eight currencies,{'\n'}one honest total.
        </h2>
        <div className={`${s.disclaimer} caption -book`}>
          <p>
            *Converts at the AED/USD peg of {PEG}, fixed since 1997 — the rate the app uses between those two when you
            haven&rsquo;t recorded one of your own. Every other rate is one you actually got, or the day&rsquo;s published
            rate; nothing is ever guessed.
          </p>
        </div>
      </div>
      <div ref={card} className={s.converterBox}>
        <Converter />
      </div>
      <div className={s.after} />
    </section>
  );
}
