import type { CropName, CutName, ScreenName } from './screens';

/**
 * What the app does, one entry per feature page (/features/<slug>/), the same entries on the
 * Features page, in the header's menu and in the footer. Every line describes the app as built —
 * checked against App/docs/product.json, its decisions and the iOS session's captures and notes of 17 October 2026 — and
 * every picture is one of its captures (screens.json). Plain words: say what happens, not how
 * clever it is; no "smart", "effortless", "seamless", "all in one" or "take control".
 */

export type Media =
  | { tap: true; dark?: boolean }
  | { video: string; label: string; dark?: boolean }
  | { screen: ScreenName; dark?: boolean }
  | { screens: ScreenName[]; dark?: boolean }
  | { cut: CutName; dark?: boolean }
  | { cuts: CutName[]; dark?: boolean }
  | { crop: CropName; dark?: boolean };

export type Row = { cap: string; title: string; text: string; media: Media };
export type Fact = { title: string; text: string; media?: Media };

export type FeaturePage = {
  slug: string;
  /** in menus and cards */
  label: string;
  /** one line, in menus and cards */
  summary: string;
  /** the page's title in search results and link previews (before " | Wealthit"); the label otherwise */
  metaTitle?: string;
  /** for search results, when the summary and the hero's lead together would say it badly */
  metaDescription?: string;
  /** the menu's thumbnail and the card's screen */
  thumb: ScreenName;
  /** the card's ground */
  dark: boolean;
  hero: { title: string; lead: string; screens: ScreenName[]; /** shown instead of the screens */ media?: Media };
  rows: Row[];
  facts: Fact[];
};

