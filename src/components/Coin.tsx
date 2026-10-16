import type { ReactNode } from 'react';

/**
 * A headline's closing full stop, drawn as the logo's gold coin — the brand's campaign rule: every
 * headline ends on it (App/docs/marketing/app-store-campaign.md). `coined('Every step counts.')`
 * gives the words and the coin; text without a closing full stop comes back as it was.
 */
export function coined(text: string): ReactNode {
  if (!text.endsWith('.')) return text;
  return (
    <>
      {text.slice(0, -1)}
      <span className="coin" aria-hidden />
    </>
  );
}
