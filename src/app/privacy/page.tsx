import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Icon } from '@/components/Icon';
import p from '@/components/Prose.module.css';
import { SiteFooter } from '@/components/SiteFooter';
import { contactEmail } from '@/lib/site';
import { PageHero } from '@/sections/product/PageHero';

/**
 * The privacy policy, and the URL the App Store asks for (the app's About screen links here).
 *
 * The text is the app session's (app repo, branch privacy-accounts of this site, 11 October 2026),
 * and every claim is a claim about the app as built: an account to sign in with, records kept on
 * the phone and on Wealthit's server in the EU, no analytics, no ads, no tracking. If any of that
 * changes in the app, it has to change here on the same day — a privacy page that has drifted is
 * worse than no privacy page.
 */
export const metadata: Metadata = pageMeta({
  title: 'Privacy',
  description: 'What Wealthit keeps, where it is kept, and what you can do about it. No tracking, no ads, no analytics.',
  path: '/privacy/',
});

const updated = '11 October 2026';

const nots = [
  'No tracking, no advertising and no analytics.',
  'Nothing about you is sold, rented or shared with anyone for their own use.',
  'Nobody reads your records. They are used to keep your phones in step and to work out the figures the app shows you.',
  'Receipt photos and your profile picture stay on your phone.',
];

export default function Privacy() {
  return (
    <div className="page">
      <main id="main">
        <PageHero cap="Privacy" title="Your money is yours to see." lead="Wealthit is a personal finance app. This page says what it keeps, why, where, and what you can do about it." />
        <div className={p.prose}>
          <p className={p.updated}>Last updated {updated}.</p>
          <ul className={p.ticks} role="list">
            {nots.map(n => (
              <li key={n}>
                <Icon name="check" size={20} stroke={2} />
                <span>{n}</span>
              </li>
            ))}
          </ul>

          <h2>Who is responsible</h2>
          <p>
            Wealthit is made by Faisal Mukhtar, who is responsible for the data described here. Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>{' '}
            about anything on this page.
          </p>

          <h2>What Wealthit keeps</h2>
          <ul className={p.list}>
            <li>
              <strong>Your email address</strong>, to sign you in and to send you sign-in links and codes.
            </li>
            <li>
              <strong>Your account’s id</strong>, so your records are yours and nobody else’s.
            </li>
            <li>
              <strong>What you record</strong>: your wallets, transactions, categories, labels, budgets, scheduled payments, goals, the people you
              share costs with, your settings, and the name you give yourself in the app. It is kept so a lost phone loses nothing and every phone
              you sign in on shows the same money.
            </li>
            <li>
              <strong>If you sign in with Google or Apple</strong>, they tell Wealthit your email address and an id for that account. Wealthit
              never sees your Google or Apple password. If you choose Apple’s “Hide My Email”, Wealthit only ever sees the address Apple gives it.
            </li>
            <li>
              <strong>A password, only if you set one</strong>, stored only as an Argon2 hash, never the password itself. Sign-in codes are stored
              only as a keyed hash, and expire after ten minutes.
            </li>
          </ul>

          <h2>What stays on your phone</h2>
          <ul className={p.list}>
            <li>
              <strong>Receipt photos.</strong> Read on the phone and kept with that record on the phone. They are not uploaded.
            </li>
            <li>
              <strong>Your profile picture.</strong> Copied into the app and kept on the phone.
            </li>
            <li>
              <strong>Your app lock PIN.</strong> Held in the phone’s keychain. Face ID is checked by the phone; the app is only told yes or no.
            </li>
            <li>
              <strong>Sample data.</strong> If you explore with sample data, it never leaves the phone and is never added to your account.
            </li>
            <li>
              <strong>Tap to Record.</strong> If you set up the Wallet shortcut, the amount and merchant of a card payment are handed to the app on
              the phone, and become a record like any other.
            </li>
            <li>
              <strong>Widgets and reminders.</strong> Drawn and scheduled on the phone, by the phone. There are no push notifications.
            </li>
          </ul>

          <h2>Where it is kept</h2>
          <p>
            On your phone, and on Wealthit’s server: an application server run by Render and a database run by Neon, both in Frankfurt, in the EU.
            Every connection is encrypted. Each account’s records are kept apart by the database itself.
          </p>
          <p>Sign-in emails are sent through Resend, which receives your address and the message, and nothing else.</p>

          <h2>Other requests the app makes</h2>
          <ul className={p.list}>
            <li>
              <strong>Exchange rates.</strong> To convert between currencies, the app asks open.er-api.com for the day’s published rates. The
              request carries your main currency and nothing else. You can turn it off in Currency &amp; format → Download daily rates.
            </li>
            <li>
              <strong>The app’s look.</strong> The app asks Wealthit’s own design service for its current colours and text sizes. The request
              carries nothing about you or your records.
            </li>
          </ul>
          <p>
            Like any request on the internet, these come from your phone’s IP address. Nothing is kept that links them to you.
          </p>

          <h2>Your choices</h2>
          <ul className={p.list}>
            <li>
              <strong>Export</strong> your records at any time, as a backup file or a spreadsheet, from Advanced settings → Your data.
            </li>
            <li>
              <strong>Log out</strong> from the side menu. Your records stay in your account.
            </li>
            <li>
              <strong>Delete your account</strong> from your profile. You are signed out on every phone and this phone is cleared, and 60 days later
              your account and everything in it are deleted from the server for good. Changed your mind? Sign in before then and everything comes
              back. If you signed in with Apple, Wealthit also hands that sign-in back to Apple straight away.
            </li>
            <li>
              <strong>Ask</strong> for a copy of what Wealthit holds about you, for a correction, or for your account to be deleted straight away, by
              writing to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from the address you sign in with.
            </li>
          </ul>

          <h2>How long it is kept</h2>
          <p>
            For as long as you have an account. When you delete it, it is removed for good 60 days later, unless you sign in again before then.
            The database keeps a short recovery history of its own, which expires by itself.
          </p>

          <h2>Children</h2>
          <p>Wealthit is a personal finance app for adults. It is not directed at children, and it does not knowingly keep anything about a child.</p>

          <h2>This website</h2>
          <p>
            The page you are reading is a static file. It sets no cookies, runs no analytics and embeds nothing from anywhere else. Whoever hosts
            it can see the ordinary request logs any web server keeps (an IP address, a page, a time), and that is the only record of your visit.
          </p>

          <h2>Changes</h2>
          <p>If the app starts doing something this page does not describe, this page changes first, and the date at the top changes with it.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
