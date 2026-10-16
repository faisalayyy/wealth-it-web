import Link from 'next/link';
import { Icon } from './Icon';
import s from './SupportButton.module.css';

/** The corner pill that leads to help. The app has no support inbox; the support page answers. */
export function SupportButton() {
  return (
    <Link href="/support/" className={s.support}>
      <span className={s.bg} aria-hidden />
      <Icon name="support" size={24} />
      <span>Support</span>
    </Link>
  );
}
