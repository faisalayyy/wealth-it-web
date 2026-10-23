import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Button } from '@/components/Button';
import { Shot } from '@/components/Shot';
import { SiteFooter } from '@/components/SiteFooter';
import { featurePages } from '@/lib/features';
import { Closing } from '@/sections/home/Closing';
import { Bands } from '@/sections/product/Bands';
import { Facts } from '@/sections/product/Facts';
import { PageHero } from '@/sections/product/PageHero';
import { Switcher } from '@/sections/product/Switcher';

export const metadata: Metadata = pageMeta({
  title: 'Features: spending, budgets, bills and goals',
  description: 'What Wealthit does: log spending in a sentence, scan receipts, record Apple Pay payments, add up 26 currencies, and plan budgets, bills and savings goals.',
  path: '/features/',
});

/**
 * What the app does, after the reference's product page: the headline and the app, then every
 * feature as a band with a way to its own page, a floating switcher between them, the smaller
 * things, and the way to the app.
 */
export default function Features() {
  return (
    <div className="page">
      <main id="main">
        <PageHero
          cap="Features"
          title="Everything you need for better money habits."
          lead="Log what you spend in a sentence or a photo and see every account added up, whatever the currency. Then plan ahead with budgets, bill reminders and savings goals."
          actions={
            <>
              <Button label="Get the app" href="/#get" tone="brand" />
              <Button label="Start with recording" href="/features/recording/" tone="ink" variant="secondary" />
            </>
          }
          media={<Shot media={{ screens: ['record-sheet-dark', 'home-dark', 'budgets-dark'] }} sizes="(max-width: 743px) 64vw, 300px" />}
        />
        <Bands features={featurePages} />
        <Facts
          title="And the rest, too."
          facts={[
            { title: 'The same on every phone', text: 'Sign in on another phone and your records are there. A record made offline goes up when you’re back online.' },
            { title: 'Your data, yours to take', text: 'Export everything at any time, as a backup file or a spreadsheet.' },
            { title: 'App lock', text: 'Face ID or a PIN keeps the app closed. The PIN never leaves your phone.' },
            { title: 'Reminders', text: 'For bills due and budgets running low, scheduled on your phone.' },
            { title: 'No bank login', text: 'Wealthit never asks for your bank password. You record what you spend, and it does the adding up.' },
            { title: 'No ads, no tracking', text: 'No advertising anywhere, and no analytics service. The app only says which parts you use.' },
          ]}
        />
        <Closing />
      </main>
      <Switcher label="Features on this page" items={featurePages.map(f => ({ id: f.slug, label: f.label }))} />
      <SiteFooter />
    </div>
  );
}
