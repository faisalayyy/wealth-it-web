import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/Button';
import { Shot } from '@/components/Shot';
import { SiteFooter } from '@/components/SiteFooter';
import { featureBySlug, featurePages } from '@/lib/features';
import { breadcrumbs, JsonLd, pageMeta } from '@/lib/seo';
import { Closing } from '@/sections/home/Closing';
import { Facts } from '@/sections/product/Facts';
import { NextFeature } from '@/sections/product/NextFeature';
import { PageHero } from '@/sections/product/PageHero';
import { Rows } from '@/sections/product/Rows';

/**
 * One page per feature (src/lib/features.ts), laid out as the reference's product page: the
 * headline and the app in a large panel, the feature rows, the smaller things, the next feature,
 * and the way to the app.
 */
export function generateStaticParams() {
  return featurePages.map(f => ({ slug: f.slug }));
}

/** whole sentences, as many as fit in n characters (search results cut longer descriptions) */
const upTo = (text: string, n: number) =>
  (text.match(/[^.]+\.(\s|$)/g) ?? [text]).reduce((out, s) => (out && (out + s).trim().length > n ? out : out + s), '').trim();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = featureBySlug((await params).slug);
  return f ? pageMeta({ title: f.label, description: f.metaDescription ?? upTo(f.hero.lead, 165), path: `/features/${f.slug}/` }) : {};
}

export default async function Feature({ params }: { params: Promise<{ slug: string }> }) {
  const f = featureBySlug((await params).slug);
  if (!f) notFound();
  const next = featurePages[(featurePages.indexOf(f) + 1) % featurePages.length];
  return (
    <div className="page">
      <main id="main">
        <JsonLd
          data={breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features/' },
            { name: f.label, path: `/features/${f.slug}/` },
          ])}
        />
        <PageHero
          cap={f.label}
          title={f.hero.title}
          lead={f.hero.lead}
          dark={f.dark}
          actions={
            <>
              <Button label="Get the app" href="/#get" tone="brand" />
              <Button label="All features" href="/features/" tone="ink" variant="secondary" />
            </>
          }
          media={<Shot media={f.hero.media ?? { screens: f.hero.screens }} sizes="(max-width: 743px) 64vw, 300px" />}
        />
        <Rows rows={f.rows} />
        <Facts facts={f.facts} />
        <NextFeature feature={next} />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
