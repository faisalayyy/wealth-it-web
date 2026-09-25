'use client';

/**
 * CHAPTER 01 — THE PRESENT.
 *
 * The signature interaction, and the only one the site really needs to get right.
 *
 * The figure is not typed into the markup. It is `balanceAt(t)` — the same arithmetic the app
 * performs — and the reader's pointer *is* `t`. Moving across the hero moves through the
 * recorded year: the digits recount, the date under them changes, and every transaction in the
 * field behind loses its colour the moment it stops having happened yet. Nothing is being
 * played back; the number is being derived, sixty times a second, in front of you.
 *
 * That is the whole argument of the product expressed as a gesture, which is the only reason
 * it is worth the WebGL behind it.
 *
 * It works without a pointer: arrow keys move a day, shift a month, home and end the ends of
 * the year. It works without JavaScript: the server renders today's balance and the sentence
 * that explains it. It works without WebGL: the axis and the readout are DOM.
 */

import { useCallback, useEffect, useRef } from 'react';
import { BALANCE_TODAY, LEDGER, SPAN, balanceAt, labelDate, split } from '@/lib/ledger';
import { CHAPTERS } from '@/lib/content';
import { clamp } from '@/lib/format';
import { dayToFrac, fracToDay } from '@/webgl/mapping';
import { useFieldState } from '@/webgl/state';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Hero.module.css';

const CH = CHAPTERS[0]!;
const MONTH_TICKS = Array.from({ length: 13 }, (_, i) => -365 + Math.round((i * 365) / 12));

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const intRef = useRef<HTMLSpanElement>(null);
  const decRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const day = useRef(0);
  const field = useFieldState();
  const reduced = useReducedMotion();

  /** Write the readout straight to the DOM. Sixty React renders a second to move six digits
   *  would be the most expensive way imaginable of doing nothing. */
  const paint = useCallback((t: number) => {
    day.current = t;
    const { int, dec } = split(balanceAt(t));
    if (intRef.current) intRef.current.textContent = int;
    if (decRef.current) decRef.current.textContent = `.${dec}`;
    if (dateRef.current) dateRef.current.textContent = t === 0 ? 'today' : labelDate(t);
    field.current.cursor = t / -SPAN.past;
    if (ruleRef.current) ruleRef.current.style.setProperty('--at', `${dayToFrac(t) * 100}%`);
  }, [field]);

  /* The opening: the transactions are packed into the shape of the figure, then leave it for
     their real places in the year. The number is assembled from them, and then outlives them. */
  useEffect(() => {
    const s = field.current;
    if (reduced) { s.reveal = 1; s.phase = 1; paint(0); return; }
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(s, { reveal: 1, duration: 1.1, ease: 'none' })
      .to(s, { phase: 1, duration: 1.9, ease: 'power3.inOut' }, 0.55);
    paint(0);
    return () => { tl.kill(); };
  }, [field, reduced, paint]);

  /* The pointer is the cursor in time. */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      paint(clamp(fracToDay((e.clientX - r.left) / r.width), SPAN.past, 0));
    };
    const onLeave = () => {
      /* Let go and the year settles back on today, rather than freezing wherever the hand
         happened to leave it. */
      gsap.to({ v: day.current }, {
        v: 0, duration: 0.9, ease: 'expo.out',
        onUpdate() { paint(Math.round(this.targets()[0].v)); },
      });
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [paint]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 30 : 1;
    const map: Record<string, number> = {
      ArrowLeft: day.current - step, ArrowRight: day.current + step,
      Home: SPAN.past, End: 0,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    paint(clamp(next, SPAN.past, 0));
  };

  const today = split(BALANCE_TODAY);

  return (
    <section
      ref={section}
      id={CH.id}
      className={styles.hero}
      data-cursor="scrub"
      data-cursor-label="drag through the year"
    >
      <div className={styles.readout}>
        <p className={`mono ${styles.eyebrow}`}>Total balance · AED</p>

        {/* The accessible truth of this element is a single figure with a date. Everything
            else here is the same fact, moving. */}
        <h1
          className={styles.figure}
          tabIndex={0}
          role="slider"
          aria-label="Balance through the recorded year. Use the arrow keys to move through time."
          aria-valuemin={SPAN.past}
          aria-valuemax={0}
          aria-valuenow={0}
          aria-valuetext={`${today.int}.${today.dec} dirhams, today`}
          onKeyDown={onKey}
        >
          <span ref={intRef} className={`fig ${styles.int}`}>{today.int}</span>
          <span ref={decRef} className={`fig ${styles.dec}`}>.{today.dec}</span>
        </h1>

        <p className={`mono ${styles.date}`}>
          <span ref={dateRef}>today</span>
          <span className={styles.sep} aria-hidden="true">/</span>
          <span>derived from {LEDGER.length} transactions</span>
        </p>
      </div>

      {/* The axis. It exists so the gesture has something to read against — a scrub over a
          void is a number changing for no reason. */}
      <div ref={ruleRef} className={styles.axis} aria-hidden="true">
        <div className={styles.axisLine} />
        <div className={styles.cursorRule} />
        {MONTH_TICKS.map((t, i) => (
          <span key={t} className={`mono ${styles.tick}`} style={{ left: `${dayToFrac(t) * 100}%` }}>
            {i % 3 === 0 ? labelDate(t).slice(3, 6) : ''}
          </span>
        ))}
      </div>

      <div className={styles.legend}>
        <p className={styles.claim}>{CH.title.join(' ')}</p>
        <p className={styles.body}>{CH.body}</p>
      </div>

      <p className={`mono ${styles.hint}`} aria-hidden="true">
        <span className={styles.hintRule} />
        {CH.aside}
      </p>
    </section>
  );
}
