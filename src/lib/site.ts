/**
 * The facts every page repeats, and the links that do not exist yet.
 *
 * `stores` and `webApp` stay `null` until they exist; every control that reads them says "Coming
 * soon" while they are null and becomes a real link the day they are not — one line here.
 */
export const site = {
  name: 'Wealthit',
  origin: 'https://wealthit.app',
  title: 'Wealthit: budget app and expense tracker',
  tagline: 'Small steps. Big wealth.',
  description:
    'Build better money habits with Wealthit, a budget app and expense tracker: 26 currencies, budgets, bills and savings goals in one place. No ads, no tracking.',
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
