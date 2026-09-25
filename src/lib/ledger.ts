/**
 * ONE LEDGER, AND EVERY FIGURE ON THE SITE DERIVED FROM IT.
 *
 * The app's first rule is that a balance is never stored — it is `opening + sum(transactions)`,
 * recomputed every time anybody asks. This file holds the site to the same rule. There is not a
 * single hand-typed headline number anywhere in the pages: the hero figure, the monthly splits,
 * the category donut, the projection and the what-if outcome are all computed from the array
 * below. Change one transaction and the whole site tells a different, still-consistent story.
 *
 * It is demo data and the site says so. What it is not is decoration.
 *
 * Deterministic on purpose: a seeded generator and a fixed anchor date, so the server render
 * and the client hydrate to identical digits. A `Math.random()` here would be a hydration bug
 * with a thousand faces.
 */

export type Kind = 'in' | 'out' | 'transfer';

export interface Tx {
  id: string;
  /** Days from the anchor. Negative is the past, 0 is today, positive is scheduled. */
  t: number;
  amount: number;
  kind: Kind;
  cat: CategoryId;
  payee: string;
}

export type CategoryId =
  | 'salary' | 'freelance'
  | 'housing' | 'groceries' | 'dining' | 'transport'
  | 'utilities' | 'health' | 'shopping' | 'leisure'
  | 'saving';

export const CATEGORIES: Record<CategoryId, { label: string; hue: string; kind: Kind }> = {
  salary:    { label: 'Salary',        hue: '#5BC98C', kind: 'in' },
  freelance: { label: 'Freelance',     hue: '#9BB86A', kind: 'in' },
  housing:   { label: 'Housing',       hue: '#8E9BC4', kind: 'out' },
  groceries: { label: 'Groceries',     hue: '#9BB86A', kind: 'out' },
  dining:    { label: 'Dining',        hue: '#D9A066', kind: 'out' },
  transport: { label: 'Transport',     hue: '#6FA8B8', kind: 'out' },
  utilities: { label: 'Utilities',     hue: '#7F9A8F', kind: 'out' },
  health:    { label: 'Health',        hue: '#6FBFA0', kind: 'out' },
  shopping:  { label: 'Shopping',      hue: '#C4B36A', kind: 'out' },
  leisure:   { label: 'Leisure',       hue: '#B889B0', kind: 'out' },
  saving:    { label: 'To savings',    hue: '#8A918D', kind: 'transfer' },
};

/**
 * Committed against discretionary — the distinction the whole "what if" chapter turns on.
 *
 * Rent is not a choice you make each month; lunch is. Only the committed half can honestly be
 * projected forward, which is why the future in this ledger contains scheduled payments and
 * nothing else. The discretionary half is a number the reader moves with their own hand.
 */
export const COMMITTED: CategoryId[] = ['housing', 'utilities', 'health'];
export const DISCRETIONARY: CategoryId[] = ['groceries', 'dining', 'transport', 'shopping', 'leisure'];

/** The anchor. Fixed, so the story does not quietly rewrite itself overnight. */
export const TODAY = new Date('2026-09-24T00:00:00Z');
export const OPENING = 16_200;
/** Twelve months behind, five ahead — the past is recorded, the rest is scheduled. */
export const SPAN = { past: -365, future: 150 } as const;

