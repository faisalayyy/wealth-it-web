'use client';

import { useEffect, useRef } from 'react';
import { gsap, reducedMotion, ScrollTrigger, useGSAP, vh } from '@/animation/gsap';
import { scrollToTarget, useLenis } from '@/animation/SmoothScroll';
import { Phone, ScreenLayer } from '@/components/Phone';
import type { ScreenName } from '@/lib/screens';
import s from './Walkthrough.module.css';

/**
 * Writing down an expense, start to finish, on the real screens: the Dashboard, the amount on the
 * app's own keypad, the subcategory, the finished sentence, the record. It plays by itself while
 * it is on screen — five steps with a numbered stepper you can jump around in — and when the
 * record is written down it clears back to the Dashboard and starts again. If you stop scrolling
 * near it, the page settles onto it.
 */
const STEPS: Array<{ label: string; screen: ScreenName; length: number }> = [
  { label: 'Wallet', screen: 'dashboard', length: 6.6 },
  { label: 'Amount', screen: 'tx-keypad-filled', length: 6.6 },
  { label: 'Category', screen: 'tx-category', length: 3.2 },
  { label: 'Review', screen: 'tx-filled', length: 3.2 },
  { label: 'Done', screen: 'tx-detail', length: 3 },
];

/** The numbered steps. Progress is written straight onto the elements while the timeline plays. */
function Stepper({ onSeek }: { onSeek: (i: number) => void }) {
  return (
    <ul className={`${s.stepper} body-small`}>
      {STEPS.map((st, i) => (
        <li key={st.label}>
          <button type="button" data-step-button data-active={i === 0} onClick={() => onSeek(i)} aria-label={`Step ${i + 1}: ${st.label}`}>
            <span className={s.stepRow}>
              <span className={`${s.index} -book`}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="12" />
                  <circle cx="12" cy="12" r="12" />
                </svg>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className={`${s.stepLabel} -medium`} data-label>
                <span>{st.label}</span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function Walkthrough() {
  const root = useRef<HTMLElement>(null);
  const master = useRef<gsap.core.Timeline | null>(null);
  const introRef = useRef<gsap.core.Tween | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const art = (i: number) => q(`[data-step="${i + 1}"]`)[0] as HTMLElement;
      const layers = q('[data-layer]') as HTMLElement[];
      const phone = q('[data-phone]')[0] as HTMLElement;
      const buttons = q('[data-step-button]') as HTMLElement[];
      // each label's width, so the active one can open to exactly its text
      buttons.forEach(b => {
        const label = b.querySelector<HTMLElement>('[data-label]');
        if (label) label.style.setProperty('--w', `${(label.firstElementChild as HTMLElement).offsetWidth}px`);
      });

      const heading = {
        enter: (tl: gsap.core.Timeline, el: Element, at: string) => tl.from(el, { duration: 0.6, ease: 'power2.out', opacity: 0, y: 20 }, at),
        leave: (tl: gsap.core.Timeline, el: Element, at: string) => tl.to(el, { duration: 0.5, ease: 'power2.in', opacity: 0, y: -20 }, at),
      };
      const feature = {
        enter: (tl: gsap.core.Timeline, el: Element, at: string) => {
          tl.from(el.querySelector('[data-divider]'), { duration: 0.9, ease: 'power2', scaleX: 0 }, at);
          tl.from(el.querySelectorAll('p'), { duration: 0.6, delay: 0.1, stagger: 0.1, ease: 'power2', opacity: 0, y: 20 }, at);
        },
        leave: (tl: gsap.core.Timeline, el: Element, at: string) => {
          tl.to(el.querySelector('[data-divider]'), { duration: 0.4, ease: 'power2.in', scaleX: 0, y: -20 }, at);
          tl.to(el.querySelectorAll('p'), { duration: 0.4, delay: 0.05, stagger: 0.05, ease: 'power2.in', opacity: 0, y: -20 }, at);
        },
      };

      // the phone rises in once; the steps then loop on it
      const intro = gsap.fromTo(phone, { y: 60, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', paused: true });
      const tl = gsap.timeline({ paused: true, repeat: -1 });
      tl.set(q('article'), { opacity: 1 }, 0);

      // 1 — the Dashboard, and the two lines about it
      tl.addLabel('step-1');
      const a = art(0);
      heading.enter(tl, a.children[0], 'step-1+=0.1');
      heading.leave(tl, a.children[0], 'step-1+=1.55');
      heading.enter(tl, a.children[1], 'step-1+=2.2');
      heading.leave(tl, a.children[1], 'step-1+=3.45');
      feature.enter(tl, a.children[2], 'step-1+=3.9');
      feature.leave(tl, a.children[2], 'step-1+=6');
      tl.to({}, { duration: 0.01 }, `step-1+=${STEPS[0].length}`);

      // 2–4 — each step is the next real screen arriving the way a sheet does, and one line
      const offsets: Array<[number, number]> = [
        [0.5, 6],
        [0, 2.6],
        [0.1, 2.6],
      ];
      [1, 2, 3].forEach((i, k) => {
        const label = `step-${i + 1}`;
        tl.addLabel(label);
        tl.fromTo(layers[i - 1], { opacity: 0, yPercent: 6 }, { opacity: 1, yPercent: 0, duration: 0.6, ease: 'power3.out' }, label);
        feature.enter(tl, art(i).children[0], `${label}+=${offsets[k][0]}`);
        feature.leave(tl, art(i).children[0], `${label}+=${offsets[k][1]}`);
        tl.to({}, { duration: 0.01 }, `${label}+=${STEPS[i].length}`);
      });

      // 5 — the record, written down
      tl.addLabel('step-5');
      tl.fromTo(layers[3], { opacity: 0, yPercent: 6 }, { opacity: 1, yPercent: 0, duration: 0.6, ease: 'power3.out' }, 'step-5');
      const e = art(4);
      heading.enter(tl, e.children[2], 'step-5+=0.6');
      heading.enter(tl, e.children[0], 'step-5+=0.6');
      heading.enter(tl, e.children[1], 'step-5+=0.9');

      // and back to the start: the words go, the sheets slide away to the Dashboard beneath, and
      // the loop comes round to step 1 on exactly the frame it began with
      const clear = `step-5+=${STEPS[4].length}`;
      [...e.children].forEach(el => heading.leave(tl, el, clear));
      tl.to(layers, { opacity: 0, yPercent: 6, duration: 0.6, ease: 'power2.in' }, `${clear}+=0.2`);
      tl.to({}, { duration: 0.01 }, `${clear}+=1.2`);

      // which step is showing, and how far through it — for the stepper
      const labels = Object.entries(tl.labels).sort((x, y) => x[1] - y[1]);
      tl.eventCallback('onUpdate', () => {
        const t = tl.time();
        let idx = 0;
        labels.forEach(([, at], i) => {
          if (t >= at) idx = i;
        });
        const p = labels.map(([, at], i) => {
          const end = i < labels.length - 1 ? labels[i + 1][1] : tl.duration();
          return i < idx ? 1 : i > idx ? 0 : Math.min(1, Math.max(0, (t - at) / (end - at)));
        });
        buttons.forEach((b, i) => {
          b.dataset.active = String(i === idx);
          (b.firstElementChild as HTMLElement).style.opacity = i <= idx ? '1' : '0.5';
          b.querySelector('svg')?.style.setProperty('--p', `${p[i]}`);
        });
      });
      master.current = tl;
      introRef.current = intro;

      if (reducedMotion()) {
        intro.progress(1);
        tl.seek('step-1+=5');
        return;
      }

      // play while on screen
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: self => {
          if (!self.isActive) return tl.pause();
          intro.play();
          tl.play();
        },
      });
    },
    { scope: root },
  );

  // settle onto the section if the reader stops scrolling close to it (2.5s, within 20vh)
  useEffect(() => {
    if (reducedMotion()) return;
    const el = root.current!;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const clear = () => timer && clearTimeout(timer);
    const st = ScrollTrigger.create({
      trigger: el,
      start: () => `top-=${vh(20)} top`,
      end: () => `top+=${vh(20)} top`,
      onUpdate: () => {
        clear();
        timer = setTimeout(() => scrollToTarget(lenis, el, 0.9), 2500);
      },
      onLeave: clear,
      onLeaveBack: clear,
    });
    return () => {
      clear();
      st.kill();
    };
  }, [lenis]);

  const seek = (i: number) => {
    const tl = master.current;
    if (!tl) return;
    introRef.current?.play();
    tl.seek(`step-${i + 1}`);
    tl.play();
  };

  return (
    <section ref={root} className={s.walkthrough} id="records" aria-label="Writing down an expense, step by step" data-ground="lime">
      <div className={s.stage}>
        <div className={s.phoneWrap} data-phone>
          <Phone screen="dashboard" className={s.phone} sizes="(max-width: 743px) 60vw, 360px" alt="The Wealth-it Dashboard">
            {STEPS.slice(1).map(st => (
              <ScreenLayer key={st.screen} screen={st.screen} data-layer={st.screen} sizes="(max-width: 743px) 60vw, 360px" />
            ))}
          </Phone>
        </div>
      </div>

      <article data-step="1">
        <div className={`${s.heading} title-3 xs-title-5`}>
          <p>Every wallet</p>
        </div>
        <div className={`${s.heading} title-3 xs-title-5`}>
          <p>One ledger</p>
        </div>
        <div className={s.feature} data-position="left">
          <div className={s.divider} data-divider />
          <p className={`${s.featureTitle} subhead-1 xs-subhead-2`}>Where you stand, first</p>
          <p className={`${s.featureText} body`}>The Dashboard opens on what is left this month, across every wallet you hold.</p>
        </div>
      </article>
      <article data-step="2">
        <div className={s.feature} data-position="right">
          <div className={s.divider} data-divider />
          <p className={`${s.featureTitle} subhead-1 xs-subhead-2`}>Write it the way you&rsquo;d say it</p>
          <p className={`${s.featureText} body`}>Every record is a sentence — I spent … on … from … — and each gap is one tap on the app&rsquo;s own keypad.</p>
        </div>
      </article>
      <article data-step="3">
        <div className={s.feature} data-position="left">
          <div className={s.divider} data-divider />
          <p className={`${s.featureTitle} subhead-1 xs-subhead-2`}>Pick the closest one</p>
          <p className={`${s.featureText} body`}>Nine categories and fifty-eight subcategories, grouped the way you think — or add your own.</p>
        </div>
      </article>
      <article data-step="4">
        <div className={s.feature} data-position="right">
          <div className={s.divider} data-divider />
          <p className={`${s.featureTitle} subhead-1 xs-subhead-2`}>Ready when you are</p>
          <p className={`${s.featureText} body`}>Nothing is saved until the sentence makes sense, and it tells you what is still missing.</p>
        </div>
      </article>
      <article data-step="5">
        <div className={`${s.subheading} title-5 xs-subhead-1`} data-position="left">
          <p>Written down,</p>
        </div>
        <div className={`${s.subheading} title-5 xs-subhead-1`} data-position="right">
          <p>in a few taps</p>
        </div>
        <div className={`${s.subheading} title-5 xs-subhead-1`} data-position="center">
          <p>Written down, in a few taps</p>
        </div>
      </article>

      <div className={s.stepperBox}>
        <Stepper onSeek={seek} />
      </div>
    </section>
  );
}
