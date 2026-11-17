/**
 * The facts every page repeats, and the links that do not exist yet.
 *
 * `stores` and `webApp` are the real addresses; every control that reads them says "Coming soon"
 * while one is null and is a real link otherwise.
 */
export const site = {
  name: 'Wealthit',
  origin: 'https://wealthit.app',
  title: 'Wealthit: budget app and expense tracker',
  tagline: 'Small steps. Big wealth.',
  description:
    'Build better money habits with Wealthit, a budget app and expense tracker: 26 currencies, budgets, bills and savings goals in one place. No ads, no tracking.',
} as const;

/**
 * App Store and Google Play, live since November 2026. The App Store link has no country in it, so
 * Apple opens each visitor's own store.
 */
export const stores: { ios: string | null; android: string | null } = {
  ios: 'https://apps.apple.com/app/id6821437072',
  android: 'https://play.google.com/store/apps/details?id=com.faisalayyy.wealthit',
};

/**
 * The web app (../WebApp, built into the wealthit-dashboard-site repository): the same account and
 * the same records as the phone, in a browser. Its root shows sign-in to anyone signed out, so one
 * URL serves "Log in" and "Sign up" alike.
 */
export const webApp: string | null = 'https://dashboard.wealthit.app';

/**
 * Wealthit+, the paid plan (the app's A631, A632, 17 November 2026). Prices are set in US dollars:
 * on the web Safepay charges the amount in rupees, and in the apps each store shows its own local
 * price. `checkout` stays null until Safepay's checkout is live; every button that reads it says
 * "Coming soon" until then. Never call the trial "free" (Faisal).
 */
export const plus = {
  name: 'Wealthit+',
  prices: { month: '$1.99', year: '$14.99', life: '$39.99' },
  trialDays: 14,
  wallets: 5,
  checkout: null as string | null,
};

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
    'budget app',
    'expense tracker',
    'spending tracker',
    'money manager',
    'personal finance app',
    'multi-currency budget app',
    'savings goals',
    'bill reminders',
    'receipt scanner',
    'Apple Pay expense tracking',
    'financial habits',
    'net worth tracker',
  ],
  ogAlt: 'Wealthit, the budget app: the line “Know where you stand.” beside two phones showing its Budgets and Home screens.',
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** Anything referenced by a raw src/href (not next/link) goes through here. */
export const asset = (path: string) => `${basePath}${path}`;
