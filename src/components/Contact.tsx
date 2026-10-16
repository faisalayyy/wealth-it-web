'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from '@/animation/SmoothScroll';
import { contactEmail } from '@/lib/site';
import { Button } from './Button';
import { Icon } from './Icon';
import s from './Contact.module.css';

/**
 * "Get in touch", and the drawer it opens: the reference's contact form, sliding in from the
 * right (up from the bottom on a phone) over a dimmed page.
 *
 * The site has no server and sends nothing anywhere, so Send does what a static page honestly can:
 * it opens your mail app with the message written out, addressed to us, for you to send.
 */
const DIAL = [
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
];

type Field = 'name' | 'email' | 'message';

function Input({ name, label, type = 'text', invalid, textarea }: { name: string; label: string; type?: string; invalid?: boolean; textarea?: boolean }) {
  const id = `contact-${name}`;
  return (
    <div className={s.input} data-valid={invalid ? 'false' : 'true'}>
      <div className={s.container}>
        {textarea ? (
          <textarea id={id} name={name} rows={5} placeholder={label} data-lenis-prevent="" aria-invalid={invalid || undefined} />
        ) : (
          <input id={id} name={name} type={type} placeholder={label} aria-invalid={invalid || undefined} autoComplete={name === 'phone' ? 'tel-national' : name} />
        )}
        <label htmlFor={id}>{label}</label>
      </div>
      {invalid && <span className={s.hint}>{name === 'email' ? 'An address we can reply to' : 'This one is needed'}</span>}
    </div>
  );
}

function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dial, setDial] = useState(DIAL[0]);
  const [invalid, setInvalid] = useState<Field[]>([]);
  const modal = useRef<HTMLDivElement>(null);

  // settle focus inside once it has slid in
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => modal.current?.querySelector<HTMLInputElement>('input')?.focus(), 450);
    return () => clearTimeout(t);
  }, [open]);

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
    const phone = get('phone') ? `\n${dial.code} ${get('phone')}` : '';
    const body = `${get('message')}\n\n— ${get('name')}\n${get('email')}${phone}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(`Wealthit: a note from ${get('name')}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className={s.drawer} inert={!open} data-open={open ? '' : undefined}>
      <div className={s.shade} onClick={onClose} aria-hidden />
      <div ref={modal} className={s.modal} role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <header className={s.head}>
          <div id="contact-title" className="subhead-1 xs-subhead-2 -medium">
            Get in touch
          </div>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className={s.slot}>
          <form className={s.form} onSubmit={send} noValidate>
            <Input name="name" label="Full name" invalid={invalid.includes('name')} />
            <Input name="email" label="Email address" type="email" invalid={invalid.includes('email')} />
            <div className={`${s.input} ${s.phone}`} data-valid="true">
              <label className={s.dial}>
                <span aria-hidden>{dial.flag}</span>
                <span className="body -book">{dial.code}</span>
                <Icon name="chevron-down" size={16} className={s.chevron} />
                <select
                  aria-label="Country code"
                  value={dial.code}
                  onChange={e => setDial(DIAL.find(d => d.code === e.target.value) ?? DIAL[0])}
                >
                  {DIAL.map(d => (
                    <option key={d.code} value={d.code}>
                      {d.flag} {d.code} · {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className={s.container}>
                <input id="contact-phone" name="phone" type="tel" placeholder="Phone number" autoComplete="tel-national" />
                <label htmlFor="contact-phone">Phone number (optional)</label>
              </div>
            </div>
            <Input name="message" label="Your message" textarea invalid={invalid.includes('message')} />
            <p className={`${s.note} caption`}>Send opens your mail app with this written out, ready to go to {contactEmail}.</p>
            <Button label="Send" type="submit" tone="brand" variant="primary" className={s.send} />
          </form>
        </div>
      </div>
    </div>
  );
}

export function ContactButton({ label = 'Get in touch', variant = 'primary' }: { label?: string; variant?: 'primary' | 'outline' }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  return (
    <>
      <Button label={label} tone="neutral" variant={variant} onClick={() => setOpen(true)} />
      {mounted && createPortal(<Drawer open={open} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
