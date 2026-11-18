'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useLenis } from '@/animation/SmoothScroll';
import { plus } from '@/lib/site';
import { PlusMark } from '@/components/PlusMark';
import { PLANS, type Plan } from './prices';
import s from './plus.module.css';

/**
 * Starting, buying and managing Wealthit+ on wealthit.app, the only place it is sold (the app's A643),
 * in a dialog that opens from the page's buttons (`openPlus`). The site has no sign-in, so the server
 * (A644) finds the account by its email and a 6-digit code, and the code opens a 30-minute key that
 * reaches only the account's plan.
 *
 * The key is held in this component's memory only: never in a cookie or the browser's storage, so
 * the privacy policy's "This website" paragraph stays true. Safepay's checkout is a full page change,
 * so the key is gone when the person comes back; Wealthit+ starts anyway, because Safepay tells the
 * server directly, and "See your plan" asks for a new code and then has the server ask Safepay again.
 */

export type Intent = { kind: 'trial' } | { kind: 'buy'; plan: Plan } | { kind: 'manage' };
type Held = {
  active: boolean;
  plan: Plan | 'trial' | null;
  source: string | null;
  until: number | null;
  renews: boolean;
  trialUsed: boolean;
};
type Step = 'email' | 'code' | 'plan' | 'started' | 'going' | 'paid' | 'left';

const EVENT = 'wealthit:plus';
/** Opens the dialog for a trial, a plan or the account's plan. */
export function openPlus(intent: Intent) {
  window.dispatchEvent(new CustomEvent<Intent>(EVENT, { detail: intent }));
}

const day = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const sentence = (t: string) => (/[.?]$/.test(t) ? t : `${t}.`);
const OOPS = 'Something went wrong. Try again in a moment.';

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
  return OOPS;
}

