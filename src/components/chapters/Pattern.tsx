'use client';

/**
 * CHAPTER 03 — THE PATTERN.
 *
 * The fold. Twelve months of transactions drop their year and keep only their day, so a year
 * of movement lands on a single month and the commitments stack into columns you can see from
 * across the room.
 *
 * It is the site's best idea because it works by taking information away. Nothing is added to
 * the field — no new colour, no new element — and a fact appears that was always in the data
 * and never visible: you are far more repetitive than you feel.
 */

import { LEDGER, CATEGORIES, money0 } from '@/lib/ledger';
import { CHAPTERS } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { dateAt } from '@/lib/ledger';
import styles from './Chapter.module.css';

const CH = CHAPTERS[2]!;

/** The days that repeat, found in the ledger rather than asserted in the copy. */
const COLUMNS = (() => {
  const byDay = new Map<number, { count: number; total: number; payee: string; cat: string }>();
  for (const tx of LEDGER) {
    if (tx.t > 0 || tx.amount < 250) continue;
    const dom = dateAt(tx.t).getUTCDate();
    const key = dom * 1000 + tx.payee.length;
    const prev = byDay.get(key);
    byDay.set(key, {
      count: (prev?.count ?? 0) + 1,
      total: (prev?.total ?? 0) + tx.amount,
      payee: tx.payee,
      cat: CATEGORIES[tx.cat].label,
    });
  }
  return [...byDay.entries()]
    .filter(([, v]) => v.count >= 6)
    .map(([k, v]) => ({ dom: Math.floor(k / 1000), ...v, avg: v.total / v.count }))
    .sort((a, b) => a.dom - b.dom)
    .slice(0, 5);
})();

export function Pattern() {
  return (
    <section id={CH.id} className={styles.chapter}>
      <div className={styles.head}>
        <span className={`mono ${styles.index}`}>{CH.index}</span>
        <span className={`mono ${styles.kicker}`}>{CH.kicker}</span>
      </div>

      <Reveal as="h2" className={styles.title} lines>{CH.title.join(' ')}</Reveal>
      <Reveal as="p" className={styles.body} delay={0.1}>{CH.body}</Reveal>

      <Reveal className={styles.columns} delay={0.15}>
        <p className={`mono ${styles.colHead}`}>The days that repeat</p>
        <ul className={styles.repeats}>
          {COLUMNS.map(c => (
            <li key={`${c.dom}-${c.payee}`}>
              <span className={`mono ${styles.dom}`}>{String(c.dom).padStart(2, '0')}</span>
              <span className={styles.repName}>{c.payee}</span>
              <span className={`mono ${styles.repMeta}`}>{c.cat} · {c.count}×</span>
              <span className={`mono ${styles.repAmt}`}>{money0(c.avg)}</span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Everything scattered between those columns is the part you decide — and the part the
          next chapter lets you move.
        </p>
      </Reveal>
    </section>
  );
}
