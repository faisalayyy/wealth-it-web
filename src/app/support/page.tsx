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
 * site, 11 October 2026), checked against the app as built; where records live and the recovery key
 * are the app's A429, A430 and A439, in the words of its own Your data and sign-in screens.
 */
export const metadata: Metadata = pageMeta({
  title: 'Help and FAQs',
  description: 'Answers to common Wealthit questions: moving to a new phone, where your records live, the recovery key, currencies that won’t convert, app lock and deleting your account. Or write to us.',
  path: '/support/',
});

const ACCOUNT: QA[] = [
  {
    q: 'I got a new phone. How do I move my records across?',
    a: [
      'Install Wealthit on the new phone and sign in the way you signed in before: Apple, Google, or your email. Everything you recorded comes down from your account.',
      'If you keep your records on the old phone only, turn on Sync with my account there first, or export a backup there and import it on the new phone. Both are in Advanced settings → Your data.',
      'If your records are locked so only you can read them, the new phone asks for your recovery key.',
      'Receipt photos and your profile picture stay on the old phone, because they are never uploaded.',
    ],
  },
  {
    q: 'I lost my phone. What can be recovered?',
    a: [
      'If your records sync with your account: everything you recorded, as of the last time the phone was online. Sign in on any phone and it is there. Records kept on that phone only go with it.',
      'If you had an app lock on the lost phone, the records on it stay behind that lock.',
    ],
  },
  {
    q: 'Can I use Wealthit on two phones?',
    a: ['Yes. Sign in to the same account on both, with Sync with my account on, and they show the same money. A record made offline goes up as soon as that phone is back online.'],
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
      'After two wrong tries, the lock screen offers to log you out. Sign in again with Apple, Google or your email, and if your records sync with your account, they come back from it. The old PIN is removed, so you can set a new one in Advanced settings → Security.',
      'Records kept on this phone only are erased when you log out, because they are nowhere else. A backup file is worth keeping.',
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

const RECORDS: QA[] = [
  {
    q: 'Where are my records kept?',
    a: [
      'You choose, right after you sign in. Sync with my account backs them up to your account, so they’re the same on every phone you sign in on and on the web. Keep on this phone keeps them on this phone only and never sends them anywhere: lose the phone or delete Wealthit, and they go with it.',
      'You can change this any time in Advanced settings → Your data. Records kept on a phone only don’t show on the web, which reads your account.',
    ],
  },
  {
    q: 'What does “Only you can read your records” do?',
    a: [
      'It locks your records on your phone before they’re sent, with a key only you hold, so not even Wealthit can read them. Without it, your records are kept in your account encrypted on the way and on the server, as most finance apps keep them.',
      'It’s off unless you turn it on, in Advanced settings → Your data, while your records sync with your account. Turning it on gives you a recovery key. Turning it off sends your records again as they are, and the key stops working.',
    ],
  },
  {
    q: 'What is the recovery key?',
    a: [
      'Twenty-four letters and numbers, in six groups of four. On a new phone or on the web, it opens your locked records. Wealthit never sees it and can’t recover it for you, so keep it somewhere safe. The app asks you to type its last group back, to be sure you saved it.',
      'While a phone keeps it, you can see it again there in Advanced settings → Your data → Recovery key. On a computer other people use, turn on “Forget my key when I sign out” on the web.',
    ],
  },
  {
    q: 'I lost my recovery key.',
    a: [
      'If one of your phones still has it, open Advanced settings → Your data → Recovery key there and save it again.',
      'If none does, choose “Lost your key?” where the app asks for it. Your account’s records can’t be opened without the key, so they’re deleted from your account. What is on the phone you’re using stays. Nobody, Wealthit included, can unlock them for you.',
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
      'You. They are kept on your phone and, if you sync, in your account on Wealthit’s server in Frankfurt, in the EU, and nobody reads them. Turn on “Only you can read your records” and not even Wealthit can. There is no tracking, advertising or analytics service, and receipt photos never leave your phone.',
      'The privacy policy says everything that is kept, where, and for how long.',
    ],
  },
];

export default function Support() {
  return (
    <div className="page">
      <main id="main">
        <HelpHero />
        <JsonLd data={faqSchema([...ACCOUNT, ...RECORDS, ...MONEY, ...PRIVACY])} />
        <Faq sectionId="account" cap="Your account and your phones" title="Signing in, new phones, and leaving." items={ACCOUNT} more={false} />
        <Faq sectionId="records" cap="Your records and your key" title="Where your records live." items={RECORDS} more={false} />
        <Faq sectionId="money" cap="Money and records" title="When a number looks wrong." items={MONEY} more={false} />
        <Faq sectionId="privacy" cap="Privacy" title="Yours, and only yours." items={PRIVACY} more={false} />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
