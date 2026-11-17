import type { Metadata } from 'next';
import Link from 'next/link';
import p from '@/components/Prose.module.css';
import { SiteFooter } from '@/components/SiteFooter';
import { breadcrumbs, JsonLd, pageMeta } from '@/lib/seo';
import { contactEmail, plus } from '@/lib/site';
import { PageHero } from '@/sections/product/PageHero';

/**
 * Refunds and cancelling Wealthit+, for Safepay's review and for anyone who paid. Store purchases are
 * refunded by Apple and Google under their own rules (the app's A631); the 14 days for a web refund
 * is a draft waiting for Faisal's yes.
 */
export const metadata: Metadata = pageMeta({
  title: 'Refund and cancellation policy',
  description: 'When you can get your money back for Wealthit+, how refunds are paid, and how to cancel on the web or in the apps.',
  path: '/refunds/',
});

const updated = '17 November 2026';

export default function Refunds() {
  return (
    <div className="page">
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Refunds and cancellation', path: '/refunds/' },
          ])}
        />
        <PageHero cap="Refunds and cancellation" title="Changed your mind? That’s fine." lead={`When you can get your money back for ${plus.name}, and how to cancel.`} />
        <div className={p.prose}>
          <p className={p.updated}>Last updated {updated}.</p>

          <h2>Bought on the web</h2>
          <ul className={p.list}>
            <li>
              <strong>Within 14 days:</strong> write to us within 14 days of a payment and you get that payment back in full. This applies
              to monthly, yearly and lifetime plans.
            </li>
            <li>
              <strong>A charge you didn’t expect:</strong> charged twice, or charged after you cancelled? It is refunded in full, whenever
              you notice.
            </li>
            <li>
              <strong>How it is paid back:</strong> through Safepay, to the card or account you paid with. How long it takes to show
              depends on your bank.
            </li>
          </ul>
          <p>
            To ask for a refund, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from your account’s email address, with the
            date and the amount of the payment. Never send a card number.
          </p>

          <h2>Bought in the apps</h2>
          <p>
            Apple and Google take payments made in the apps, and they decide refunds under their own rules. Wealthit can’t refund a store
            purchase itself, but write to us if you need help asking.
          </p>
          <ul className={p.list}>
            <li>
              <strong>App Store:</strong> ask Apple at <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
            </li>
            <li>
              <strong>Google Play:</strong> ask Google through{' '}
              <a href="https://support.google.com/googleplay/answer/2479637">Google Play’s refund help</a>.
            </li>
          </ul>

          <h2>Cancelling</h2>
          <p>
            Cancel any time. Nothing is charged after the period you have paid for, and {plus.name} stays until that period ends. Cancel
            within the {plus.trialDays}-day trial and nothing is charged at all. On the web, cancel in Wealthit on the web or write to us; in
            the apps, cancel in your App Store or Google Play subscriptions. The details are in the{' '}
            <Link href="/terms/#cancel">terms of sale</Link>.
          </p>

          <h2>After a refund or a cancellation</h2>
          <p>
            {plus.name} ends when its payment is refunded, or when the period you paid for runs out. Nothing you have made is deleted: the
            parts that need {plus.name} are hidden, and they come back if you start it again.
          </p>

          <h2>Questions</h2>
          <p>
            Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, or see every way to reach us on the{' '}
            <Link href="/contact/">contact page</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
