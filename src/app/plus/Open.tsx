'use client';

import { openPlus, type Intent } from './Join';

/** A button that opens the Wealthit+ dialog for a trial, a plan or the account's plan. */
export function Open({ intent, className, children }: { intent: Intent; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => openPlus(intent)}>
      {children}
    </button>
  );
}
