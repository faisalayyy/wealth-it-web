import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { SiteFooter } from '@/components/SiteFooter';
import type { Fact } from '@/lib/features';
import { pageMeta } from '@/lib/seo';
import { plus } from '@/lib/site';
import { Faq, type QA } from '@/sections/home/Faq';
import { Facts } from '@/sections/product/Facts';
import { PageHero } from '@/sections/product/PageHero';
import s from './plus.module.css';

/**
 * Wealthit+, the paid plan (the app's A631, A632, A634): its prices, its 14-day trial and what it
 * includes. Ready for Safepay's review but not linked from the menu, the footer or the sitemap, and
 * kept out of search, until Faisal says. Until `plus.checkout` is set, its button says "Coming soon".
 * Never "free": the trial is "Try Wealthit+ for 14 days".
 */
export const metadata: Metadata = {
  ...pageMeta({
    title: plus.name,
    description: `Unlimited wallets, your full history and a year in review, PDF and CSV exports, app icons and Goals. ${plus.prices.month} a month, ${plus.prices.year} a year or ${plus.prices.life} once.`,
    path: '/plus/',
  }),
  robots: { index: false, follow: true },
};

const PRICES = [
  { plan: 'Monthly', price: plus.prices.month, per: 'a month' },
  { plan: 'Yearly', price: plus.prices.year, per: 'a year', note: 'About $1.25 a month', best: true },
  { plan: 'Lifetime', price: plus.prices.life, per: 'once, for as long as you have Wealthit' },
];

const INCLUDES: Fact[] = [
  { title: 'Unlimited wallets', text: `Bank, cash, cards, savings and loans. Without ${plus.name}, Wealthit keeps up to ${plus.wallets}; the people you share costs with don’t count.` },
  { title: 'Your full history', text: `Every month you have recorded, and a year in review. Without ${plus.name}, the last ${plus.historyMonths} months show, and nothing older is ever deleted.` },
  { title: 'PDF and CSV exports', text: 'Your records as a report to keep, or a file for a spreadsheet.' },
  { title: 'Goals', text: 'Put money aside for something and watch it grow.' },
  { title: 'App icons', text: 'Pick the icon Wealthit wears on your home screen.' },
  { title: 'Investments, coming soon', text: 'Keep your investments beside the rest of your money.' },
  { title: 'Early access and faster help', text: 'New features first, and your emails answered first.' },
];

const ALWAYS: Fact[] = [
  { title: 'Budgets and scheduled payments', text: 'Included for everyone, as they are.' },
  { title: 'The assistant, for everyone', text: `Ask about your money with or without ${plus.name}. It answers within what your plan includes.` },
  { title: 'Nothing is ever deleted', text: `If ${plus.name} ends, what you made stays. Its parts come back the moment you start again.` },
  { title: 'One purchase, everywhere', text: 'Buy it once and it works on every phone you sign in on.' },
];

const QUESTIONS: QA[] = [
  {
    q: 'How does the trial work?',
    a: `Try ${plus.name} for ${plus.trialDays} days, with everything it includes. On wealthit.app you choose a plan when you start, and nothing is charged until the ${plus.trialDays} days end. Cancel before then and nothing is charged at all. In the apps, the trial works the way the App Store or Google Play sets it up.`,
  },
  {
    q: 'Where can I buy it?',
    a: 'On wealthit.app through Safepay, in Pakistani rupees, or in the apps through the App Store or Google Play, which show their own local price. One purchase unlocks it for your account everywhere.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Nothing is charged after the period you have paid for. Bought on wealthit.app? Write to us. In the apps, cancel in your App Store or Google Play subscriptions.',
  },
  { q: `I already have goals, or more than ${plus.wallets} wallets. What happens?`, a: 'You keep them, and you can go on using them.' },
  { q: 'Can I get a refund?', a: 'Yes, for a web payment within 14 days. Payments in the apps are refunded by Apple or Google. The refund and cancellation policy has the details.' },
  { q: 'What happens to my things if I stop?', a: `Nothing you made is deleted or changed. The parts that need ${plus.name} are hidden, and everything in them comes back the moment you start again.` },
];

export default function Plus() {
  return (
    <div className="page">
      <main id="main">
        <PageHero
          cap={plus.name}
          title="More room for big goals."
          lead={`Everything in Wealthit, with unlimited wallets, your full history, exports and Goals. Try ${plus.name} for ${plus.trialDays} days.`}
          actions={
            <>
              {plus.checkout ? (
                <Button label={`Try ${plus.name} for ${plus.trialDays} days`} href={plus.checkout} tone="brand" external />
              ) : (
                <Button label="Coming soon" tone="brand" as="span" />
              )}
              <Button label="Read the terms" href="/terms/" tone="ink" variant="secondary" />
            </>
          }
        />
        <section className={s.section} aria-label="Prices">
          <div className="wrap">
            <div className={s.grid}>
              {PRICES.map(pr => (
                <div key={pr.plan} className={s.card} data-best={pr.best || undefined}>
                  <span className={s.plan}>{pr.plan}</span>
                  <span className={s.price}>{pr.price}</span>
                  <span className={s.per}>{pr.per}</span>
                  {pr.note && <span className={s.note}>{pr.note}</span>}
                </div>
              ))}
            </div>
            <p className={s.small}>
              Prices are in US dollars. On wealthit.app you pay through Safepay in Pakistani rupees; in the apps, the App Store or Google Play
              shows its own price in your currency. Monthly and yearly plans renew until you cancel. See the{' '}
              <Link href="/terms/">terms of sale</Link> and the <Link href="/refunds/">refund and cancellation policy</Link>.
            </p>
          </div>
        </section>
        <Facts title={`Everything in ${plus.name}.`} facts={INCLUDES} />
        <Facts title="Always, with or without it." facts={ALWAYS} />
        <Faq sectionId="plus" cap={plus.name} title="Good questions, answered." items={QUESTIONS} more={false} />
      </main>
      <SiteFooter />
    </div>
  );
}
