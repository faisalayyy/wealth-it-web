/**
 * The facts every page repeats, and the links that do not exist yet.
 *
 * `stores` and `webApp` stay `null` until they exist; every control that reads them says "Coming
 * soon" while they are null and becomes a real link the day they are not — one line here.
 */
export const site = {
  name: 'Wealthit',
  origin: 'https://wealthit.app',
  title: 'Wealthit: know where you stand',
  tagline: 'Small steps. Big wealth.',
  description:
    'Wealthit keeps your accounts, cash and cards in any currency, plus your budgets, bills and goals. Sign in on any phone and it’s all there. No tracking, no ads.',
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

/**
 * Where Wealthit is on social media. Only accounts that exist: the Instagram is the app's own
 * (App/docs/marketing/instagram/README.md). Shown in the menu and the footer.
 */
export const socials: { label: string; handle: string; href: string; icon: 'instagram' }[] = [
  { label: 'Instagram', handle: '@wealthitapp', href: 'https://www.instagram.com/wealthitapp/', icon: 'instagram' },
];

/** For search engines and link previews. */
export const seo = {
  keywords: [
    'expense tracker',
    'budget app',
    'money manager',
    'personal finance app',
    'multi-currency budget',
    'receipt scanner',
    'Apple Pay expense tracking',
    'bill reminders',
    'savings goals',
    'iPhone budgeting app',
  ],
  ogAlt: 'Wealthit: know where you stand. Accounts, budgets, bills and goals on your iPhone.',
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** Anything referenced by a raw src/href (not next/link) goes through here. */
export const asset = (path: string) => `${basePath}${path}`;
