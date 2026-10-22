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
 * the phone and, locked so only the person can read them, on Wealthit's server in the EU (the app's
 * A430), or on the phone only if they choose (A429); no ads, no tracking, and no analytics service —
 * only which parts are used, as yes or no. If any of that
 * changes in the app, it has to change here on the same day — a privacy page that has drifted is
 * worse than no privacy page.
 */
export const metadata: Metadata = pageMeta({
  title: 'Privacy policy',
  description: 'What Wealthit keeps, where and why. Your records are locked on your phone before they sync, so only you can read them; or keep them on your phone only. No tracking and no ads.',
  path: '/privacy/',
});

// the day records only you can read ship (the app's A430)
const updated = '23 October 2026';

const nots = [
  'Only you can read your records. They are locked on your phone, or in your browser, before they are sent, with a key only you hold. Wealthit, and the companies that run its server, cannot read them.',
  'Or keep them on your phone only: then they are never sent anywhere.',
  'No tracking, no advertising, and no analytics service. The app tells Wealthit only which parts you use, as yes or no, never what you record.',
  'Nothing about you is sold, rented or shared with anyone for their own use.',
  'Receipt photos and your profile picture stay on your phone.',
];

export default function Privacy() {
  return (
    <div className="page">
      <main id="main">
        <PageHero cap="Privacy policy" title="Your money is yours to see." lead="Wealthit is a personal finance app. This privacy policy says what it keeps, why, where, who else handles it, and what you can do about it." />
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
            Wealthit is made by Faisal Mukhtar, who is responsible for the data described here. This policy covers the Wealthit app,
            Wealthit on the web and this website. Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> about anything on this page.
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
              share costs with, your settings, and the name you give yourself in the app. It is locked on your device before it is sent, so a lost
              phone loses nothing and every phone you sign in on shows the same money. Wealthit keeps only a locked copy it cannot open, and, for
              each record, an id, when it changed and when it was removed, which keeping your phones in step needs.
            </li>
            <li>
              <strong>The key that opens them</strong>, itself locked with your recovery key. Wealthit never sees your recovery key, so it cannot
              open the key, and cannot recover it if you lose it.
            </li>
            <li>
              <strong>Which parts of Wealthit you use</strong>, as yes or no: budgets, scheduled payments, goals, labels, split records, transfers,
              friends and family, and credit cards. Never an amount, a name or a date.
            </li>
            <li>
              <strong>If you sign in with Google or Apple</strong>, they tell Wealthit your email address and an id for that account. Wealthit
              never sees your Google or Apple password. If you choose Apple’s “Hide My Email”, Wealthit only ever sees the address Apple gives it.
            </li>
            <li>
              <strong>A password, only if you set one</strong>, stored only as an Argon2 hash, never the password itself. Sign-in codes are stored
              only as a keyed hash, and expire after ten minutes.
            </li>
            <li>
              <strong>When you joined and when you last used Wealthit</strong>, and a sign-in session for each phone you are signed in on, so
              you stay signed in. Logging out ends that phone’s session.
            </li>
          </ul>

          <h2>What the app asks your phone for</h2>
          <ul className={p.list}>
            <li>
              <strong>The camera</strong>, only when you take a photo of a receipt.
            </li>
            <li>
              <strong>Your photos</strong>, only the one you pick, for a receipt or your profile picture.
            </li>
            <li>
              <strong>Face or fingerprint unlock</strong>, only if you turn on the app lock. The phone checks it and tells the app yes or no.
            </li>
            <li>
              <strong>Notifications</strong>, only for the reminders you set up, which the phone schedules itself.
            </li>
          </ul>
          <p>Wealthit never asks for your location, your contacts or your bank login. You can say no to any of these and still use the app.</p>

          <h2>What stays on your phone</h2>
          <ul className={p.list}>
            <li>
              <strong>Everything, if you choose.</strong> Choose “Keep on this phone” when you sign in, or in Your data, and nothing you record is
              sent; any copy Wealthit had is deleted from its server. Only your sign-in stays.
            </li>
            <li>
              <strong>Your keys.</strong> Held in the phone’s own secure storage. On an iPhone your recovery key is also kept in your iCloud
              Keychain, which Apple encrypts end to end, so your other Apple devices can open your records without it being typed.
            </li>
            <li>
              <strong>Receipt photos.</strong> Read on the phone and kept with that record on the phone. They are not uploaded.
            </li>
            <li>
              <strong>Your profile picture.</strong> Copied into the app and kept on the phone.
            </li>
            <li>
              <strong>Your app lock PIN.</strong> Held in the phone’s own secure storage. Face ID, a fingerprint or face unlock is checked by the
              phone; the app is only told yes or no.
            </li>
            <li>
              <strong>Sample data.</strong> If you explore with sample data, it never leaves the phone and is never added to your account.
            </li>
            <li>
              <strong>Tap to Record.</strong> If you set it up with Apple Pay, the amount, the shop and the card’s name (as your wallet shows it,
              never its number) are handed to the app on the phone. The payment becomes a record like any other, and the card’s name is kept with
              your settings so the next payment finds its wallet.
            </li>
            <li>
              <strong>Widgets and reminders.</strong> Drawn and scheduled on the phone, by the phone. There are no push notifications.
            </li>
          </ul>

          <h2>Where it is kept</h2>
          <p>
            On your phone, and, locked, on Wealthit’s server: an application server run by Render and a database run by Neon, both in Frankfurt, in the EU.
            Every connection is encrypted. Each account’s records are kept apart by the database itself.
          </p>

          <h2>Who else handles it</h2>
          <p>A few services run parts of Wealthit. Each one handles your data only to do that job for Wealthit, never for its own use:</p>
          <ul className={p.list}>
            <li>
              <strong>Render</strong> runs the application server and <strong>Neon</strong> runs the database, both in Frankfurt.
            </li>
            <li>
              <strong>Resend</strong> sends the sign-in emails. It receives your address and the message, and nothing else.
            </li>
            <li>
              <strong>Zoho Mail</strong> receives the emails you send to {contactEmail}. A message is kept only as long as it takes to help you.
            </li>
            <li>
              <strong>Vercel</strong> runs, in Frankfurt, the design service the app asks for its look, and Wealthit’s own admin page. The admin
              page lets the person who runs Wealthit see that an account exists, when it joined, when it was last used, how many records it
              keeps and which parts of Wealthit it uses, as yes or no; never what those records say, which it cannot read. It can find an account by its email address to sign it out or delete it when you ask, it
              needs a password, and every change made with it is written to a log nobody can edit.
            </li>
            <li>
              <strong>Apple and Google</strong>, only if you choose to sign in with them, as described above.
            </li>
          </ul>
          <p>
            Wealthit only uses services whose terms commit them to protect your data at least as well as this policy does. Nothing about you is
            sold, rented or shared with anyone else, unless the law requires it.
          </p>

          <h2>Keeping it safe</h2>
          <ul className={p.list}>
            <li>
              Your records are locked end to end with AES-256, on your phone or in your browser, with a key made there. Only your devices hold
              it, and your recovery key, which you keep, opens it on a new one. Lose both your devices and your recovery key, and nobody,
              Wealthit included, can open your records again.
            </li>
            <li>Every connection between the app, the server and these services is encrypted.</li>
            <li>Passwords and sign-in codes are only ever stored as hashes.</li>
            <li>The database itself keeps each account’s records apart, so one person’s session can never read another’s.</li>
            <li>
              Your IP address is used for a few minutes to stop too many sign-in tries in a row. It is held in memory only and never stored.
            </li>
            <li>The server’s logs say what went wrong, never who it happened to: no email addresses, no codes, no records.</li>
          </ul>

          <h2>Why Wealthit can use it</h2>
          <ul className={p.list}>
            <li>
              <strong>To give you the service you signed up for</strong>: your account, your records, and the same money on every phone you
              sign in on.
            </li>
            <li>
              <strong>To keep it secure</strong>: stopping repeated sign-in tries, and signing out or deleting an account when you ask.
            </li>
            <li>
              <strong>Because you turned it on</strong>: daily exchange rates, Tap to Record and reminders. Turn them off and they stop.
            </li>
          </ul>

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
            <li>
              <strong>The receipt reader, on Android.</strong> Android reads receipts with Google’s ML Kit, on the phone. The photo and its
              text never leave the phone, but ML Kit sends Google its own diagnostics: the phone’s model and system version, Wealthit’s version,
              an id for this installation, and how long reading took and whether it failed. Google uses them to measure and improve ML Kit and
              does not share them (
              <a href="https://developers.google.com/ml-kit/android-data-disclosure" rel="noopener">
                Google’s disclosure
              </a>
              ).
            </li>
          </ul>
          <p>
            Like any request on the internet, these come from your phone’s IP address. Nothing is kept that links them to you.
          </p>

          <h2>Your choices</h2>
          <ul className={p.list}>
            <li>
              <strong>Keep your records on your phone only</strong>, or sync them again, from Advanced settings → Your data. Turning sync off
              deletes Wealthit’s copy.
            </li>
            <li>
              <strong>See or save your recovery key</strong> again from Advanced settings → Your data.
            </li>
            <li>
              <strong>Export</strong> your records at any time, as a backup file or a spreadsheet, from Advanced settings → Your data.
            </li>
            <li>
              <strong>Log out</strong> from the side menu. Your records stay in your account.
            </li>
            <li>
              <strong>Turn things off.</strong> Stop the daily exchange rates in Currency &amp; format, and remove Tap to Record by deleting its
              automation. Wealthit stops using them at once.
            </li>
            <li>
              <strong>Ask</strong> for a copy of what Wealthit holds about you, or for a correction, by writing to{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from the address you sign in with.
            </li>
            <li>
              <strong>Delete your account</strong>, as described below.
            </li>
          </ul>
          <p>
            You can also complain to the data protection authority where you live. We would rather hear from you first: a person reads every
            message.
          </p>

          <h2 id="delete-account">Deleting your account</h2>
          <ul className={p.list}>
            <li>
              <strong>In the app:</strong> open your profile (your picture at the top of Home or of the side menu), then Delete account.
            </li>
            <li>
              <strong>Without the app:</strong> write to <a href={`mailto:${contactEmail}?subject=Delete%20my%20Wealthit%20account`}>{contactEmail}</a>{' '}
              from the address you sign in with and ask for your account to be deleted. It is deleted straight away, and you get a reply when it
              is done.
            </li>
          </ul>
          <p>
            What is deleted: your account, your email address, your account’s id and everything you recorded, with your settings. From the app,
            you are signed out on every phone and that phone is cleared, and 60 days later all of it is deleted from the server for good. Changed
            your mind? Sign in before then and everything comes back. If you signed in with Apple, Wealthit hands that sign-in back to Apple
            straight away. Receipt photos and your profile picture were only ever on your phone; they go when you delete the app.
          </p>

          <h2>How long it is kept</h2>
          <p>
            For as long as you have an account. When you delete it, it is removed for good 60 days later, unless you sign in again before then.
            The database keeps a recovery history of the last six hours of changes, so once something is deleted for good, it is gone from that
            history within six hours as well. Emails you send to {contactEmail} are kept only as long as it takes to help you.
          </p>

          <h2>Wealthit on the web</h2>
          <p>
            At dashboard.wealthit.app you sign in with the same account, with an email code or your password, and see the same records. The
            first time, it asks for your recovery key to open them. Your browser keeps your sign-in, the key and a working copy of your records
            in its own storage, so the page opens quickly; there are no cookies. Signing out erases your sign-in and the copy, and keeps the
            key so you won’t type it again in that browser, unless you turn on “Forget my key when I sign out”. The web app is hosted by GitHub Pages, asks open.er-api.com for exchange rates in the same way as the app,
            and runs no tracking, advertising or analytics service.
          </p>

          <h2>Children</h2>
          <p>Wealthit is a personal finance app for adults. It is not directed at children, and it does not knowingly keep anything about a child.</p>

          <h2>This website</h2>
          <p>
            The page you are reading is a static file, hosted by GitHub Pages. It sets no cookies, runs no analytics and embeds nothing from
            anywhere else. GitHub can see the ordinary request logs any web server keeps (an IP address, a page, a time), and that is the only
            record of your visit. If you switch the site between dark and light, that choice is saved in your own browser and never sent
            anywhere.
          </p>

          <h2>Changes</h2>
          <p>If the app starts doing something this page does not describe, this page changes first, and the date at the top changes with it.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
