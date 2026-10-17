import { Button } from '@/components/Button';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHero } from '@/sections/product/PageHero';

export const metadata = { title: 'Not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="page">
      <main id="main">
        <PageHero
          cap="404"
          title="Nothing here."
          lead="That page doesn’t exist, but the rest of the site does."
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
