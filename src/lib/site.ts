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
 * The web app (../WebApp): the same account and the same records as the phone, in a browser. Offline
 * since 17 November 2026 (Faisal): dashboard.wealthit.app is gone and the site says nothing about it.
 * Its code stays on GitHub; set the address here again, and bring back what PR "remove the web app"
 * took out, the day it returns.
 */
export const webApp: string | null = null;

/**
 * Wealthit+, the paid plan (the app's A631, A632, A636, A643). Bought, started (the trial) and
 * cancelled only on wealthit.app, through Safepay, in Pakistani rupees: the apps never sell it and
 * never mention the website or prices (A643, 18 November 2026). With the web app offline, /plus finds
 * the account by its email and a one-time code (the server's A644). No dollar prices anywhere (A636).
 *
 * `api` is Wealthit's server, which /plus talks to. It stays null until Faisal switches Wealthit+ on
 * (WEALTHIT_PLUS on the server, https://wealthit.app in its WEALTHIT_WEB_ORIGINS, Safepay out of test
 * mode); until then /plus says "Coming soon", the content security policy lets the page reach
 * nothing, and the privacy policy leaves out the paragraph about the page. Then it is
 * 'https://wealthit-api.onrender.com'. Never call the trial "free" (Faisal).
 */
export const plus = {
  name: 'Wealthit+',
  prices: { month: 'Rs 299', year: 'Rs 2,999', life: 'Rs 4,999' },
  trialDays: 14,
  wallets: 5,
  historyMonths: 6,
  api: 'https://wealthit-api.onrender.com' as string | null,
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
