import type { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Shot } from '@/components/Shot';
import { SiteFooter } from '@/components/SiteFooter';
import { featurePages } from '@/lib/features';
import { Closing } from '@/sections/home/Closing';
import { Bands } from '@/sections/product/Bands';
import { Facts } from '@/sections/product/Facts';
import { PageHero } from '@/sections/product/PageHero';
import { Switcher } from '@/sections/product/Switcher';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Record a payment in a sentence or a photo, see every account in one total, and plan budgets, bills and goals — what Wealthit does, feature by feature.',
};

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
          title="Everything you need to know where you stand."
          lead="Write down what you spend in a sentence or a photo. See every account, in every currency, added up. Plan what is coming — budgets, bills and goals."
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
            { title: 'The same on every phone', text: 'Sign in on another phone and your records are there. A record made offline goes up when you are back online.' },
            { title: 'Your data, to take', text: 'Export everything at any time, as a backup file or a spreadsheet.' },
            { title: 'App lock', text: 'Face ID or a PIN keeps the app closed. The PIN never leaves your phone.' },
            { title: 'Reminders', text: 'For bills due and budgets running low, scheduled on your phone.' },
            { title: 'No bank login', text: 'Wealthit never asks for your bank password. You record what you spend; it adds it up.' },
            { title: 'No ads, no tracking', text: 'No advertising and no analytics, in the app or on this site.' },
          ]}
        />
        <Closing />
      </main>
      <Switcher label="Features on this page" items={featurePages.map(f => ({ id: f.slug, label: f.label }))} />
      <SiteFooter />
    </div>
  );
}
