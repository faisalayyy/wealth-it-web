import { AppButtons } from '@/components/AppButtons';
import { coined } from '@/components/Coin';
import { Mark } from '@/components/Logo';
import { site } from '@/lib/site';
import s from './Closing.module.css';

/**
 * The next step, at the end of every page: a Forest panel with the mark, the brand's line, and the
 * store buttons — which say "Coming soon" and lead nowhere until the app is listed (src/lib/site.ts).
 */
export function Closing() {
  return (
    <section className={s.section} id="get" aria-labelledby="get-title" data-ground="light">
      <div className={`wrap ${s.panel}`}>
        <Mark className={s.mark} tone="dark" />
        <h2 id="get-title" className={`display-1 ${s.title}`}>
          {coined(site.tagline)}
        </h2>
        <p className={`lead ${s.lead}`}>Wealthit is coming soon to iPhone, with Android to follow. Sign up when it lands, and your first record takes a few seconds.</p>
        <AppButtons tone="light" className={s.buttons} />
      </div>
    </section>
  );
}
