import { plus } from '@/lib/site';

export type Plan = 'year' | 'month' | 'life';

/**
 * The three plans as the page and its dialog name them (the app's plans screen, Hand-off.md, in
 * rupees, A636). Yearly is picked first; "Save 16%" is 1 − 2,999 ÷ (12 × 299).
 */
export const PLANS: Record<Plan, { name: string; price: string; per: string; sub: string; line: string; badge?: string }> = {
  year: {
    name: 'Yearly',
    price: plus.prices.year,
    per: 'a year',
    sub: 'Rs 249.92 a month, billed yearly',
    line: `${plus.prices.year} a year, renewing until you stop`,
    badge: 'Save 16%',
  },
  month: {
    name: 'Monthly',
    price: plus.prices.month,
    per: 'a month',
    sub: 'Pay as you go',
    line: `${plus.prices.month} a month, renewing until you stop`,
  },
  life: {
    name: 'For life',
    price: plus.prices.life,
    per: 'once',
    sub: 'One payment, never renews',
    line: `${plus.prices.life} once, and it never renews`,
  },
};
