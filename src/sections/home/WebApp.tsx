import { coined } from '@/components/Coin';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { webApp } from '@/lib/site';
import s from './WebApp.module.css';

/**
 * On a computer, too: the web app (../WebApp) signs in to the same account and keeps the same
 * records in step with the phone. Until it has an address (src/lib/site.ts) this says it is coming;
 * then it becomes the way in. Only what the web app already does is named here.
 */
export function WebApp() {
  return (
    <section className={s.section} aria-labelledby="web-title" data-ground="light">
      <div className={`wrap ${s.card}`}>
        <div className={s.picture}>
          <Photo name="laptop-coffee" alt="A woman in a pink hijab working on a laptop on a sofa, a cup of coffee on the table beside her" height={1013} className={s.photo} sizes="(max-width: 743px) 100vw, 40vw" focus="60% 50%" />
        </div>
        <div className={s.copy}>
          <span className={s.icon} aria-hidden>
            <Icon name="globe" size={22} />
          </span>
          <h2 id="web-title" className={s.title}>
            {coined('On your computer, too.')}
          </h2>
          <p className={s.text}>
            Sign in on the web with the same account and your records are there, with your budgets, bills and goals on a bigger screen.
            Add one on your laptop and it shows on your phone within seconds.
          </p>
          {webApp ? (
            <a href={webApp} className={s.go}>
              Open Wealthit on the web
              <Icon name="arrow-up-right" size={16} />
            </a>
          ) : (
            <span className={s.soon}>Coming soon</span>
          )}
        </div>
      </div>
    </section>
  );
}
