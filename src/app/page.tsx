import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { appSchema, JsonLd, pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import { Closing } from '@/sections/home/Closing';
import { Countries } from '@/sections/home/Countries';
import { DoubleBlock } from '@/sections/home/DoubleBlock';
import { Faq } from '@/sections/home/Faq';
import { FeatureCards } from '@/sections/home/FeatureCards';
import { Gallery } from '@/sections/home/Gallery';
import { HomeHero } from '@/sections/home/HomeHero';
import { Moments } from '@/sections/home/Moments';
import { Planning } from '@/sections/home/Planning';
import { Privacy } from '@/sections/home/Privacy';
import { RecordTabs } from '@/sections/home/RecordTabs';
import { Statement } from '@/sections/home/Statement';
import { TapToRecord } from '@/sections/home/TapToRecord';
import { Story } from '@/sections/home/Story';
import { Themes } from '@/sections/home/Themes';
import { WebApp } from '@/sections/home/WebApp';
import { Whole } from '@/sections/home/Whole';

/**
 * The homepage: butter.video's structure and rhythm (docs/BUTTER_REFERENCE.md) carrying Wealthit —
 * the keyring, the countries, the statement, everyday moments, recording, scanning and Tap to Record, the whole picture, the
 * features, three ways to record, the screens, bills, two big claims, making it yours, privacy,
 * the web app, questions, and the next step.
 */
const meta = pageMeta({ title: site.title, description: site.description, path: '/' });
export const metadata: Metadata = {
  ...meta,
  title: { absolute: site.title },
  openGraph: { ...meta.openGraph, title: site.title },
  twitter: { ...meta.twitter, title: site.title },
};

export default function Home() {
  return (
    <div className="page">
      <JsonLd data={appSchema} />
      <HomeHero />
      <main id="main">
        <Countries />
        <Statement />
        <Moments />
        <Story
          caption="Recording"
          parts={['Write each payment the way you’d say it. Tap +, type the amount and pick what it was for. No forms, no spreadsheet energy.']}
          video="record-expense-dark"
          alt="Recording an expense in Wealthit: typing the amount, choosing the category, then tapping Done"
        />
        <Story
          caption="Scan a receipt"
          side="left"
          parts={['Point your camera at a receipt. It’s read on your phone and filled in, ready for you to check.']}
          video="scan-receipt-dark"
          alt="Wealthit’s receipt scanner reading a Harbour Lane Supermarket receipt, then the record filled in for AED 86.50"
        />
        <TapToRecord />
        <Whole />
        <FeatureCards />
        <RecordTabs />
        <Gallery />
        <Planning />
        <DoubleBlock />
        <Themes />
        <Privacy />
        <WebApp />
        <Faq />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
