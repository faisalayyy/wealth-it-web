'use client';

/**
 * CHAPTER 02 — THE FLOW.
 *
 * The field behind has separated into two lanes; this says what the lanes are, and then says
 * the thing no other finance site says: that the third number on the page is in neither of
 * them. A transfer between your own wallets is movement without consequence, and an app that
 * counts it as spending is lying to you about a day you did nothing wrong.
 */

import { MONTH, money0, spendByCategory } from '@/lib/ledger';
import { CHAPTERS } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Chapter.module.css';

const CH = CHAPTERS[1]!;
const TOP = spendByCategory(-30, 0).slice(0, 6);

export function Flow() {
  return (
    <section id={CH.id} className={styles.chapter}>
      <div className={styles.head}>
        <span className={`mono ${styles.index}`}>{CH.index}</span>
        <span className={`mono ${styles.kicker}`}>{CH.kicker}</span>
      </div>

      <Reveal as="h2" className={styles.title} lines>{CH.title.join(' ')}</Reveal>
      <Reveal as="p" className={styles.body} delay={0.1}>{CH.body}</Reveal>

      <Reveal className={styles.ledgerRow} delay={0.15}>
        <dl className={styles.pair}>
          <dt className="mono">In, last 30 days</dt>
          <dd className={`fig ${styles.big}`} data-tone="in">+{money0(MONTH.in)}</dd>
        </dl>
        <dl className={styles.pair}>
          <dt className="mono">Out</dt>
          <dd className={`fig ${styles.big}`} data-tone="out">−{money0(MONTH.out)}</dd>
        </dl>
        <dl className={styles.pair} data-quiet="true">
          <dt className="mono">Moved between wallets</dt>
          <dd className={`fig ${styles.big}`} data-tone="none">{money0(MONTH.moved)}</dd>
        </dl>
      </Reveal>

      <Reveal as="p" className={styles.aside} delay={0.2}>{CH.aside}</Reveal>

      {/* Where it went, as a rule rather than a donut: a single bar the width of the page,
          divided by what you spent it on. Reading left to right is reading in order of size. */}
      <Reveal className={styles.splitBar} delay={0.25}>
        <div className={styles.bar} role="img" aria-label={
          `Spending by category over thirty days: ${TOP.map(r => `${r.label} ${Math.round(r.share * 100)} percent`).join(', ')}.`
        }>
          {TOP.map(r => (
            <span key={r.cat} style={{ width: `${r.share * 100}%`, background: r.hue }} />
          ))}
        </div>
        <ul className={styles.keys}>
          {TOP.map(r => (
            <li key={r.cat}>
              <i style={{ background: r.hue }} aria-hidden="true" />
              <span>{r.label}</span>
              <span className="mono">{money0(r.total)}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
