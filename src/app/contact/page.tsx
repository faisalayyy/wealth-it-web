import type { Metadata } from 'next';
import Link from 'next/link';
import p from '@/components/Prose.module.css';
import { SiteFooter } from '@/components/SiteFooter';
import { breadcrumbs, JsonLd, pageMeta } from '@/lib/seo';
import { contactEmail, plus, socials } from '@/lib/site';
import { PageHero } from '@/sections/product/PageHero';

/**
 * How to reach Wealthit, in one place, as Safepay asks of a merchant's website. The address is the
 * app's own (A376), read by Faisal through Zoho Mail (see the privacy policy).
 */
export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description: 'Write to Wealthit about the app, your account, your data, payments or refunds: one address, read by a person.',
  path: '/contact/',
});

export default function Contact() {
  return (
    <div className="page">
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact/' },
          ])}
        />
        <PageHero cap="Contact" title="Write to us." lead="One address for everything: the app, your account, your data, payments and refunds. A person reads it." />
        <div className={p.prose}>
          <h2>Email</h2>
          <p className={p.lead}>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>

          <h2>About a payment</h2>
          <p>
            Write from your Wealthit account’s email address, with the date and the amount of the payment. Never send a card number. How refunds work is in the{' '}
            <Link href="/refunds/">refund and cancellation policy</Link>, and what {plus.name} includes is in the{' '}
            <Link href="/terms/">terms of sale</Link>.
          </p>

          <h2>Answers you might not need to wait for</h2>
          <ul className={p.list}>
            <li>
              <Link href="/support/">Help and questions</Link>: signing in, new phones, your records and your key.
            </li>
            <li>
              <Link href="/privacy/#delete-account">Deleting your account</Link>, from the app or by email.
            </li>
            <li>
              <Link href="/privacy/">The privacy policy</Link>: what Wealthit keeps, where, and why.
            </li>
          </ul>

          <h2>Who makes Wealthit</h2>
          <p>Wealthit is made by Faisal Mukhtar, who is responsible for the app, this website and {plus.name}.</p>

          {socials.length > 0 && (
            <>
              <h2>Elsewhere</h2>
              <p>
                {socials.map(s => (
                  <a key={s.href} href={s.href}>
                    {s.label} {s.handle}
                  </a>
                ))}
              </p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
