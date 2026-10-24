import type { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Shot } from '@/components/Shot';
import { SiteFooter } from '@/components/SiteFooter';
import type { Fact, Row } from '@/lib/features';
import { breadcrumbs, JsonLd, pageMeta } from '@/lib/seo';
import { Closing } from '@/sections/home/Closing';
import { Facts } from '@/sections/product/Facts';
import { PageHero } from '@/sections/product/PageHero';
import { Rows } from '@/sections/product/Rows';

/**
 * Security: what keeps your money private, gathered in one place, laid out as a feature page. Every
 * line is one the privacy policy (src/app/privacy) or Help already makes, in the words of the app's
 * own screens (A429 keep on this phone, A430 and A439 only you can read, the app lock, hidden
 * amounts); the policy stays the full and legal version. If a claim here changes in the app, it
 * changes here and in the policy on the same day.
 */
export const metadata: Metadata = pageMeta({
  title: 'Security and privacy',
  description:
    'How Wealthit keeps your money private: no bank login, no tracking or ads, an app lock, hidden amounts, records synced or kept on your phone only, and a lock so only you can read them.',
  path: '/security/',
});

const ROWS: Row[] = [
  {
    cap: 'Where your records live',
    title: 'Synced, or on this phone only.',
    text: 'Right after you sign in, you choose. Sync with my account backs your records up, so they’re the same on every phone and on the web. Keep on this phone keeps them on that phone and never sends them anywhere. You can change it any time in Your data.',
    media: { screen: 'where-records-live-dark', dark: true },
  },
  {
    cap: 'Only you can read',
    title: 'Locked with a key only you hold.',
    text: 'Turn on “Only you can read your records” in Your data and they’re locked on your phone before they’re sent, so not even Wealthit can read them. You get a recovery key, which opens them on a new phone or on the web, and nobody can recover it for you. It’s off unless you turn it on, and only then is there a key to keep.',
    media: { screen: 'recovery-key-dark', dark: true },
  },
  {
    cap: 'App lock',
    title: 'A PIN, your face or your fingerprint.',
    text: 'Lock Wealthit so it opens only for you. The PIN is kept in your phone’s own secure storage, and your face or fingerprint is checked by the phone, which tells the app only yes or no.',
    media: { screen: 'app-lock-dark', dark: true },
  },
  {
    cap: 'Hide amounts',
    title: 'One tap, and nobody can read them.',
    text: 'Tap the eye and every amount on screen turns to drifting dots, so the person next to you can’t read a thing. Tap it again to see them.',
    media: { video: 'hide-amounts-dark', label: 'Hiding every amount on Home with a tap on the eye, and showing them again', dark: true },
  },
  {
    cap: 'No bank login',
    title: 'Wealthit never asks for your bank password.',
    text: 'You record what you spend yourself: as a sentence, from a receipt, or with Tap to Record when you pay with Apple Pay. Nothing connects to your bank.',
    media: { crop: 'record-sentence', dark: true },
  },
];

const FACTS: Fact[] = [
  { title: 'Encrypted', text: 'Every connection is encrypted, and your records are encrypted on the server too.' },
  { title: 'Kept in the EU', text: 'Wealthit’s server and database are in Frankfurt.' },
  { title: 'No tracking or ads', text: 'No tracking, advertising or analytics service. The app tells Wealthit only which parts you use, as yes or no.' },
  { title: 'Passwords never stored', text: 'A password, if you set one, is kept only as a hash. Sign-in codes expire after ten minutes.' },
  { title: 'Photos stay on your phone', text: 'Receipt photos and your profile picture are never uploaded.' },
  { title: 'Sign-in limits', text: 'Too many sign-in tries in a row are stopped. Your IP address is used for that in memory only, and never stored.' },
  { title: 'Nobody reads your records', text: 'Wealthit’s own admin page shows only counts and dates, never what your records say.' },
  { title: 'Delete any time', text: 'From your profile, gone for good 60 days later. Or write to us and it’s deleted straight away.' },
];

export default function Security() {
  return (
    <div className="page">
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Security', path: '/security/' },
          ])}
        />
        <PageHero
          cap="Security"
          title="Your money, kept private."
          lead="Wealthit never asks for your bank login, and it doesn’t track you or show you ads. Lock the app, hide the amounts, and choose where your records live and who can read them."
          dark
          actions={
            <>
              <Button label="Get the app" href="/#get" tone="brand" />
              <Button label="Read the privacy policy" href="/privacy/" tone="ink" variant="secondary" />
            </>
          }
          media={<Shot media={{ screens: ['home-hidden-dark', 'your-data-dark'] }} sizes="(max-width: 743px) 64vw, 300px" />}
        />
        <Rows rows={ROWS} />
        <Facts title="And underneath it all." facts={FACTS} />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
