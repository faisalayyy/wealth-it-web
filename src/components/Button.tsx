import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import s from './Button.module.css';

/**
 * The button. On hover its letters roll up and out while a copy of them rolls in from below,
 * tilted, one letter after another — the label is split into characters here, on the server, so
 * the motion is pure CSS and nothing waits for JavaScript.
 *
 * tone:    'brand' is the lime with ink text, as the app's own buttons; 'neutral' sits on dark and
 *          Night grounds (Blade White); 'ink' is the dark button of light grounds.
 * variant: 'primary' is filled, 'secondary' a light wash, 'outline' a hairline.
 */
export type ButtonProps = {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  tone?: 'neutral' | 'brand' | 'ink';
  /** 'sm' for the header: 40 tall, radius 10 */
  size?: 'md' | 'sm';
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: IconName;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  as?: 'span';
  /** for a button inside a form */
  type?: 'button' | 'submit';
};

function Label({ text }: { text: string }) {
  const chars = [...text];
  const row = (clone: boolean) =>
    chars.map((c, i) => (
      <span key={i} className={s.c} style={{ '--i': i + 1 } as React.CSSProperties}>
        {c === ' ' ? ' ' : c}
      </span>
    ));
  return (
    <span className={s.label}>
      <span className={s.row}>{row(false)}</span>
      <span className={`${s.row} ${s.clone}`} aria-hidden>
        {row(true)}
      </span>
    </span>
  );
}

export function Button({ label, href, onClick, tone = 'brand', size = 'md', variant = 'primary', icon, className, external, ariaLabel, as, type = 'button' }: ButtonProps) {
  const inner: ReactNode = (
    <>
      <span className={s.bg} aria-hidden />
      {icon && <Icon name={icon} size={24} className={s.icon} />}
      <Label text={label} />
      <span className="sr-only">{label}</span>
    </>
  );
  const props = { className: `${s.button} ${className ?? ''}`, 'data-tone': tone, 'data-size': size, 'data-variant': variant, 'aria-label': ariaLabel };
  if (as === 'span') return <span {...props}>{inner}</span>;
  if (href && external) return <a {...props} href={href} target="_blank" rel="noopener" onClick={onClick}>{inner}</a>;
  if (href) return <Link {...props} href={href} onClick={onClick}>{inner}</Link>;
  return (
    <button type={type} {...props} onClick={onClick}>
      {inner}
    </button>
  );
}
