'use client';

import { useRef, useState, type FormEvent } from 'react';
import { gsap, reducedMotion, SplitText, useGSAP } from '@/animation/gsap';
import { introLate } from '@/animation/intro';
import { Button } from '@/components/Button';
import { fullStop } from '@/components/Stop';
import { Icon } from '@/components/Icon';
import { Mark } from '@/components/Logo';
import { contactEmail } from '@/lib/site';
import s from './HelpHero.module.css';

/**
 * The Help page's first screen, after the reference's contact page: the brand on one side and a
 * short form on the other. The site sends nothing itself — Send opens the visitor's mail app with
 * the message written out to the support address.
 */
type Field = 'name' | 'email' | 'message';

export function HelpHero() {
  const root = useRef<HTMLElement>(null);
  const [invalid, setInvalid] = useState<Field[]>([]);

  useGSAP(
    () => {
      if (reducedMotion() || introLate()) return;
      const split = SplitText.create(root.current!.querySelector('h1')!, { type: 'chars,words', mask: 'chars', charsClass: 'hc' });
      gsap.from(split.chars, { yPercent: 110, duration: 1.1, stagger: 0.018, ease: 'expo.out', delay: 0.2, onComplete: () => split.revert() });
      gsap.from(root.current!.querySelectorAll('[data-in]'), { opacity: 0, y: 24, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.4 });
    },
    { scope: root },
  );

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const wrong: Field[] = [];
    if (!get('name')) wrong.push('name');
    if (!/^\S+@\S+\.\S+$/.test(get('email'))) wrong.push('email');
    if (!get('message')) wrong.push('message');
    setInvalid(wrong);
    if (wrong.length) return;
    const body = `${get('message')}\n\n${get('name')}\n${get('email')}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(`Wealthit: a note from ${get('name')}`)}&body=${encodeURIComponent(body)}`;
  };

  const field = (name: Field, label: string, type = 'text') => (
    <label className={s.field} data-invalid={invalid.includes(name) ? '' : undefined}>
      <span className={s.label}>{label}</span>
      {name === 'message' ? (
        <textarea name={name} rows={5} data-lenis-prevent="" aria-invalid={invalid.includes(name) || undefined} />
      ) : (
        <input name={name} type={type} autoComplete={name} aria-invalid={invalid.includes(name) || undefined} />
      )}
      {invalid.includes(name) && <span className={s.hint}>{name === 'email' ? 'An address we can reply to' : 'We need this one'}</span>}
    </label>
  );

  return (
    <section ref={root} className={s.hero} data-ground="light">
      <div className={`wrap ${s.grid}`}>
        <div className={s.brand} data-in>
          <Mark className={s.mark} tone="dark" />
          <p className={s.tag}>Small steps. Big wealth.</p>
        </div>
        <div className={s.copy}>
          <p className="cap" data-in>
            Help
          </p>
          <h1 className={`display-2 ${s.title}`}>{fullStop('How can we help?')}</h1>
          <p className={`lead ${s.lead}`} data-in>
            Most questions are answered just below. If yours isn’t, write to us. A real person reads every message.
          </p>
          <form className={s.form} onSubmit={send} noValidate data-in>
            <div className={s.row}>
              {field('name', 'Your name')}
              {field('email', 'Email address', 'email')}
            </div>
            {field('message', 'Your message')}
            <div className={s.send}>
              <Button label="Send" type="submit" tone="brand" />
              <a href={`mailto:${contactEmail}`} className={s.mail}>
                <Icon name="mail" size={18} />
                {contactEmail}
              </a>
            </div>
            <p className={s.note}>Send opens your mail app with your message written out, ready to go.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
