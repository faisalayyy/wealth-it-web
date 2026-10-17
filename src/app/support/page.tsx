import type { Metadata } from 'next';
import { faqSchema, JsonLd, pageMeta } from '@/lib/seo';
import { SiteFooter } from '@/components/SiteFooter';
import { HelpHero } from '@/sections/help/HelpHero';
import { Closing } from '@/sections/home/Closing';
import { Faq, type QA } from '@/sections/home/Faq';

/**
 * Help, and the URL the App Store asks for (the app's About screen links here). It answers first
 * and offers an address second: almost every question about the app is one the page can settle
 * faster than a reply could. The answers are the app session's (branch privacy-accounts of this
 * site, 11 October 2026), checked against the app as built.
 */
export const metadata: Metadata = pageMeta({
  title: 'Help',
  description: 'Answers to the questions Wealthit gets about new phones, sign-in, currencies that will not convert and the rest, with a way to write to us.',
  path: '/support/',
});

const ACCOUNT: QA[] = [
  {
    q: 'I got a new phone. How do I move my records across?',
    a: [
      'Install Wealthit on the new phone and sign in the way you signed in before: Apple, Google, or your email. Everything you recorded comes down from your account.',
      'Receipt photos and your profile picture stay on the old phone, because they are never uploaded.',
    ],
  },
  {
    q: 'I lost my phone. What can be recovered?',
    a: ['Everything you recorded, as of the last time the phone was online. Sign in on any phone and it is there.', 'If you had an app lock on the lost phone, the records on it stay behind that lock.'],
  },
  {
    q: 'Can I use Wealthit on two phones?',
    a: ['Yes. Sign in to the same account on both and they show the same money. A record made offline goes up as soon as that phone is back online.'],
  },
  {
    q: 'I did not get the sign-in email.',
    a: [
      'Check spam and other folders, and that the address is spelt right. The email comes from no-reply@wealthit.app and its link and code last ten minutes.',
      'You can also sign in with Apple or Google, or set a password in your profile so email is never needed.',
    ],
  },
  {
    q: 'I have forgotten my app lock PIN.',
    a: [
      'After two wrong tries, the lock screen offers to log you out. Sign in again with Apple, Google or your email, and your records come back from your account. The old PIN is removed, so you can set a new one in Advanced settings → Security.',
      'If you also turned on Face ID for the lock, Face ID still opens the app.',
    ],
  },
  {
    q: 'How do I delete my account?',
    a: [
      'Open your profile and choose Delete account. You are signed out everywhere and the phone is cleared, and 60 days later the account and everything in it are deleted for good. Sign in before then to change your mind.',
      'To have it deleted straight away, write to the address at the top of this page from the email you sign in with.',
    ],
  },
];

const MONEY: QA[] = [
  {
    q: 'A figure is missing from my total, and the app says so.',
    a: [
      'That is an amount in a currency the app could not convert. It uses a rate you got yourself on a transfer between two of your wallets, a published peg such as AED to the dollar, or the day’s published rate. It never guesses.',
      'If daily rates are switched off in Currency & format, switching them on usually settles it. Until then the amount is shown in its own currency rather than folded into a total that would be wrong.',
    ],
  },
  {
    q: 'My transfer is not showing up in spending.',
    a: ['It should not. Moving your own money from one wallet to another is not an expense, and no total, chart or budget in the app treats it as one. Both halves of it appear in the wallets themselves.'],
  },
  {
    q: 'Did my scheduled payment post twice?',
    a: [
      'It cannot. Each occurrence takes its identity from its schedule and its date, so the same rent on the same first of the month is the same record however many times the app is opened, on however many phones.',
      'If you are seeing two, one of them was almost certainly entered by hand. Open both and check the times.',
    ],
  },
  {
    q: 'Reminders are not arriving.',
    a: ['Check the phone’s own notification settings for Wealthit. Reminders are scheduled on the phone and the app can only ask. If the system refuses, the screen in the app says so rather than claiming it worked.'],
  },
];

const PRIVACY: QA[] = [
  {
    q: 'What is the difference between hiding amounts and locking the app?',
    a: [
      'Hiding amounts scrambles the digits on screen so the person next to you cannot read them. It is privacy, not security, and the data underneath is untouched.',
      'The app lock is a PIN or Face ID, and it keeps the app closed.',
    ],
  },
  {
    q: 'Who can see my records?',
    a: [
      'You. They are kept on your phone and in your account on Wealthit’s server in Frankfurt, in the EU, and nobody reads them. There is no tracking, no advertising and no analytics, and receipt photos never leave your phone.',
      'The privacy policy says everything that is kept, where, and for how long.',
    ],
  },
];

export default function Support() {
  return (
    <div className="page">
      <main id="main">
        <HelpHero />
        <JsonLd data={faqSchema([...ACCOUNT, ...MONEY, ...PRIVACY])} />
        <Faq sectionId="account" cap="Your account and your phones" title="Signing in, new phones, and leaving." items={ACCOUNT} more={false} />
        <Faq sectionId="money" cap="Money and records" title="When a number looks wrong." items={MONEY} more={false} />
        <Faq sectionId="privacy" cap="Privacy" title="Yours, and only yours." items={PRIVACY} more={false} />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
