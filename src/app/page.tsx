import { SiteFooter } from '@/components/SiteFooter';
import { Closing } from '@/sections/home/Closing';
import { CurrencyTicker } from '@/sections/home/CurrencyTicker';
import { DoubleBlock } from '@/sections/home/DoubleBlock';
import { Faq } from '@/sections/home/Faq';
import { FeatureCards } from '@/sections/home/FeatureCards';
import { Gallery } from '@/sections/home/Gallery';
import { HomeHero } from '@/sections/home/HomeHero';
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
        <CurrencyTicker />
        <Statement />
        <Story
          caption="Recording"
          parts={[
            'Write each payment the way you’d say it',
            { cut: 'composer-sheet', label: 'I spent AED 86.50 on Groceries from Main bank, today' },
            '— no forms, just the blanks to fill in.',
          ]}
          screen="composer-dark"
          alt="Recording an expense in Wealthit as a sentence"
        />
        <Story
          caption="Scan a receipt"
          side="left"
          parts={[
            'Snap a receipt',
            { cut: 'scan-reading', label: 'the app reading a supermarket receipt' },
            'and it fills itself in. You just check it.',
          ]}
          screen="scan-done-dark"
          alt="A scanned receipt, turned into a record to check"
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