export const featurePages: FeaturePage[] = [
  {
    slug: 'recording',
    label: 'Recording',
    summary: 'Type a payment the way you’d say it, scan the receipt, or tap Add after Apple Pay.',
    metaTitle: 'Expense tracker and receipt scanner',
    metaDescription: 'Log a payment as one short sentence, let the receipt scanner fill it in, or tap Add after Apple Pay. An expense tracker with no forms in the way.',
    thumb: 'record-sheet-dark',
    dark: true,
    hero: {
      title: 'Write it down the way you’d say it.',
      lead: 'Every record is one short sentence: I spent AED 42.50 on Restaurant, fast-food from Main bank, today. Fill in the blanks yourself, or let a receipt do it for you.',
      screens: ['record-sheet-dark', 'scan-done-dark'],
    },
    rows: [
      {
        cap: 'Finish the sentence',
        title: 'Expense tracking in one sentence.',
        text: 'Tap +, type the amount on Wealthit’s own number pad, pick what it was for, and you’re done. The sentence reads back exactly what will be saved, so there’s nothing to double-check.',
        media: { video: 'record-expense-dark', label: 'Recording an expense: the amount, then the category, then Done', dark: true },
      },
      {
        cap: 'Receipt scanner',
        title: 'Snap it, then check it.',
        text: 'Point the camera at a receipt, or pick a photo of one. Wealthit reads it on your phone and fills in the amount, the shop, the date and the category, and you look it over before it’s saved. The photo stays with the record, on your phone.',
        media: { video: 'scan-receipt-dark', label: 'Scanning a receipt: the scan line reads it, the record fills in, Done', dark: true },
      },
      {
        cap: 'Tap to Record',
        title: 'Pay, and it’s already written down.',
        text: 'Set it up once: add the shortcut and link each card to a wallet. After you pay with Apple Pay, a card appears on your Lock Screen with the amount and the shop. Tap Add and it’s recorded; tap Cancel and it isn’t.',
        media: { tap: true, dark: true },
      },
    ],
    facts: [
      { title: 'Income and transfers', text: 'Money in, money out, and money moved between your own wallets, with the fee if there was one. A transfer never counts as spending.' },
      { title: 'Split one payment', text: 'Split one receipt across several categories. The parts can never add up to more than the total.' },
      { title: 'It remembers where you shop', text: 'Shops you’ve paid before are remembered, so you only type each one once.' },
      { title: 'Find anything', text: 'Search and filter every record, duplicate one you make often, or change many at once.' },
      { title: 'Bring your history', text: 'Import a spreadsheet from your bank, from BudgetBakers Wallet or from Wealthit itself.' },
      { title: 'Receipt photos stay home', text: 'Up to four photos per record, kept on your phone. They’re never uploaded.' },
    ],
  },
  {
    // App/docs/TAP_TO_RECORD.md and decisions A348, A349, A350, A353, A354. iPhone only, with Apple
    // Pay; set up once. The Lock Screen card can't be captured on a simulator: media-src/app.
    slug: 'tap-to-record',
    label: 'Tap to Record',
    summary: 'Pay with Apple Pay and the payment is already filled in. Tap Add and you’re done.',
    metaTitle: 'Tap to Record: Apple Pay expense tracking',
    metaDescription: 'Pay with Apple Pay and Wealthit puts the payment on your Lock Screen, already filled in. Tap Add and it’s recorded. Expense tracking with nothing to type.',
    thumb: 'lockscreen',
    dark: true,
    hero: {
      title: 'You paid. It’s already written down.',
      lead: 'Pay with Apple Pay and Wealthit puts the payment on your Lock Screen with the shop, the amount, the category and the wallet filled in. Tap Add and it’s recorded. Tap Cancel and it isn’t.',
      screens: ['lockscreen'],
      media: { tap: true, dark: true },
    },
    rows: [
      {
        cap: 'On your Lock Screen',
        title: 'The payment, filled in for you.',
        text: 'A moment after you pay, Wealthit shows the shop and the amount on your Lock Screen, and in the Dynamic Island where there is one. You don’t open the app or type a thing.',
        media: { tap: true, dark: true },
      },
      {
        cap: 'Worked out from the payment',
        title: 'The category from the shop. The wallet from the card.',
        text: 'A shop you have filed before goes where you filed it last time. A new one is filed by its name, so a supermarket goes under Groceries and a petrol station under Fuel. If Wealthit can’t tell, you choose once and it remembers.',
        media: { screen: 'categories-dark', dark: true },
      },
      {
        cap: 'Your choice',
        title: 'Save at once, or check first.',
        text: 'With Save automatically, Add records the payment there and then. With Confirm before saving, Add opens the record already filled in, for you to look over and save.',
        media: { screen: 'record-sheet-dark', dark: true },
      },
    ],
    facts: [
      { title: 'Set up once', text: 'Add Wealthit’s shortcut in the Shortcuts app and switch it on. The app shows you each step.' },
      { title: 'Your cards', text: 'The first time you pay with a card, you choose its wallet. Change or forget any card later.' },
      { title: 'Never twice', text: 'If the same payment arrives twice, it’s recorded once.' },
      { title: 'Nothing to type', text: 'The amount comes from the payment itself, in the wallet’s own currency.' },
      { title: 'Works with Apple Pay', text: 'Tap to Record picks up the payments you make with Apple Pay.' },
      { title: 'Only what you paid', text: 'Apple Pay passes on the card, the shop and the amount, and nothing more. There is no bank login.' },
    ],
  },
  {
    slug: 'accounts',
    label: 'Accounts & currencies',
    summary: 'Bank accounts, cash, cards and savings in 26 currencies, added up to one total.',
    metaTitle: 'Multi-currency accounts and net worth',
    metaDescription: 'Keep bank accounts, cash, cards and savings in 26 currencies and see one total and your net worth. A multi-currency money manager that never guesses a rate.',
    thumb: 'wallets-dark',
    dark: true,
    hero: {
      title: 'Every account and currency in one total.',
      lead: 'Add the places your money lives, like a bank account in dirhams, savings in rupees, a card in dollars and the cash in your wallet. Then see it all added up in the currency you choose.',
      screens: ['wallets-dark', 'home-dark'],
    },
    rows: [
      {
        cap: 'Every kind of wallet',
        title: 'Bank, cash, card, savings or loan.',
        text: 'Each wallet keeps its own currency and its own balance. Balances are worked out from what you record, never typed in and forgotten.',
        media: { crop: 'wallet-rows', dark: true },
      },
      {
        cap: '26 currencies',
        title: 'Added up at the day’s rate.',
        text: 'Totals use the rate you actually got on a transfer, a fixed peg like the dirham’s to the dollar, or the day’s published rate. If there’s no rate, the amount is left out of the total and the app tells you so. It never guesses.',
        media: { crop: 'net-worth', dark: true },
      },
      {
        cap: 'Friends & family',
        title: 'Who owes whom, kept straight.',
        text: 'Lend to a friend or borrow from family and it gets its own wallet, so the group chat can stop asking who owes what. You get a reminder when it’s due.',
        media: { screen: 'friends-family-dark', dark: true },
      },
    ],
    facts: [
      { title: 'One main currency', text: 'Pick the currency your totals are shown in. Every wallet still shows its own.' },
      { title: 'Rates you can switch off', text: 'Turn off the daily rates and totals use only your own transfer rates and fixed pegs.' },
      { title: 'Transfers between currencies', text: 'Move dollars into a dirham account and record what you sent, what arrived and the fee.' },
      { title: 'Net worth', text: 'What you have, minus what you owe, across every wallet.' },
    ],
  },
  {
    slug: 'budgets',
    label: 'Budgets',
    summary: 'Set a limit and get a heads-up before you go over.',
    metaTitle: 'Budget planner with overspending alerts',
    metaDescription: 'Set a weekly, monthly or yearly budget for any category, see what you can spend each day, and get a heads-up before you overspend. A budget app that keeps you ahead.',
    thumb: 'budgets-dark',
    dark: true,
    hero: {
      title: 'A heads-up before you overspend.',
      lead: 'Give any category a budget for the week, the month or the year. Wealthit shows what’s left, what that comes to per day, and tells you when it’s nearly used up.',
      screens: ['budgets-dark', 'budget-detail-dark'],
    },
    rows: [
      {
        cap: 'At a glance',
        title: 'Over, running out early, or fine.',
        text: 'Budgets are grouped by how they’re doing, so the one that needs your attention is always at the top.',
        media: { crop: 'budget-over', dark: true },
      },
      {
        cap: 'Per day',
        title: 'What you can spend today.',
        text: 'Open a budget to see what’s left, an amount a day for the days remaining, and every record that counted towards it.',
        media: { video: 'budget-dark', label: 'Opening the Housing budget: what is left, a day’s allowance, its records', dark: true },
      },
      {
        cap: 'Budget alerts',
        title: 'Told while there’s still time.',
        text: 'When a budget is nearly used up, a notification says how much is left, so you hear about it before the month is over.',
        media: { crop: 'notif-budget', dark: true },
      },
    ],
    facts: [
      { title: 'Any period', text: 'Weekly, monthly, yearly, or once for a trip or an event.' },
      { title: 'Roll it over, or not', text: 'Choose whether unspent money carries into the next period.' },
      { title: 'History', text: 'See how each budget went, month after month.' },
      { title: 'On Home', text: 'Budgets that are over show up on Home, so you never have to go looking.' },
    ],
  },
  {
    slug: 'goals',
    label: 'Goals',
    summary: 'Save towards something, and see how much to put aside each month.',
    metaTitle: 'Savings goals and habit streaks',
    metaDescription: 'Set a savings goal with an amount and a date and Wealthit works out what to put aside each month, and whether you’re on track. Loans to clear and streaks, too.',
    thumb: 'goals-dark',
    dark: true,
    hero: {
      title: 'Every step counts.',
      lead: 'Name what you’re saving for, how much and by when. Wealthit works out what to put aside each month and tells you if you’re on track. Future you will thank you.',
      screens: ['goals-dark', 'goal-detail-dark'],
    },
    rows: [
      {
        cap: 'On track or behind',
        title: 'Know where every goal stands.',
        text: 'Each goal shows what you’ve saved, what’s left, and how many months to go.',
        media: { crop: 'goal-card', dark: true },
      },
      {
        cap: 'A month at a time',
        title: 'The amount, worked out for you.',
        text: 'Set a target and a date, and the goal tells you how much to save each month to get there. It also shows when you’ll get there at the pace you’re going.',
        media: { video: 'goal-dark', label: 'Opening the Trip goal: its progress, the monthly amount and its history', dark: true },
      },
    ],
    facts: [
      { title: 'Saving or paying off', text: 'A goal can be money to save, or a loan to clear.' },
      { title: 'Habits, too', text: 'A goal can be a streak, such as thirty days without something, counted day by day.' },
      { title: 'Counted for you', text: 'Money you label for a goal counts towards it, with no adding up on your part.' },
      { title: 'A widget', text: 'Keep a goal on your Home Screen and watch it move.' },
    ],
  },
  {
    slug: 'bills',
    label: 'Bills & schedules',
    summary: 'Rent, salary and subscriptions that record themselves on the day.',
    metaTitle: 'Bill reminders and recurring payments',
    metaDescription: 'Bill reminders for rent, salary and subscriptions: set each one up once and it records itself on the day or asks you first. See the next 30 days at a glance.',
    thumb: 'schedules-dark',
    dark: true,
    hero: {
      title: 'Bills that remember themselves.',
      lead: 'Set up rent, salary or a subscription once. On the day it records itself, or asks you first if you’d rather check the amount. One less thing to keep in your head.',
      screens: ['schedules-dark', 'schedule-detail-dark'],
    },
    rows: [
      {
        cap: 'Waiting for you',
        title: 'Record it, or skip this time.',
        text: 'A bill that asks first waits at the top of the list until you choose. Handy for the ones that change every month, like electricity.',
        media: { crop: 'bill-waiting', dark: true },
      },
      {
        cap: 'History',
        title: 'Every time it was paid.',
        text: 'Open a schedule to see when it’s next due and every payment it has made.',
        media: { screen: 'schedule-detail-dark', dark: true },
      },
      {
        cap: 'Never twice',
        title: 'Recorded once, on every phone.',
        text: 'Each payment is tied to its schedule and its date, so the same rent on the same day is the same record, however many times the app is opened and on however many phones.',
        media: { screen: 'planning-dark', dark: true },
      },
    ],
    facts: [
      { title: 'Coming up', text: 'The next 30 days are on the Scheduled payments screen, and what’s due soon is on Home.' },
      { title: 'Bill reminders', text: 'A reminder on the day, scheduled by your phone.' },
      { title: 'Planning', text: 'Scheduled payments, budgets and goals side by side on one screen.' },
    ],
  },
  {
    slug: 'home',
    label: 'Home & widgets',
    summary: 'Put what matters first, hide the amounts, and keep it on your Home Screen.',
    metaTitle: 'Money overview and Home Screen widgets',
    metaDescription: 'Choose what Wealthit’s Home shows and in what order, hide amounts with one tap, and keep budgets, goals and spending on your Home Screen with seven widgets.',
    thumb: 'home-dark',
    dark: true,
    hero: {
      title: 'Put what matters first.',
      lead: 'Home shows your total, what you spent today, the month’s spending and what’s due. Choose what it shows and in what order, in light or dark.',
      screens: ['home-dark', 'home-budgets-dark'],
    },
    rows: [
      {
        cap: 'Customise Home',
        title: 'Home in the order you choose.',
        text: 'Hold a section, such as budgets, goals, coming up or the spending pulse, and drag it where you want it. Tap Save and Home follows your lead.',
        media: { video: 'customise-home-dark', label: 'Customise Home: Goals dragged above Budgets, saved, and Home in the new order', dark: true },
      },
      {
        cap: 'Hide amounts',
        title: 'For your eyes only.',
        text: 'One tap on the eye and every amount turns to drifting dots, so the person next to you can’t read them. Lock the app with Face ID or a PIN as well.',
        media: { video: 'hide-amounts-dark', label: 'Hiding amounts on Home with a tap on the eye, and showing them again', dark: true },
      },
      {
        cap: 'Notifications',
        title: 'What needs you, in one list.',
        text: 'Budgets nearly used up, bills due today and money owed to you show up here, each with the button to deal with it.',
        media: { crop: 'notif-list', dark: true },
      },
    ],
    facts: [
      { title: 'Seven widgets', text: 'Remaining, Spending, Coming up, Budgets, Wallets, Quick add and Goals.' },
      { title: 'Spending pulse', text: 'Today and this week, against what is usual for you.' },
      { title: 'Spent today', text: 'What today has cost so far, at a glance.' },
      { title: 'Statistics', text: 'A balance forecast, spending and cashflow for any range of dates.' },
      { title: 'Light or dark', text: 'Whichever you like, on every screen.' },
    ],
  },
];

export const featureBySlug = (slug: string) => featurePages.find(f => f.slug === slug);
