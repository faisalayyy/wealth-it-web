import type { ReactNode } from 'react';

/**
 * A headline's closing full stop, in the lime: the brand's campaign rule, every headline ends on it
 * (App/docs/marketing/app-store-campaign.md; the lime since A417). `fullStop('Every step counts.')`
 * gives the words and the stop; text without a closing full stop comes back as it was.
 */
export function fullStop(text: string): ReactNode {
  if (!text.endsWith('.')) return text;
  return (
    <>
      {text.slice(0, -1)}
      <span className="stop" aria-hidden />
    </>
  );
}
