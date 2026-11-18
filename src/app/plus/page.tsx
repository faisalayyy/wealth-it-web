import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusMark } from '@/components/PlusMark';
import { SiteFooter } from '@/components/SiteFooter';
import { breadcrumbs, JsonLd, pageMeta } from '@/lib/seo';
import { plus } from '@/lib/site';
import { Faq, type QA } from '@/sections/home/Faq';
import { PLUS_ICONS, type PlusIconName } from './icons';
import { Join } from './Join';
import { Open } from './Open';
import { PlusCard } from '@/components/PlusCard';
import { Plans } from './Plans';
import s from './plus.module.css';

/**
 * Wealthit+, the paid plan (the app's A631, A632, A634, A636, A643): the only place it is sold, the
 * apps never sell it. In the app's Wealthit+ look (Design & Brands' A · Metal card, A637): the gold,
 * the gold mark and the metal card. Hero, plans, what you get, questions, footer (Faisal, 18 Nov).
 * Every button opens one dialog (Join.tsx: email, code, then the trial, Safepay or the plan); while
 * `plus.api` is null they say "Coming soon". Never "free": the trial is "Try Wealthit+ for 14 days".
 */
export const metadata: Metadata = pageMeta({
  title: `${plus.name}: unlimited wallets, full history and exports`,
  description: `Everything in Wealthit, without limits: unlimited wallets, your full history, PDF and CSV exports and Goals. Try ${plus.name} for ${plus.trialDays} days. ${plus.prices.month} a month, ${plus.prices.year} a year or ${plus.prices.life} once.`,
  path: '/plus/',
});

/** A headline's full stop in gold, as the lime one is everywhere else. */
const goldStop = (t: string) => (
  <>
    {t.replace(/\.$/, '')}
    <span className={s.stop}>.</span>
  </>
);

const GET: { icon: PlusIconName; title: string; text: string; soon?: boolean }[] = [
  { icon: 'wallet', title: 'Unlimited wallets', text: `Every account, card and loan. Without it, Wealthit keeps ${plus.wallets}.` },
  { icon: 'restore', title: 'Your full history', text: `Every month you’ve recorded, and a year in review. Without it, you see the last ${plus.historyMonths} months.` },
  { icon: 'download', title: 'PDF and CSV exports', text: 'A report to keep, or a file for your spreadsheet.' },
  { icon: 'target', title: 'Goals', text: 'Put money aside for something and watch it grow.' },
  { icon: 'grid', title: 'App icons', text: 'Pick the icon on your home screen, gold included.' },
  { icon: 'trend', title: 'Investments', text: 'Your investments beside the rest of your money.', soon: true },
  { icon: 'rocket', title: 'Early access', text: 'New features reach you first.' },
  { icon: 'chat', title: 'Faster help', text: 'Your emails are answered first.' },
];

const QUESTIONS: QA[] = [
  {
    q: 'How does the trial work?',
    a: `Tap Try ${plus.name} for ${plus.trialDays} days and confirm the email you use for Wealthit. Everything opens at once, with no payment. When the ${plus.trialDays} days end it stops by itself, unless you choose a plan. Each account can try it once.`,
  },
  {
    q: 'Where do I pay?',
    a: `Here on wealthit.app, through Safepay, in rupees. One payment unlocks ${plus.name} on every phone you sign in on.`,
  },
  {
    q: 'Can I cancel any time?',
    a: `Yes. Choose Manage your plan, then Stop renewing, or write to us. ${plus.name} stays until the end of what you paid for, and nothing more is charged.`,
  },
  { q: 'Can I get a refund?', a: 'Yes, in full within 14 days of a payment. The refund and cancellation policy has the details.' },
  { q: `I already have goals, or more than ${plus.wallets} wallets. What happens?`, a: 'You keep them, and you can go on using them.' },
  {
    q: 'What happens to my things if I stop?',
    a: `Nothing you made is deleted or changed. The parts that need ${plus.name} are hidden, and they come back the moment you start again. Budgets, scheduled payments and the assistant stay with you either way.`,
  },
];

function Icon({ name }: { name: PlusIconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      {PLUS_ICONS[name].map((p, i) =>
        'stroke' in p ? (
          <path key={i} d={p.d} fill="none" stroke="currentColor" strokeWidth={p.stroke} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={i} d={p.d} fillRule={'even' in p && p.even ? 'evenodd' : undefined} />
        ),
      )}
    </svg>
  );
}

export default function PlusPage() {
  const live = !!plus.api;
  return (
    <div className="page">
      <main id="main" className={s.page}>
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: plus.name, path: '/plus/' },
          ])}
        />

        <section className={s.hero} data-tilt="">
          <div className={`wrap ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <p className={s.tag}>
                <PlusMark className={s.tagMark} />
                <span className={s.foil}>{plus.name}</span>
              </p>
              <h1 className={s.h1}>{goldStop('Everything in Wealthit, without limits.')}</h1>
              <p className={s.lead}>
                Unlimited wallets, your full history, exports and Goals, on every phone you sign in on. Try it for {plus.trialDays} days with no
                payment to start.
              </p>
              <div className={s.heroActions}>
                {live ? (
                  <Open intent={{ kind: 'trial' }} className={s.gold}>
                    Try {plus.name} for {plus.trialDays} days
                  </Open>
                ) : (
                  <span className={s.gold} data-soon="">
                    Coming soon
                  </span>
                )}
                <a href="#plans" className={s.ghost}>
                  See the plans
                </a>
              </div>
              {live && (
                <p className={s.member}>
                  Already have it?{' '}
                  <Open intent={{ kind: 'manage' }} className={s.textLink}>
                    Manage your plan
                  </Open>
                </p>
              )}
            </div>
            <div className={s.heroCard}>
              <PlusCard />
            </div>
          </div>
        </section>

        <section id="plans" className={s.section} aria-labelledby="plans-title">
          <div className="wrap">
            <div className={s.head}>
              <p className={s.cap}>Plans</p>
              <h2 id="plans-title" className={s.h2}>
                {goldStop('Pick how you pay.')}
              </h2>
            </div>
            <Plans live={live} />
            <p className={s.small}>
              Prices in Pakistani rupees. Monthly and yearly renew until you stop them. <Link href="/terms/">Terms of sale</Link> ·{' '}
              <Link href="/refunds/">Refunds</Link> · <Link href="/privacy/#payments">Privacy</Link>
            </p>
          </div>
        </section>

        <section className={s.section} aria-labelledby="get-title">
          <div className="wrap">
            <div className={s.head}>
              <p className={s.cap}>What you get</p>
              <h2 id="get-title" className={s.h2}>
                {goldStop('More room for big goals.')}
              </h2>
            </div>
            <ul className={s.getGrid}>
              {GET.map(g => (
                <li key={g.title} className={s.getItem}>
                  <span className={s.getIcon}>
                    <Icon name={g.icon} />
                  </span>
                  <span className={s.getTitle}>
                    {g.title}
                    {g.soon && <span className={s.soon}>Soon</span>}
                  </span>
                  <span className={s.getText}>{g.text}</span>
                </li>
              ))}
            </ul>
            <p className={s.always}>
              <span className={s.alwaysDot} aria-hidden />
              With or without it: budgets, scheduled payments and the assistant stay included, and nothing you make is ever deleted.
            </p>
          </div>
        </section>

        <Faq sectionId="questions" cap={plus.name} title="Good to know." items={QUESTIONS} more={false} />
        {live && plus.api && <Join api={plus.api} />}
      </main>
      <SiteFooter />
    </div>
  );
}
