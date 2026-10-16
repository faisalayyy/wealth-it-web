import { AppButtons } from '@/components/AppButtons';
import { Button } from '@/components/Button';
import { ThreeCanvas } from '@/three/ThreeCanvas';
import s from './MediaHero.module.css';

/**
 * "All your money, in one app." A dark, full-bleed scene: the phone standing inside the ring,
 * showing the real Dashboard, with the words over its left side and the store buttons along the
 * bottom. No motion of its own beyond the scene — the reference keeps this one still, too.
 */
export function MediaHero() {
  return (
    <section className={s.hero} id="app" aria-labelledby="media-title" data-ground="dark">
      <div className={s.background}>
        <ThreeCanvas scene="ring" className={s.canvas} />
      </div>
      <div className={`g-row ${s.row}`}>
        <div className={`g-col ${s.col}`}>
          <h2 id="media-title" className="title-3 -medium">
            All your money,
            <br />
            in one app.
          </h2>
          <p className="subhead-2 -medium">Sign up once. Nothing to connect. Then start writing it down.</p>
          <div className={s.ctas}>
            <Button label="Get started" href="/#get" tone="neutral" variant="primary" />
          </div>
        </div>
      </div>
      <div className={`g-row-full ${s.bottom}`}>
        <AppButtons tone="light" />
      </div>
    </section>
  );
}
