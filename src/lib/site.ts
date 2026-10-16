/**
 * The facts every page repeats, and the links that do not exist yet.
 *
 * `stores` and `webApp` stay `null` until they exist; every control that reads them says "Coming
 * soon" while they are null and becomes a real link the day they are not — one line here.
 */
export const site = {
  name: 'Wealthit',
  origin: 'https://wealthit.app',
  title: 'Wealthit — Know where you stand',
  tagline: 'Small steps. Big wealth.',
  description:
    'Wealthit keeps your accounts, cash and cards in any currency, your budgets, bills and goals — the same on every phone you sign in on, with no tracking and no ads.',
} as const;

/** App Store and Google Play. The iPhone app is in TestFlight; Android is planned, not built. */
export const stores: { ios: string | null; android: string | null } = { ios: null, android: null };

/**
 * The web app (../WebApp): the same account and the same records as the phone, in a browser. Not
 * deployed yet; its root shows sign-in to anyone signed out, so one URL serves "Log in" and
 * "Sign up" alike.
 */
export const webApp: string | null = null;

/** The address on the support and privacy pages, read by Faisal (app repo, A376). */
export const contactEmail = 'support@wealthit.app';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** Anything referenced by a raw src/href (not next/link) goes through here. */
export const asset = (path: string) => `${basePath}${path}`;
