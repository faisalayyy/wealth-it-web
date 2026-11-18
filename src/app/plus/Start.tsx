'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { plus } from '@/lib/site';
import s from './plus.module.css';

/**
 * Starting, buying and cancelling Wealthit+ on wealthit.app, the only place it is sold (the app's
 * A643). The site has no sign-in, so the server (A644) finds the account by its email and a 6-digit
 * code, and the code opens a 30-minute key that reaches only the account's plan.
 *
 * The key is held in this component's memory only: never in a cookie or the browser's storage, so
 * the privacy policy's "This website" paragraph stays true. Safepay's checkout is a full page change,
 * so the key is gone when the person comes back; Wealthit+ starts anyway, because Safepay tells the
 * server directly, and "See your plan" asks for a new code and then has the server ask Safepay again.
 */

type Plan = 'month' | 'year' | 'life';
type Held = {
  active: boolean;
  plan: Plan | 'trial' | null;
  source: string | null;
  until: number | null;
  renews: boolean;
  trialUsed: boolean;
};
type Step = 'email' | 'code' | 'plan' | 'paid' | 'left';

const NAMES: Record<Plan, string> = { month: 'Monthly', year: 'Yearly', life: 'Lifetime' };
const PAY: Record<Plan, string> = {
  month: `Pay ${plus.prices.month} a month`,
  year: `Pay ${plus.prices.year} a year`,
  life: `Pay ${plus.prices.life} once`,
};

const day = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const sentence = (t: string) => (/[.?]$/.test(t) ? t : `${t}.`);

class Refused extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** The server's own words where they fit the site's (its `detail`), ours where they don't. */
function words(status: number, path: string, detail: unknown): string {
  if (status === 404) return 'Wealthit+ isn’t open yet. Try again soon.';
  if (status === 409 && path.endsWith('/trial')) return `This account has already had its ${plus.trialDays} days of ${plus.name}.`;
  if (status === 422) return path.endsWith('/verify') ? 'Enter the 6-digit code from the email.' : 'Enter the email address of your Wealthit account.';
  if (typeof detail === 'string' && detail) return sentence(detail);
  return 'Something went wrong. Try again in a moment.';
}

