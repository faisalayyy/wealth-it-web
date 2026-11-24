import type { Metadata } from 'next';
import Link from 'next/link';
import p from '@/components/Prose.module.css';
import { SiteFooter } from '@/components/SiteFooter';
import { breadcrumbs, JsonLd, pageMeta } from '@/lib/seo';
import { contactEmail, plus } from '@/lib/site';
import { PageHero } from '@/sections/product/PageHero';

/**
 * The terms of sale for Wealthit+, which Safepay reads before it approves the website as a merchant.
 * Every fact is the app's (A634: 6 months of history and 5 money wallets without it; A631, A643: sold only on this website, through
 * Safepay in rupees, never in the apps, one purchase for the whole account; A636: the prices, in rupees; A632: the 14-day trial, what it includes, nothing
 * ever deleted; A644, A646: the trial, Stop renewing, and deleting the account stopping a Safepay plan, as the
 * server does them). Refunds, the trial, lifetime, price rises, cancelling and deleting the account are as
 * Faisal approved them on 18 November 2026. If Wealthit+ changes in the app, this page changes the same day.
 */
export const metadata: Metadata = pageMeta({
  title: 'Terms of sale for Wealthit+',
  description: 'What Wealthit+ includes, what it costs, how the 14-day trial and renewals work, and how to cancel.',
  path: '/terms/',
});

const updated = '17 November 2026';

export default function Terms() {
  return (
    <div className="page">
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Terms of sale', path: '/terms/' },
          ])}
        />
        <PageHero cap="Terms of sale" title="Wealthit+, in plain words." lead="What you get, what it costs, how it renews and how to cancel." />
        <div className={p.prose}>
          <p className={p.updated}>Last updated {updated}.</p>

          <h2>Who sells it</h2>
          <p>
            {plus.name} is sold by Faisal Mukhtar, who makes Wealthit. Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with
            any question about a purchase. All the ways to reach us are on the <Link href="/contact/">contact page</Link>.
          </p>

          <h2>What {plus.name} includes</h2>
          <ul className={p.list}>
            <li>
              Unlimited wallets. Without {plus.name}, Wealthit keeps up to {plus.wallets} money wallets (bank, cash, cards, savings and loans);
              the people you share costs with don’t count.
            </li>
            <li>
              Your full history, and a year in review. Without {plus.name}, the last {plus.historyMonths} months show, and older records are
              never deleted.
            </li>
            <li>Exports to PDF and CSV.</li>
            <li>App icons.</li>
            <li>Goals.</li>
            <li>Outlook, in Statistics, which shows where your money is likely to land.</li>
            <li>Investments, shown as coming soon until it is ready.</li>
            <li>Early access to new features, and faster help.</li>
          </ul>
          <p>
            Everything else in Wealthit stays included without {plus.name}, budgets and scheduled payments among them. Anyone who already
            has goals, or more than {plus.wallets} wallets, keeps them. The assistant is included for everyone, and it works within what your
            plan includes.
          </p>

          <h2>Prices</h2>
          <ul className={p.list}>
            <li>
              <strong>Monthly:</strong> {plus.prices.month} a month.
            </li>
            <li>
              <strong>Yearly:</strong> {plus.prices.year} a year.
            </li>
            <li>
              <strong>Lifetime:</strong> {plus.prices.life}, paid once.
            </li>
          </ul>
          <p>
            Prices are in Pakistani rupees, and you pay exactly these through Safepay. The amount is shown before you pay.
          </p>

          <h2>Where you can buy it</h2>
          <p>
            Only here, on <Link href="/plus/">wealthit.app/plus</Link>. You enter your Wealthit account’s email address, confirm it with a code
            sent to that address, and pay on Safepay’s own checkout. The apps don’t sell it. One purchase unlocks {plus.name} for your account on every phone you sign in on.
          </p>

          <h2 id="trial">The {plus.trialDays}-day trial</h2>
          <p>
            Try {plus.name} for {plus.trialDays} days, with everything it includes. You start it on wealthit.app/plus, and each account can
            try it once. There is no payment to start it and nothing is charged for it: when the {plus.trialDays} days end, {plus.name} stops
            by itself, unless you have chosen a plan.
          </p>

          <h2>Renewals</h2>
          <p>
            Monthly and yearly plans renew on their own at the end of each period, until you cancel. Lifetime is one payment and never renews;
            it lasts as long as your Wealthit account does. If a price goes up, it never changes a period you have already paid for, and you
            are told before a renewal at the new price.
          </p>

          <h2 id="cancel">Cancelling</h2>
          <p>
            You can cancel any time. On wealthit.app/plus, enter your email and the code we send, then choose Stop renewing. Or write to{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from your account’s email address. Nothing is charged after the period you
            have paid for. {plus.name} stays until that period ends, then it ends. Deleting your
            Wealthit account cancels {plus.name} too.
          </p>

          <h2>When {plus.name} ends</h2>
          <p>
            Nothing you have made is deleted or changed. The parts that need {plus.name} are hidden, and everything in them comes back the
            moment {plus.name} starts again.
          </p>

          <h2>Refunds</h2>
          <p>
            When you can get your money back, and how, is in the <Link href="/refunds/">refund and cancellation policy</Link>.
          </p>

          <h2>Your records</h2>
          <p>
            Paying for {plus.name} changes nothing about who can see your records. How payments are handled, and what Wealthit keeps about
            them, is in the <Link href="/privacy/#payments">privacy policy</Link>.
          </p>

          <h2>Changes</h2>
          <p>If these terms change, the date at the top changes with them. A change never applies to a period you have already paid for.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
