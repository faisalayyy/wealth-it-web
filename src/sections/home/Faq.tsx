'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { fullStop } from '@/components/Stop';
import { Icon } from '@/components/Icon';
import { faqSchema, JsonLd } from '@/lib/seo';
import s from './Faq.module.css';

/**
 * Questions (not in the reference; asked for in the brief): five answers drawn from the Help page
 * and the privacy policy, one open at a time, each opening smoothly. The rest are on /support/.
 */
export type QA = { q: string; a: string | string[] };

const HOME: QA[] = [
  {
    q: 'Is Wealthit out yet?',
    a: 'Not yet. It’s in testing now and coming soon. The buttons on this page turn into real links the day it’s out.',
  },
  {
    q: 'Do I need an account?',
    a: 'Yes. You sign in with Apple, Google or your email. Your records are kept in your account, so they’re the same on every phone you sign in on, and a lost or new phone loses nothing.',
  },
  {
    q: 'Can I use Wealthit on my computer?',
    a: 'Yes. Sign in at dashboard.wealthit.app with the same account and your records are there, in step with your phone.',
  },
  {
    q: 'Does it connect to my bank?',
    a: 'No. Wealthit never asks for your bank login. You record what you spend yourself: as a sentence, from a receipt, or with Tap to Record when you pay with Apple Pay.',
  },
  {
    q: 'Can I track money in different currencies?',
    a: 'Yes, in 26 of them. Every wallet keeps its own currency. Totals use a rate you actually got on a transfer, a fixed peg such as the dirham’s to the dollar, or the day’s published rate. Anything none of those can reach is left out of the total and named, and still shown in its own currency.',
  },
  {
    q: 'Who can see my records?',
    a: 'You. They are kept on your phone and in your account on Wealthit’s server in Frankfurt, in the EU, and nobody reads them. There is no tracking or advertising, Wealthit runs no analytics, and receipt photos never leave your phone.',
  },
];

export function Faq({
  items = HOME,
  cap = 'Questions',
  title = 'Good questions, answered.',
  more = true,
  sectionId,
  schema = items === HOME,
}: {
  items?: QA[];
  cap?: string;
  title?: string;
  more?: boolean;
  sectionId?: string;
  /** add the questions as schema.org FAQPage (once per page) */
  schema?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section className={s.section} aria-labelledby={`${id}-title`} id={sectionId} data-ground="light">
      {schema && <JsonLd data={faqSchema(items)} />}
      <div className={`wrap ${s.grid}`}>
        <div>
          <p className="cap">{cap}</p>
          <h2 id={`${id}-title`} className={`display-2 ${s.title}`}>
            {fullStop(title)}
          </h2>
          {more && (
            <Link href="/support/" className={s.more}>
              More answers on the Help page
              <Icon name="arrow-up-right" size={16} />
            </Link>
          )}
        </div>
        <ul className={s.list}>
          {items.map((item, i) => (
            <li key={item.q} className={s.item} data-open={open === i ? '' : undefined}>
              <h3>
                <button type="button" className={s.q} aria-expanded={open === i} aria-controls={`${id}-a${i}`} id={`${id}-q${i}`} onClick={() => setOpen(open === i ? null : i)}>
                  <span>{item.q}</span>
                  <Icon name="plus" size={20} className={s.plus} />
                </button>
              </h3>
              <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} className={s.a} inert={open !== i}>
                <div>
                  {(Array.isArray(item.a) ? item.a : [item.a]).map(p => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
