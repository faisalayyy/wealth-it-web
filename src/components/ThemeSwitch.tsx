'use client';

import { Icon } from './Icon';

/**
 * Dark or light. Dark is the site's default; the choice is kept on this device (localStorage) and
 * set before the first paint by the layout's script. Both icons are in the page and CSS shows the
 * one for the theme it would switch to, so the button is right before any script runs.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const flip = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.classList.add('theme-turning');
    root.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f7f6f1' : '#0d0f0e');
    try {
      localStorage.setItem('theme', next);
    } catch {}
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    window.setTimeout(() => root.classList.remove('theme-turning'), 400);
  };
  return (
    <button type="button" className={className} onClick={flip} aria-label="Switch between dark and light">
      <span className="only-dark" title="Light theme">
        <Icon name="sun" size={18} />
      </span>
      <span className="only-light" title="Dark theme">
        <Icon name="moon" size={18} />
      </span>
    </button>
  );
}
