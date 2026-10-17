import { Button } from '@/components/Button';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/sections/product/PageHero';

export const metadata = { title: 'Page not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="page">
      <main id="main">
        <PageHero
          cap="404"
          title="Nothing here."
          lead="This page has gone missing, like a receipt in a coat pocket. The rest of the site is still here."
          actions={
            <>
              <Button label="Back to the homepage" href="/" tone="brand" />
              <Button label="See the features" href="/features/" tone="ink" variant="secondary" />
            </>
          }
        />
        <div style={{ height: 'clamp(80px, 10vw, 160px)' }} />
      </main>
      <SiteFooter />
    </div>
  );
}
