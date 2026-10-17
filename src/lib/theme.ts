'use client';

import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

/**
 * The site's theme as set on <html data-theme> (dark unless the visitor chose light; layout.tsx and
 * ThemeSwitch), for the few things CSS can't swap: a recording's source.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    read();
    window.addEventListener('themechange', read);
    return () => window.removeEventListener('themechange', read);
  }, []);
  return theme;
}

/** The recordings the iOS session also made in light (scripts/videos.sh). */
const LIGHT_TWINS = new Set(['record-expense-dark', 'hide-amounts-dark']);

/** A recording in the site's theme, where there is one. */
export const themedVideo = (name: string, theme: Theme) => (theme === 'light' && LIGHT_TWINS.has(name) ? name.replace(/-dark$/, '-light') : name);
