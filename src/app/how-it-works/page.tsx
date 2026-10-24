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
 * How it works: Wealthit from the first sign-in to knowing where you stand, in five steps, laid out
 * as a feature page. Each step is what the app does as built (A429 for where records live), shown
 * with its own captures and recordings; the feature pages carry the detail.
 */
export const metadata: Metadata = pageMeta({
  title: 'How it works',
  description:
    'How Wealthit works: sign in, add your accounts and cards in any of 26 currencies, record what you spend in seconds, plan budgets, bills and goals, and see where you stand.',
  path: '/how-it-works/',
});

const ROWS: Row[] = [
  {
    cap: 'Step 1 · Sign in',
    title: 'Sign in, then choose where your records live.',
    text: 'Sign in with Apple, Google or your email. Then choose: sync with your account, so every phone and the web show the same money, or keep everything on this phone only.',
    media: { screen: 'where-records-live-dark', dark: true },
  },
  {
    cap: 'Step 2 · Add your money',
    title: 'Every account and card, in its own currency.',
    text: 'Add your bank accounts, cards, cash and savings, each in its own currency, from 26 of them. Wealthit adds them up to one total and your net worth.',
    media: { screen: 'wallets-dark', dark: true },
  },
  {
    cap: 'Step 3 · Record as you go',
    title: 'A payment takes seconds.',
    text: 'Type it as one short sentence, scan the receipt, or pay with Apple Pay and tap Save on your Lock Screen. Each payment is filed under its category and its wallet.',
    media: { video: 'record-expense-dark', label: 'Recording an expense: typing 65, choosing Restaurant, Done, and Home updating', dark: true },
  },
  {
    cap: 'Step 4 · Plan ahead',
    title: 'Budgets, bills and goals.',
    text: 'Set budgets that tell you before you overspend, let bills and subscriptions come round on their day, and save towards goals with a monthly amount to aim for.',
    media: { screens: ['budgets-dark', 'goals-dark'], dark: true },
  },
  {
    cap: 'Step 5 · See where you stand',
    title: 'One look at Home.',
    text: 'Home shows your total, what you spent today, this month’s spending and what’s coming up. Statistics show where it went and where your balance is heading.',
    media: { screens: ['home-dark', 'statistics-dark'], dark: true },
  },
];

const FACTS: Fact[] = [
  { title: 'Works offline', text: 'Record without a connection. If you sync, it goes up to your account when you’re back online.' },
  { title: 'On the web too', text: 'Sign in at dashboard.wealthit.app with the same account and your records are there.' },
  { title: 'Your data, yours to take', text: 'Export everything at any time, as a backup file or a spreadsheet.' },
  { title: 'Reminders', text: 'For bills due and budgets running low, scheduled on your phone.' },
  { title: 'Light or dark', text: 'Whichever you like, on every screen.' },
  { title: 'No bank login', text: 'Wealthit never asks for your bank password. You record, and it does the adding up.' },
];

export default function HowItWorks() {
  return (
    <div className="page">
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'How it works', path: '/how-it-works/' },
          ])}
        />
        <PageHero
          cap="How it works"
          title="Small steps, added up."
          lead="Sign in, add your accounts in any currency, and record what you spend as you go. Wealthit adds it all up, so you can see where you stand, what’s coming and what’s left."
          dark
          actions={
            <>
              <Button label="Get the app" href="/#get" tone="brand" />
              <Button label="All features" href="/features/" tone="ink" variant="secondary" />
            </>
          }
          media={<Shot media={{ screens: ['record-sheet-dark', 'home-dark', 'budgets-dark'] }} sizes="(max-width: 743px) 64vw, 300px" />}
        />
        <Rows rows={ROWS} />
        <Facts facts={FACTS} />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
