import { AppButtons } from '@/components/AppButtons';
import { coined } from '@/components/Coin';
import { Mark } from '@/components/Logo';
import { Photo } from '@/components/Photo';
import { site } from '@/lib/site';
import s from './Closing.module.css';

/**
 * The next step, at the end of every page: a Forest panel with the mark, the brand's line, and the
 * store buttons — which say "Coming soon" and lead nowhere until the app is listed (src/lib/site.ts)
 * — beside a family at home, the life the small steps are for.
 */
export function Closing() {
  return (
    <section className={s.section} id="get" aria-labelledby="get-title" data-ground="light">
      <div className={`wrap ${s.panel}`}>
        <div className={s.picture}>
          <Photo name="family-evening" alt="A family relaxing together at home in the evening" height={1200} className={s.photo} sizes="(max-width: 899px) 100vw, 45vw" focus="60% 45%" />
        </div>
        <div className={s.body}>
        <Mark className={s.mark} tone="dark" />
        <h2 id="get-title" className={`display-1 ${s.title}`}>
          {site.tagline.split(/(?<=\.) /).map((line, i, all) => (
            <span key={line} className={s.line}>
              {i === all.length - 1 ? coined(line) : line}
            </span>
          ))}
        </h2>
        <p className={`lead ${s.lead}`}>Wealthit is coming soon to iPhone, with Android to follow. Sign up when it lands, and your first record takes a few seconds.</p>
        <AppButtons tone="light" className={s.buttons} />
        </div>
      </div>
    </section>
  );
}
