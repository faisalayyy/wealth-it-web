/**
 * Every word on the site, away from the components that animate them.
 *
 * Copy changes constantly and animation logic should not have to be re-read to change a
 * sentence. Figures are deliberately absent here: anything numeric is derived at render time
 * from `ledger.ts`, so a sentence can never drift out of agreement with the chart beside it.
 */

export const site = {
  name: 'Wealth-it',
  tagline: 'Money is movement',
  description:
    'Wealth-it is a personal finance app for iPhone and Android. Wallets, transactions, budgets ' +
    'and what is coming — worked out on your phone, with no account, no server and nothing sent ' +
    'anywhere.',
} as const;

export const nav = [
  { href: '/', label: 'Index' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/support/', label: 'Support' },
] as const;

export interface Chapter {
  id: string;
  /** The number in the margin. The site is a document before it is an experience. */
  index: string;
  kicker: string;
  title: string[];
  body?: string;
  aside?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'present',
    index: '01',
    kicker: 'The present',
    title: ['A balance is not', 'a number.'],
    body:
      'It is the sum of everything that moved. Wealth-it never stores one — it works it out, ' +
      'every time you look, from the things you actually recorded.',
    aside: 'Drag across the year.',
  },
  {
    id: 'flow',
    index: '02',
    kicker: 'The flow',
    title: ['Money does not sit.'],
    body:
      'Salary lands on the 25th. Rent leaves on the 1st. What you have is the distance between ' +
      'them, and almost everything worth knowing lives in that distance.',
    aside:
      'A transfer between your own wallets is in neither column. It moves money and changes ' +
      'nothing, and no total here pretends otherwise.',
  },
  {
    id: 'pattern',
    index: '03',
    kicker: 'The pattern',
    title: ['You repeat', 'yourself.'],
    body:
      'Twelve months laid over one another. The commitments line up into columns. What is left ' +
      'scattered between them is the part you decide — and the part you can change.',
  },
  {
    id: 'next',
    index: '04',
    kicker: 'What is next',
    title: ['Nobody knows', 'what March holds.'],
    body:
      'So this does not draw a line into it. It draws a band, and tells you how wide. An ' +
      'estimate dressed as a fact is worse than no estimate at all.',
    aside: 'Scheduled payments are certain. Lunch is not. Only one of them is projected as solid.',
  },
  {
    id: 'decision',
    index: '05',
    kicker: 'The decision',
    title: ['Move one thing.'],
    body:
      'Everything after it moves too. This is the same arithmetic the app does, on the same ' +
      'ledger you have been scrolling through.',
    aside: 'Take hold of the figure.',
  },
  {
    id: 'product',
    index: '06',
    kicker: 'The product',
    title: ['All of it fits', 'in a pocket.'],
    body:
      'Six kinds of wallet, any currency, budgets, scheduled payments, and the whole history ' +
      'searchable six ways. On the phone. With no account, because there is no server to keep ' +
      'one on.',
  },
];

/** The closing statement. Four words, one per beat, and then the name. */
export const CONVERGE = ['Record', 'Derive', 'Project', 'Decide'] as const;

export const FOOTER_NOTE =
  'The figures throughout this site are demo data — one generated ledger of ' +
  'transactions, and every number you saw derived from it, exactly as the app would.';