export function Join({ api }: { api: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const [intent, setIntent] = useState<Intent>({ kind: 'trial' });
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [held, setHeld] = useState<Held | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [stopping, setStopping] = useState(false);
  /** The 30-minute key, in memory only. */
  const key = useRef<string | null>(null);
  /** Back from Safepay: after the code, the server asks Safepay again. */
  const back = useRef(false);

  const show = () => {
    if (!dialog.current?.open) dialog.current?.showModal();
    lenis?.stop();
  };

  // The page's buttons open it; a key still held (this visit) goes straight to what was asked.
  useEffect(() => {
    const on = (e: Event) => {
      const next = (e as CustomEvent<Intent>).detail;
      setIntent(next);
      setError('');
      setStopping(false);
      setStep(key.current ? 'plan' : 'email');
      show();
      if (key.current) act(next);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  });

  // Back from Safepay's page (`?paid=…` or `?cancelled=…`): say so, and take the reference out of
  // the address bar.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.has('paid') && !q.has('cancelled')) return;
    back.current = q.has('paid');
    setIntent({ kind: 'manage' });
    setStep(q.has('paid') ? 'paid' : 'left');
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    show();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => dialog.current?.close();

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
    try {
      await work();
    } catch (e) {
      const r = e instanceof Refused ? e : new Refused(0, OOPS);
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

  /** What was asked for, once the account is known. */
  function act(next: Intent, now?: Held) {
    run(async () => {
      const h = now ?? (await call<Held>('/v1/plus/web/me', undefined, 'GET'));
      setHeld(h);
      if (next.kind === 'trial' && !h.active && !h.trialUsed) {
        setHeld(await call<Held>('/v1/plus/web/trial'));
        setStep('started');
        return;
      }
      if (next.kind === 'buy' && forSale(h).includes(next.plan)) {
        setStep('going');
        const { url } = await call<{ url: string }>('/v1/plus/web/checkout', { plan: next.plan });
        if (!/^https:\/\//.test(url)) throw new Refused(0, OOPS);
        window.location.assign(url);
        return;
      }
      setStep('plan');
      if (next.kind === 'trial' && h.trialUsed && !h.active) setError(`This account has already had its ${plus.trialDays} days of ${plus.name}.`);
    });
  }

  const ask = (e?: FormEvent) => {
    e?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter the email address of your Wealthit account.');
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
      const h = back.current ? await call<Held>('/v1/plus/web/check') : out.plus;
      back.current = false;
      act(intent, h);
    });
  };

  const stop = () =>
    run(async () => {
      setHeld(await call<Held>('/v1/plus/web/cancel'));
      setStopping(false);
    });

  /** What can still be bought: everything, or only lifetime once a paid plan is on (the server's rule). */
  const forSale = (h: Held): Plan[] => {
    if (!h.active || h.plan === 'trial') return ['year', 'month', 'life'];
    return h.plan === 'life' ? [] : ['life'];
  };

  /** What the account has now, in a line. */
  const status = (h: Held) => {
    if (!h.active || !h.plan) return `No ${plus.name} on this account yet.`;
    if (h.plan === 'life') return `You have ${plus.name} for life.`;
    const until = h.until ? day(h.until) : '';
    if (h.plan === 'trial') return `You’re trying ${plus.name} until ${until}.`;
    const name = PLANS[h.plan].name.toLowerCase();
    return h.renews ? `Your ${name} plan renews on ${until}.` : `${plus.name} stays until ${until}. It won’t renew.`;
  };

  const heading: Record<Step, string> = {
    email: intent.kind === 'trial' ? `Start your ${plus.trialDays} days` : intent.kind === 'buy' ? `${plus.name} ${PLANS[intent.plan].name}` : 'Your plan',
    code: 'Check your email',
    plan: 'Your plan',
    started: `Your ${plus.trialDays} days have started`,
    going: 'Taking you to Safepay',
    paid: 'Thank you',
    left: 'Nothing was charged',
  };

  let body: ReactNode = null;
  if (step === 'email')
    body = (
      <form className={s.mForm} onSubmit={ask} noValidate>
        <p className={s.mText}>
          {intent.kind === 'buy'
            ? `${PLANS[intent.plan].line}. First, the email you use for Wealthit, so it goes on your account.`
            : intent.kind === 'trial'
              ? 'Enter the email you use for Wealthit. No payment, and it ends by itself.'
              : 'Enter the email you use for Wealthit to see or change your plan.'}
        </p>
        <label className={s.mField}>
          <span className={s.mLabel}>Email</span>
          <input
            className={s.mInput}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-invalid={!!error || undefined}
          />
        </label>
        <button type="submit" className={s.gold} disabled={busy}>
          {busy ? 'Sending…' : 'Send me a code'}
        </button>
      </form>
    );
  else if (step === 'code')
    body = (
      <form className={s.mForm} onSubmit={verify} noValidate>
        <p className={s.mText}>
          If <strong>{email.trim()}</strong> has a Wealthit account, a 6-digit code is on its way. It works for 10 minutes.
        </p>
        <label className={s.mField}>
          <span className={s.mLabel}>Code</span>
          <input
            className={`${s.mInput} ${s.mCode}`}
            name="code"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            aria-invalid={!!error || undefined}
          />
        </label>
        <button type="submit" className={s.gold} disabled={busy}>
          {busy ? 'Checking…' : 'Continue'}
        </button>
        <div className={s.mLinks}>
          <button type="button" className={s.mLink} onClick={() => ask()} disabled={busy}>
            Send a new code
          </button>
          <button
            type="button"
            className={s.mLink}
            onClick={() => {
              setError('');
              setStep('email');
            }}
            disabled={busy}
          >
            Change email
          </button>
        </div>
      </form>
    );
  else if (step === 'plan' && held)
    body = (
      <div className={s.mForm}>
        <p className={s.mText}>{status(held)}</p>
        {!held.active && !held.trialUsed && (
          <button type="button" className={s.gold} onClick={() => act({ kind: 'trial' }, held)} disabled={busy}>
            Try {plus.name} for {plus.trialDays} days
          </button>
        )}
        {forSale(held).length > 0 && (
          <div className={s.mBuy}>
            <span className={s.mLabel}>{held.active && held.plan !== 'trial' ? 'Make it lifetime' : 'Pick a plan'}</span>
            {forSale(held).map(p => (
              <button key={p} type="button" className={s.mPlan} onClick={() => act({ kind: 'buy', plan: p }, held)} disabled={busy}>
                <span>
                  <strong>{PLANS[p].name}</strong>
                  <small>{PLANS[p].sub}</small>
                </span>
                <span className={s.mPrice}>{PLANS[p].price}</span>
              </button>
            ))}
          </div>
        )}
        {held.active && held.renews && held.source === 'safepay' && (
          <div className={s.mStop}>
            {stopping ? (
              <>
                <p className={s.mText}>
                  Stop renewing? {plus.name} stays until {held.until ? day(held.until) : 'the end of what you paid for'}, and nothing more is charged.
                </p>
                <div className={s.mLinks}>
                  <button type="button" className={s.mDanger} onClick={stop} disabled={busy}>
                    Stop renewing
                  </button>
                  <button type="button" className={s.mLink} onClick={() => setStopping(false)} disabled={busy}>
                    Keep it
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className={s.mLink} onClick={() => setStopping(true)} disabled={busy}>
                Stop renewing
              </button>
            )}
          </div>
        )}
      </div>
    );
  else if (step === 'started')
    body = (
      <div className={s.mForm}>
        <p className={s.mText}>
          Everything in {plus.name} is open on your account{held?.until ? ` until ${day(held.until)}` : ''}. Open Wealthit and it’s there. Nothing
          is charged, and it ends by itself.
        </p>
        <button type="button" className={s.gold} onClick={close}>
          Done
        </button>
      </div>
    );
  else if (step === 'going') body = <p className={s.mText}>One moment. You’ll pay on Safepay’s own page, then come back here.</p>;
  else if (step === 'paid')
    body = (
      <div className={s.mForm}>
        <p className={s.mText}>Safepay is confirming your payment, and {plus.name} turns on in Wealthit as soon as it has. Safepay emails you a receipt.</p>
        <button type="button" className={s.gold} onClick={close}>
          Done
        </button>
        <div className={s.mLinks}>
          <button type="button" className={s.mLink} onClick={() => setStep('email')}>
            See your plan
          </button>
        </div>
      </div>
    );
  else if (step === 'left')
    body = (
      <div className={s.mForm}>
        <p className={s.mText}>You left Safepay’s page before paying. Pick a plan again whenever you like.</p>
        <button type="button" className={s.gold} onClick={close}>
          Back to the plans
        </button>
      </div>
    );

  return (
    <dialog
      ref={dialog}
      className={s.modal}
      aria-labelledby="plus-dialog-title"
      data-lenis-prevent=""
      onClose={() => {
        lenis?.start();
        setError('');
      }}
      onClick={e => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className={s.mBox} aria-busy={busy || undefined}>
        <button type="button" className={s.mClose} onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <PlusMark className={s.mMark} />
        <h2 id="plus-dialog-title" className={s.mTitle}>
          {heading[step]}
        </h2>
        {body}
        <p className={s.mError} role="alert">
          {error}
        </p>
      </div>
    </dialog>
  );
}
