'use client';

/**
 * CHAPTERS 04 & 05 — WHAT IS NEXT, and THE DECISION.
 *
 * One object, two beats, and deliberately not two sections. The reader meets the projection,
 * and then is handed the control to it — so the thing they are adjusting is visibly the thing
 * they were just reading, rather than a fresh widget that appeared to demonstrate a feature.
 *
 * It is drawn in SVG rather than WebGL, and that is a decision rather than a shortcut. This
 * chart has to carry exact figures, a legible goal line, a focusable control and a label a
 * screen reader can announce. WebGL would make all four worse in exchange for nothing the
 * reader would notice.
 *
 * The honest part: the future is a band, not a line, and the band widens the further out it
 * goes. The app refuses to invent a rate it does not have; the site refuses to draw a
 * confidence it does not have. Same conviction, different medium.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BALANCE_TODAY, CURVE, DISCRETIONARY_MONTH, GOAL,
  daysToGoal, labelMonth, money0, project,
} from '@/lib/ledger';
import { CHAPTERS } from '@/lib/content';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { clamp } from '@/lib/format';
import styles from './Projection.module.css';

const NEXT = CHAPTERS[3]!;
const DECIDE = CHAPTERS[4]!;

const W = 1000, H = 440, PAD = 28;
const PAST = 150, AHEAD = 520;
const RANGE = { min: DISCRETIONARY_MONTH - 1800, max: DISCRETIONARY_MONTH + 1800 };

const xOf = (t: number) => PAD + ((t + PAST) / (PAST + AHEAD)) * (W - PAD * 2);

export function Projection() {
  const section = useRef<HTMLDivElement>(null);
  const [spend, setSpend] = useState(DISCRETIONARY_MONTH);
  const [beat, setBeat] = useState(0);
  const reduced = useReducedMotion();
  const pending = useRef<number | null>(null);

  /* Drag events arrive faster than frames. Coalesce to one recompute per frame. */
  const onInput = useCallback((v: number) => {
    pending.current = v;
    requestAnimationFrame(() => {
      if (pending.current !== null) { setSpend(pending.current); pending.current = null; }
    });
  }, []);

  const path = project(spend, AHEAD);
  const recorded = CURVE.slice(-PAST);
  const all = [...recorded.map(p => p.v), ...path.map(p => p.hi), ...path.map(p => p.lo), GOAL];
  const yMin = Math.min(...all) * 0.92;
  const yMax = Math.max(...all) * 1.04;
  const yOf = (v: number) => H - PAD - ((v - yMin) / (yMax - yMin)) * (H - PAD * 2);

  const pastPath = recorded.map((p, i) => `${i ? 'L' : 'M'}${xOf(p.t).toFixed(1)} ${yOf(p.v).toFixed(1)}`).join('');
  const midPath = `M${xOf(0).toFixed(1)} ${yOf(BALANCE_TODAY).toFixed(1)}` +
    path.map(p => `L${xOf(p.t).toFixed(1)} ${yOf(p.mid).toFixed(1)}`).join('');
  const band =
    `M${xOf(0).toFixed(1)} ${yOf(BALANCE_TODAY).toFixed(1)}` +
    path.map(p => `L${xOf(p.t).toFixed(1)} ${yOf(p.hi).toFixed(1)}`).join('') +
    [...path].reverse().map(p => `L${xOf(p.t).toFixed(1)} ${yOf(p.lo).toFixed(1)}`).join('') + 'Z';

  const hitDay = daysToGoal(spend);
  const months = hitDay ? hitDay / 30.44 : null;
  const baselineMonths = (daysToGoal(DISCRETIONARY_MONTH) ?? 0) / 30.44;
  const delta = months === null ? 0 : baselineMonths - months;

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    if (reduced) { setBeat(1); return; }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=190%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        /* One number drives both beats: the band draws, then the control is handed over. */
        onUpdate: self => setBeat(self.progress),
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  /* Beat 1 draws the band; beat 2 is the control arriving. Both are a function of `beat`,
     so scrubbing backwards undoes them exactly. */
  const draw = clamp(beat / 0.45, 0, 1);
  const handOver = clamp((beat - 0.5) / 0.3, 0, 1);

  return (
    <div ref={section} id={NEXT.id} className={styles.pin}>
      <section className={styles.inner}>
        <header className={styles.head}>
          <div>
            <span className={`mono ${styles.index}`}>{handOver > 0.5 ? DECIDE.index : NEXT.index}</span>
            <span className={`mono ${styles.kicker}`}>{handOver > 0.5 ? DECIDE.kicker : NEXT.kicker}</span>
          </div>
          <h2 className={styles.title} key={handOver > 0.5 ? 'b' : 'a'}>
            {(handOver > 0.5 ? DECIDE : NEXT).title.join(' ')}
          </h2>
          <p className={styles.body}>{(handOver > 0.5 ? DECIDE : NEXT).body}</p>
        </header>

        <figure className={styles.chartWrap}>
          <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img"
               aria-label={`Projected balance. At ${money0(spend)} dirhams of discretionary spending a month, ${money0(GOAL)} is reached in ${months?.toFixed(1) ?? 'more than four years'} months.`}>
            <defs>
              {/* An estimate is hatched. It must never be able to pass for a recorded fact. */}
              <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="7" stroke="var(--est)" strokeWidth="1.4" opacity=".4" />
              </pattern>
              <clipPath id="reveal">
                <rect x="0" y="0" width={xOf(0) + (W - xOf(0)) * draw} height={H} />
              </clipPath>
            </defs>

            {/* the goal */}
            <line x1={PAD} y1={yOf(GOAL)} x2={W - PAD} y2={yOf(GOAL)} className={styles.goalLine} />
            <text x={W - PAD} y={yOf(GOAL) - 10} className={`${styles.goalLabel} mono`} textAnchor="end">
              goal · {money0(GOAL)}
            </text>

            <g clipPath="url(#reveal)">
              <path d={band} fill="url(#hatch)" stroke="none" />
              <path d={midPath} className={styles.mid} />
            </g>

            {/* what actually happened */}
            <path d={pastPath} className={styles.past} />

            {/* today */}
            <line x1={xOf(0)} y1={PAD - 12} x2={xOf(0)} y2={H - PAD} className={styles.today} />
            <text x={xOf(0) + 8} y={PAD - 2} className={`${styles.todayLabel} mono`}>today</text>

            {hitDay && draw > 0.9 && (
              <g className={styles.hit} style={{ opacity: draw }}>
                <circle cx={xOf(hitDay)} cy={yOf(GOAL)} r="5" />
                <text x={xOf(hitDay)} y={yOf(GOAL) + 26} className="mono" textAnchor="middle">
                  {labelMonth(hitDay)}
                </text>
              </g>
            )}
          </svg>
          <figcaption className={`mono ${styles.caption}`}>
            Recorded to the left of today. Hatched to the right, because nobody knows.
          </figcaption>
        </figure>

        {/* The control. Present in the markup from the start so a keyboard can always reach it;
            it simply is not yet lit when the reader has not been introduced to it. */}
        <div className={styles.control} style={{ opacity: handOver, pointerEvents: handOver > 0.6 ? 'auto' : 'none' }}>
          <div className={styles.controlRow}>
            <label htmlFor="spend" className={`mono ${styles.controlLabel}`}>
              Discretionary spending, a month
            </label>
            <output className={`fig ${styles.controlValue}`} htmlFor="spend" data-moved={spend !== DISCRETIONARY_MONTH}>
              {money0(spend)}
            </output>
          </div>

          <input
            id="spend"
            className={styles.range}
            type="range"
            min={RANGE.min}
            max={RANGE.max}
            step={25}
            value={spend}
            data-cursor="drag"
            data-cursor-label={DECIDE.aside}
            onChange={e => onInput(Number(e.target.value))}
            aria-describedby="spend-outcome"
          />

          <p id="spend-outcome" className={styles.outcome}>
            {months === null ? (
              <>At this rate, <strong>{money0(GOAL)}</strong> is more than four years away.</>
            ) : (
              <>
                <strong>{money0(GOAL)}</strong> in <strong className={styles.months}>{months.toFixed(1)} months</strong>
                {Math.abs(delta) > 0.05 && (
                  <span className={styles.delta} data-good={delta > 0}>
                    {delta > 0 ? '−' : '+'}{Math.abs(delta).toFixed(1)} months
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
