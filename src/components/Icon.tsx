/** Line icons on a 24px grid, stroked, drawn for this site. */
const PATHS: Record<string, string> = {
  home: 'M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z',
  'chevron-down': 'm7 10 5 5 5-5',
  'arrow-up-right': 'M8 16 16 8M9 8h7v7',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  lock: 'M7.5 11V8a4.5 4.5 0 0 1 9 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM12 15v2',
  key: 'M8 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h8.5M17 12v3M20 12v2.5',
  'eye-off': 'M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-2.6 3.2M6.6 6.6C4.3 8.2 3 12 3 12s4 6 9 6a9 9 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
  bank: 'M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18',
  trash: 'M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13',
  mail: 'M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  expense: 'M12 5v14M6 13l6 6 6-6',
  income: 'M12 19V5M6 11l6-6 6 6',
  transfer: 'M17 3l4 4-4 4M3 11V9a2 2 0 0 1 2-2h16M7 21l-4-4 4-4M21 13v2a2 2 0 0 1-2 2H3',
  swap: 'M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4',
  restart: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  support: 'M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3V6a1 1 0 0 1 1-1ZM9 10h6M9 13h4',
  wallet: 'M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h11M16 13h.01',
  shield: 'M12 21s7-3.5 7-9V6l-7-3-7 3v6c0 5.5 7 9 7 9Z',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.5v.01',
  download: 'M12 4v11M7 10.5l5 5 5-5M5 20h14',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
  moon: 'M19.5 14.6A7.5 7.5 0 0 1 9.4 4.5a7.5 7.5 0 1 0 10.1 10.1Z',
  instagram: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3ZM12 15.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6ZM17.2 6.8v.01',
  tap: 'M9 7.5a6 6 0 0 1 0 9M12.5 5a9.5 9.5 0 0 1 0 14M16 2.5a13 13 0 0 1 0 19M5.5 10a2.5 2.5 0 0 1 0 4',
};

export type IconName = keyof typeof PATHS | string;

export function Icon({ name, size = 24, stroke = 1.6, className }: { name: IconName; size?: number; stroke?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