export function Start({ api }: { api: string }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [held, setHeld] = useState<Held | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [said, setSaid] = useState('');
  const [stopping, setStopping] = useState(false);
  /** The 30-minute key, in memory only. */
  const key = useRef<string | null>(null);
  /** Back from Safepay: after the code, the server asks Safepay again. */
  const back = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  // Back from Safepay's page (`?paid=…` or `?cancelled=…`): say so, and take the reference out of
  // the address bar.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.has('paid') && !q.has('cancelled')) return;
    back.current = q.has('paid');
    setStep(q.has('paid') ? 'paid' : 'left');
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    document.getElementById('start')?.scrollIntoView();
  }, []);

  // Each new step takes the focus, so a screen reader hears it; never on arrival, so the page opens
  // at its top.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    box.current?.querySelector<HTMLElement>('input, [data-focus]')?.focus({ preventScroll: true });
  }, [step]);

  async function call<T>(path: string, body?: object, method = 'POST'): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${api}${path}`, {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(key.current ? { Authorization: `Bearer ${key.current}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'omit',
        cache: 'no-store',
      });
    } catch {
      throw new Refused(0, 'Wealthit’s server can’t be reached just now. Try again in a moment.');
    }
    if (res.status === 202 || res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Refused(res.status, words(res.status, path, (data as { detail?: unknown }).detail));
    return data as T;
  }

  /** Runs one request, showing what went wrong; an expired key goes back to the email. */
  async function run(work: () => Promise<void>) {
    setBusy(true);
    setError('');
    setSaid('');
    try {
      await work();
    } catch (e) {
      const r = e instanceof Refused ? e : new Refused(0, 'Something went wrong. Try again in a moment.');
      if (r.status === 401 && key.current) {
        key.current = null;
        setHeld(null);
        setStep('email');
      }
      setError(r.message);
    } finally {
      setBusy(false);
    }
  }

  const ask = (e?: FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return setError('Enter the email address of your Wealthit account.');
    run(async () => {
      await call('/v1/plus/web/code', { email: email.trim() });
      setCode('');
      setStep('code');
    });
  };

  const verify = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit code from the email.');
    run(async () => {
      const out = await call<{ token: string; email: string; plus: Held }>('/v1/plus/web/verify', { email: email.trim(), code });
      key.current = out.token;
      setEmail(out.email);
      setHeld(back.current ? await call<Held>('/v1/plus/web/check') : out.plus);
      back.current = false;
      setStep('plan');
    });
  };

  const trial = () =>
    run(async () => {
      setHeld(await call<Held>('/v1/plus/web/trial'));
      setSaid(`Your ${plus.trialDays} days of ${plus.name} have started. Open Wealthit and they are there.`);
    });

  const buy = (plan: Plan) =>
    run(async () => {
      const { url } = await call<{ url: string }>('/v1/plus/web/checkout', { plan });
      if (!/^https:\/\//.test(url)) throw new Refused(0, 'Something went wrong. Try again in a moment.');
      window.location.assign(url);
    });

  const stop = () =>
    run(async () => {
      const out = await call<Held>('/v1/plus/web/cancel');
      setHeld(out);
      setStopping(false);
      setSaid(out.until ? `Done. It won’t renew, and ${plus.name} stays until ${day(out.until)}.` : 'Done. It won’t renew.');
    });

  const restart = () => {
    key.current = null;
    setHeld(null);
    setCode('');
    setError('');
    setSaid('');
    setStopping(false);
    setStep('email');
  };

  /** What the account has now, in a line. */
  const status = (h: Held) => {
    if (!h.active || !h.plan) return `${email} doesn’t have ${plus.name} yet.`;
    if (h.plan === 'life') return `${email} has ${plus.name} for life.`;
    const until = h.until ? day(h.until) : '';
    if (h.plan === 'trial') return `${email} is trying ${plus.name}, until ${until}.`;
    return h.renews ? `${email} is on the ${NAMES[h.plan].toLowerCase()} plan, renewing on ${until}.` : `${email} has ${plus.name} until ${until}. It won’t renew.`;
  };

  /** What can still be bought: everything, or only lifetime once a paid plan is on (the server's rule). */
  const forSale = (h: Held): Plan[] => {
    if (!h.active || h.plan === 'trial') return ['month', 'year', 'life'];
    return h.plan === 'life' ? [] : ['life'];
  };

  return (
    <div ref={box} className={s.flow} aria-busy={busy || undefined}>
      {step === 'email' && (
        <form className={s.form} onSubmit={ask} noValidate>
          <h3 className={s.step} tabIndex={-1}>
            Start with your email
          </h3>
          <label className={s.field}>
            <span className={s.label}>Your Wealthit account’s email address</span>
            <input
              className={s.input}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={!!error || undefined}
              aria-describedby="start-note"
            />
          </label>
          <div className={s.actions}>
            <Button label={busy ? 'Sending…' : 'Send me a code'} type="submit" tone="brand" />
          </div>
          <p id="start-note" className={s.hint}>
            If it belongs to a Wealthit account, a 6-digit code is sent to it. Use the address you sign in to Wealthit with.
          </p>
        </form>
      )}

      {step === 'code' && (
        <form className={s.form} onSubmit={verify} noValidate>
          <h3 className={s.step} tabIndex={-1}>
            Enter your code
          </h3>
          <p className={s.text}>
            If {email.trim()} has a Wealthit account, a code is on its way. It works for 10 minutes.
          </p>
          <label className={s.field}>
            <span className={s.label}>6-digit code</span>
            <input
              className={`${s.input} ${s.code}`}
              name="code"
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              aria-invalid={!!error || undefined}
            />
          </label>
          <div className={s.actions}>
            <Button label={busy ? 'Checking…' : 'Continue'} type="submit" tone="brand" />
            <button type="button" className={s.link} onClick={() => ask()} disabled={busy}>
              Send a new code
            </button>
            <button type="button" className={s.link} onClick={restart} disabled={busy}>
              Use another email
            </button>
          </div>
        </form>
      )}

      {step === 'plan' && held && (
        <div className={s.form}>
          <h3 className={s.step} tabIndex={-1} data-focus="">
            Your {plus.name}
          </h3>
          <p className={s.text}>{status(held)}</p>

          {!held.active && !held.trialUsed && (
            <div className={s.choice}>
              <Button label={`Try ${plus.name} for ${plus.trialDays} days`} tone="brand" onClick={trial} />
              <p className={s.hint}>No payment to start. When the {plus.trialDays} days end it stops by itself, unless you choose a plan.</p>
            </div>
          )}

          {forSale(held).length > 0 && (
            <div className={s.choice}>
              <span className={s.label}>{held.active && held.plan !== 'trial' ? 'Make it lifetime' : 'Choose a plan'}</span>
              <div className={s.actions}>
                {forSale(held).map(p => (
                  <Button key={p} label={PAY[p]} tone={p === 'year' ? 'brand' : 'ink'} variant={p === 'year' ? 'primary' : 'secondary'} onClick={() => buy(p)} />
                ))}
              </div>
              <p className={s.hint}>You pay on Safepay’s own page, then come back here.</p>
            </div>
          )}

          {held.active && held.renews && held.source === 'safepay' && (
            <div className={s.choice}>
              {stopping ? (
                <>
                  <p className={s.text}>
                    Stop renewing? {plus.name} stays until {held.until ? day(held.until) : 'the end of what you have paid for'}, and nothing more is
                    charged.
                  </p>
                  <div className={s.actions}>
                    <Button label="Stop renewing" tone="ink" onClick={stop} />
                    <button type="button" className={s.link} onClick={() => setStopping(false)} disabled={busy}>
                      Keep it
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" className={s.link} onClick={() => setStopping(true)} disabled={busy}>
                  Stop renewing
                </button>
              )}
            </div>
          )}

          <button type="button" className={s.link} onClick={restart} disabled={busy}>
            Use another email
          </button>
        </div>
      )}

      {step === 'paid' && (
        <div className={s.form}>
          <h3 className={s.step} tabIndex={-1} data-focus="">
            Thank you
          </h3>
          <p className={s.text}>
            Safepay is confirming your payment, and {plus.name} turns on in Wealthit as soon as it has. Safepay emails you a receipt.
          </p>
          <div className={s.actions}>
            <Button label="See your plan" tone="ink" variant="secondary" onClick={() => setStep('email')} />
          </div>
        </div>
      )}

      {step === 'left' && (
        <div className={s.form}>
          <h3 className={s.step} tabIndex={-1} data-focus="">
            Nothing was charged
          </h3>
          <p className={s.text}>You left Safepay’s page before paying. Choose a plan again whenever you like.</p>
          <div className={s.actions}>
            <Button label="Start again" tone="ink" variant="secondary" onClick={restart} />
          </div>
        </div>
      )}

      <p className={s.error} role="alert">
        {error}
      </p>
      <p className={s.said} role="status">
        {said}
      </p>
    </div>
  );
}
