'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { reducedMotion } from '@/animation/gsap';
import { Phone } from '@/components/Phone';
import { Screen } from '@/components/Screen';
import type { ScreenName } from '@/lib/screens';
import { asset } from '@/lib/site';
import { themedVideo, useTheme } from '@/lib/theme';
import s from './RecordTabs.module.css';

/**
 * Three ways in (the reference's "Create in 3 ways"): a large card holding the real screen for
 * each, and the three as tabs beside it. They advance by themselves — a line fills under the one
 * showing — and stop for a pointer resting on them, for keyboard focus, and while the section is
 * off screen. Click or use the arrow keys to choose.
 */
type Step = { title: string; text: string; screen: ScreenName; alt: string; /** a recording of it (public/videos/<name>.mp4), played while the tab is showing */ video?: string; /** how long the tab shows, ms: a recording's length */ dwell?: number };
const STEPS: Step[] = [
  {
    title: 'Type it',
    text: 'Tap +, type the amount on Wealthit’s own number pad and pick what it was for. The sentence reads back what will be saved.',
    screen: 'record-sheet-dark',
    video: 'record-expense-dark',
    dwell: 13600,
    alt: 'Recording an expense in Wealthit: the amount, the category, Done',
  },
  {
    title: 'Scan it',
    text: 'Snap the receipt, or pick a photo of one. It’s read on your phone, and the amount, shop, date and category are filled in for you to check.',
    screen: 'scan-done-dark',
    video: 'scan-receipt-dark',
    dwell: 8300,
    alt: 'Scanning a receipt in Wealthit: read, filled in, saved',
  },
  {
    title: 'Schedule it',
    text: 'Rent, salary, subscriptions: set them up once and they record themselves on the day, or ask you first.',
    screen: 'schedules-dark',
    alt: 'Scheduled payments: what is waiting, and what is due later this month',
  },
];
const DWELL = 5200;

export function RecordTabs() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const running = visible && !paused && !reducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive(a => (a + 1) % STEPS.length), STEPS[active].dwell ?? DWELL);
    return () => clearTimeout(t);
  }, [running, active]);

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + STEPS.length) % STEPS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section ref={root} className={s.section} aria-labelledby={`${id}-title`}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.media}>
          <Phone variant="device" className={s.phone} sizes="(max-width: 743px) 60vw, 340px">
            {STEPS.map((st, i) =>
              st.video ? (
                <StepVideo key={st.title} name={st.video} label={st.alt} on={i === active && visible} className={s.shot} />
              ) : (
                <Screen key={st.title} name={st.screen} alt={i === active ? st.alt : ''} sizes="(max-width: 743px) 60vw, 340px" className={s.shot} data-on={i === active ? '' : undefined} />
              ),
            )}
          </Phone>
        </div>
        <div className={s.copy} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <p id={`${id}-title`} className="cap">
            Three ways to record
          </p>
          <div role="tablist" aria-orientation="vertical" aria-labelledby={`${id}-title`} className={s.tabs} onKeyDown={onKey}>
            {STEPS.map((st, i) => (
              <button
                key={st.title}
                ref={el => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={s.tab}
                onClick={() => setActive(i)}
              >
                <span className="display-2">{st.title}</span>
                <span className={s.track} aria-hidden>
                  <span className={s.fill} data-running={i === active && running ? '' : undefined} key={`${active}-${running}`} style={{ animationDuration: `${st.dwell ?? DWELL}ms` }} />
                </span>
              </button>
            ))}
          </div>
          <p id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className={`lead ${s.text}`} key={active}>
            {STEPS[active].text}
          </p>
        </div>
      </div>
    </section>
  );
}

/** A tab's recording: plays from the start while its tab is showing, waits on its first frame otherwise. */
function StepVideo({ name, label, on, className }: { name: string; label: string; on: boolean; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const file = themedVideo(name, useTheme());
  useEffect(() => {
    const el = ref.current!;
    if (on) {
      setLoad(true);
      if (reducedMotion()) return;
      el.currentTime = 0;
      el.play().catch(() => {});
    } else el.pause();
  }, [on]);
  return (
    <video
      ref={ref}
      className={`${className} ${s.video}`}
      data-on={on ? '' : undefined}
      src={load ? asset(`/videos/${file}.mp4`) : undefined}
      poster={asset(`/videos/${file}.jpg`)}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={!on}
    />
  );
}