/* ── a seeded generator ──────────────────────────────────────────────────────────────────── */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function build(): Tx[] {
  const rnd = mulberry32(0x5EA1ED);
  const txs: Tx[] = [];
  let n = 0;
  const push = (t: number, amount: number, cat: CategoryId, payee: string) => {
    if (t < SPAN.past || t > SPAN.future) return;
    txs.push({ id: `t${n++}`, t: Math.round(t), amount: Math.round(amount * 100) / 100, kind: CATEGORIES[cat].kind, cat, payee });
  };

  const day = (monthsBack: number, dom: number) => {
    const d = new Date(TODAY);
    d.setUTCMonth(d.getUTCMonth() + monthsBack, dom);
    return Math.round((d.getTime() - TODAY.getTime()) / 86_400_000);
  };

  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rnd() * xs.length)]!;

  for (let m = -12; m <= 5; m++) {
    /* The fixed points of a month — the things a person does not decide again each time.
       These are the only things that exist in the future, because they are the only things
       that can honestly be said to be coming. */
    push(day(m, 25), 17_800, 'salary', 'Monthly salary');
    push(day(m, 1), 8_500, 'housing', 'Rent');
    push(day(m, 5), 340 + rnd() * 260, 'utilities', 'DEWA');
    push(day(m, 8), 309, 'utilities', 'Etisalat');
    push(day(m, 26), 2_500, 'saving', 'To Savings');
    if (m % 6 === 0) push(day(m, 14), 1_240, 'health', 'Insurance');

    /* Everything a person decides in the moment, several times a week, without deliberating.
       Recorded up to today and not one day past it: nobody knows next month's lunches. */
    if (m > 0) continue;
    if (m % 4 === 1) push(day(m, 18), 1_500 + rnd() * 2_400, 'freelance', 'Project invoice');

    const scatter = (count: number, cat: CategoryId, lo: number, hi: number, payees: readonly string[]) => {
      for (let i = 0; i < count; i++) {
        const t = day(m, 1 + Math.floor(rnd() * 28));
        if (t > 0) continue;
        push(t, lo + rnd() * (hi - lo), cat, pick(payees));
      }
    };
    scatter(7 + Math.floor(rnd() * 5), 'groceries', 70, 460, ['Carrefour', 'Spinneys', 'Waitrose', 'Union Coop']);
    scatter(5 + Math.floor(rnd() * 7), 'dining', 45, 310, ['Arabian Tea House', 'Ravi', 'Tom & Serg', 'Nightjar', 'Al Mallah']);
    scatter(9 + Math.floor(rnd() * 7), 'transport', 15, 105, ['Salik', 'Careem', 'ENOC', 'Metro']);
    scatter(Math.floor(rnd() * 3), 'shopping', 140, 1_050, ['Noon', 'Amazon.ae', 'IKEA', 'Decathlon']);
    scatter(2 + Math.floor(rnd() * 3), 'leisure', 45, 230, ['Reel Cinemas', 'Spotify', 'Fitness First']);
    if (rnd() > 0.6) scatter(1, 'health', 140, 640, ['Aster Clinic', 'Life Pharmacy']);
  }

  return txs.sort((a, b) => a.t - b.t);
}

export const LEDGER: Tx[] = build();

/* ── everything below is derived, and nothing below is stored ────────────────────────────── */

/** A transfer moves money and nothing else. It never touches a total, and never will. */
const signed = (tx: Tx) => (tx.kind === 'transfer' ? 0 : tx.kind === 'in' ? tx.amount : -tx.amount);

export function balanceAt(t: number): number {
  let sum = OPENING;
  for (const tx of LEDGER) {
    if (tx.t > t) break;
    sum += signed(tx);
  }
  return Math.round(sum * 100) / 100;
}

/**
 * The running balance at every recorded day — the spine the whole site is drawn on.
 *
 * It stops at today. What comes after today is not a continuation of this line; it is a band,
 * and it is drawn differently on purpose.
 */
export const CURVE: { t: number; v: number }[] = (() => {
  const out: { t: number; v: number }[] = [];
  let sum = OPENING;
  let i = 0;
  for (let t = SPAN.past; t <= 0; t++) {
    while (i < LEDGER.length && LEDGER[i]!.t <= t) sum += signed(LEDGER[i++]!);
    out.push({ t, v: Math.round(sum * 100) / 100 });
  }
  return out;
})();

export const BALANCE_TODAY = balanceAt(0);
export const CURVE_MIN = Math.min(...CURVE.map(p => p.v));
export const CURVE_MAX = Math.max(...CURVE.map(p => p.v));

/** In, out and moved, over any window. `moved` is the number no other app shows you. */
export function flow(from: number, to: number) {
  let inc = 0, exp = 0, moved = 0;
  for (const tx of LEDGER) {
    if (tx.t < from || tx.t > to) continue;
    if (tx.kind === 'in') inc += tx.amount;
    else if (tx.kind === 'out') exp += tx.amount;
    else moved += tx.amount;
  }
  return { in: inc, out: exp, moved, net: inc - exp };
}

