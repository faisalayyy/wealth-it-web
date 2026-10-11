/**
 * The handful of facts every page repeats, and the two links that do not exist yet.
 *
 * They live here rather than in eight pages because the day the app is accepted by a store is
 * the day somebody edits one line, and it should be one line. `null` is the honest value until
 * then: nothing on the site pretends there is a download when there is not.
 */

export const site = {
  name: 'Wealthit',
  /** One line, used as the <title> suffix and the OG description fallback. */
  tagline: 'Know where you stand',
  description:
    'Wealthit tracks wallets, transactions, budgets and scheduled payments in any currency, ' +
    'the same on every phone you sign in on, with no tracking and no ads.',
} as const;

/** Store links. Both are `null` until the first build is accepted — see README. */
export const stores: { ios: string | null; android: string | null } = {
  ios: null,
  android: null,
};

/** The address on the support and privacy pages, read by Faisal (app repo, A376). */
export const contactEmail = 'support@wealthit.app';

/**
 * Every internal link on the site goes through here.
 *
 * GitHub Pages serves this site from `/wealth-it-web/`, so a bare `/features/` would be a link
 * to somebody else's page. `BASE_URL` is whatever `base` is set to in `astro.config.mjs`, and
 * is `/` when there is no base at all — so the day this moves to its own domain, every call
 * below starts returning the path it was given and nothing else has to change.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => `${base}${path}`;

export const nav = [
  { href: '/features/', label: 'What it does' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/support/', label: 'Support' },
] as const;
