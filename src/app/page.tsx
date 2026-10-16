import { SiteFooter } from '@/components/SiteFooter';
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
import { Story } from '@/sections/home/Story';
import { Themes } from '@/sections/home/Themes';
import { WebApp } from '@/sections/home/WebApp';
import { Whole } from '@/sections/home/Whole';

/**
 * The homepage: butter.video's structure and rhythm (docs/BUTTER_REFERENCE.md) carrying Wealthit —
 * the keyring, the currencies, the statement, recording and scanning, the whole picture, the
 * features, three ways to record, the screens, bills, two big claims, making it yours, privacy,
 * the web app, questions, and the next step.
 */
export default function Home() {
  return (
    <div className="page">
      <HomeHero />
      <main id="main">
        <Countries />
        <Statement />
        <Moments />
        <Story
          caption="Recording"
          parts={['Write each payment the way you’d say it — tap +, type the amount, pick what it was for. No forms, just the blanks.']}
          video="record-expense-dark"
          alt="Recording an expense in Wealthit: the amount, then the category, then Done"
        />
        <Story
          caption="Scan a receipt"
          side="left"
          parts={['Point your camera at a receipt. It’s read on your phone and filled in for you — you just check it.']}
          video="scan-receipt-dark"
          alt="Wealthit reading a Harbour Lane Supermarket receipt: the scan line, then the record filled in, AED 86.50"
        />
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
