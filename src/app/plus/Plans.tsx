'use client';

import { useState } from 'react';
import { plus } from '@/lib/site';
import { openPlus } from './Join';
import { PLANS, type Plan } from './prices';
import s from './plus.module.css';

const ORDER: Plan[] = ['year', 'month', 'life'];

/** Picking a plan: three cards as one radio group, Yearly first; the gold button opens the dialog. */
export function Plans({ live }: { live: boolean }) {
  const [pick, setPick] = useState<Plan>('year');
  const p = PLANS[pick];
  return (
    <div className={s.plans}>
      <div className={s.planList} role="radiogroup" aria-label="Plans">
        {ORDER.map(k => {
          const it = PLANS[k];
          const on = pick === k;
          return (
            <label key={k} className={s.planCard} data-on={on ? '' : undefined}>
              <input type="radio" name="plan" value={k} checked={on} onChange={() => setPick(k)} className={s.planRadio} />
              <span className={s.planTick} aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M6 12.5l4 4 8-9" />
                </svg>
              </span>
              <span className={s.planName}>
                {it.name}
                {it.badge && <span className={s.badge}>{it.badge}</span>}
              </span>
              <span className={s.planSub}>{it.sub}</span>
              <span className={s.planPrice}>{it.price}</span>
              <span className={s.planPer}>{it.per}</span>
            </label>
          );
        })}
      </div>
      <div className={s.planGo}>
        {live ? (
          <button type="button" className={s.gold} onClick={() => openPlus({ kind: 'buy', plan: pick })}>
            Continue with {p.name}
          </button>
        ) : (
          <span className={s.gold} data-soon="">
            Coming soon
          </span>
        )}
        <p className={s.planNote}>
          {p.line[0].toUpperCase() + p.line.slice(1)}. Paid through Safepay, in rupees.
        </p>
        {live && (
          <button type="button" className={s.textLink} onClick={() => openPlus({ kind: 'trial' })}>
            Or try {plus.name} for {plus.trialDays} days first, with no payment
          </button>
        )}
      </div>
    </div>
  );
}