export const MONTH = flow(-30, 0);

/** What the last thirty days of choices cost — the slider's starting position. */
export const DISCRETIONARY_MONTH = Math.round(
  LEDGER.filter(tx => tx.t > -30 && tx.t <= 0 && DISCRETIONARY.includes(tx.cat))
    .reduce((s, tx) => s + tx.amount, 0),
);

/** Where it went, largest first. The biggest slice takes the accent — as it does in the app. */
export function spendByCategory(from: number, to: number) {
  const totals = new Map<CategoryId, number>();
  for (const tx of LEDGER) {
    if (tx.kind !== 'out' || tx.t < from || tx.t > to) continue;
    totals.set(tx.cat, (totals.get(tx.cat) ?? 0) + tx.amount);
  }
  const rows = [...totals].map(([cat, total]) => ({ cat, total, ...CATEGORIES[cat] }))
    .sort((a, b) => b.total - a.total);
  const sum = rows.reduce((s, r) => s + r.total, 0);
  return rows.map((r, i) => ({ ...r, share: r.total / sum, hue: i === 0 ? '#C8F24E' : r.hue }));
}

/**
 * What happens next, as a band rather than a line.
 *
 * The app's rule is that an estimate is labelled and bounded and never sits inside the same
 * figure as a confirmed one, so the projection here is three numbers, not one: what is already
 * scheduled, and a spread either side of it that widens the further out it reaches. A single
 * confident line into the future would be the exact lie this product exists to refuse.
 */
/**
 * The committed daily rate, derived from the scheduled months ahead: salary in, rent and
 * utilities out, insurance amortised across the year by falling where it falls. Everything
 * here is a payment somebody has already agreed to make.
 */
const committedDaily = (() => {
  const ahead = LEDGER.filter(tx => tx.t > 0 && tx.t <= SPAN.future);
  return ahead.reduce((s, tx) => s + signed(tx), 0) / SPAN.future;
})();

export function project(monthlySpend: number, days = 150) {
  const scheduled = LEDGER.filter(tx => tx.t > 0);
  const out: { t: number; mid: number; lo: number; hi: number }[] = [];
  const daily = monthlySpend / 30;
  let mid = BALANCE_TODAY;
  for (let t = 1; t <= days; t++) {
    /* Inside the scheduled window the real payments land on their real dates, which is what
       gives the line its sawtooth: rent on the 1st, salary on the 25th. Past the window there
       are no dates to know, only the rate they average out to. */
    if (t <= SPAN.future) { for (const tx of scheduled) if (tx.t === t) mid += signed(tx); }
    else mid += committedDaily;
    mid -= daily;
    /* The band is uncertainty about the only uncertain part — the discretionary half. It grows
       with time but sub-linearly, because habits are more predictable than any single week. */
    const spread = Math.pow(t, 0.85) * daily * 0.5;
    out.push({ t, mid, lo: mid - spread, hi: mid + spread });
  }
  return out;
}

/** The goal the what-if chapter moves: the day the balance first clears a target. */
export const GOAL = 90_000;
export function daysToGoal(monthlySpend: number): number | null {
  const path = project(monthlySpend, 1400);
  const hit = path.find(p => p.mid >= GOAL);
  return hit ? hit.t : null;
}

/* ── formatting ──────────────────────────────────────────────────────────────────────────── */
const nf = new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf0 = new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 });

export const money = (n: number) => nf.format(n);
export const money0 = (n: number) => nf0.format(Math.round(n));
/** The hero splits its decimals off, the way the app's balance hero does. */
export const split = (n: number) => {
  const [int = '0', dec = '00'] = nf.format(Math.abs(n)).split('.');
  return { sign: n < 0 ? '−' : '', int, dec };
};

export function dateAt(t: number): Date {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() + t);
  return d;
}
export const labelDate = (t: number) =>
  dateAt(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'UTC' });
export const labelMonth = (t: number) =>
  dateAt(t).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
