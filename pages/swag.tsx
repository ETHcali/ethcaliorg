import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import Prices from '../components/swag/Prices';
import PurchaseModule from '../components/swag/PurchaseModule';
import { SWAG_WAYS, type Bilingual } from '../content/site';
import { getSwagCatalogue } from '../lib/content';
import { getTrm, type Trm } from '../lib/fx';
import { asLocale, type Locale } from '../lib/i18n';
import { posterSrc, GRID_SIZES } from '../lib/images';
import { APP } from '../lib/links';
import { swagRoute } from '../lib/swag';
import { SWAG_CATEGORIES, type SwagProduct } from '../types/content';


interface Props {
  products: SwagProduct[];
  /** Null when datos.gov.co was unreachable at build. The page then shows USD only. */
  trm: Trm | null;
  locale: Locale;
}

/** Section titles per category, in display order. Anything else lands under "other". */
const CATEGORY_NAMES: Record<(typeof SWAG_CATEGORIES)[number] | 'other', Bilingual> = {
  Cap: { es: 'Gorras', en: 'Caps' },
  Mug: { es: 'Mugs', en: 'Mugs' },
  Hoodie: { es: 'Hoodies', en: 'Hoodies' },
  'T-shirt': { es: 'Camisetas', en: 'T-shirts' },
  other: { es: 'Otros', en: 'Other' },
};

function groupByCategory(products: SwagProduct[]) {
  const keys = [...SWAG_CATEGORIES, 'other'] as const;
  const groups = new Map<(typeof keys)[number], SwagProduct[]>(keys.map((k) => [k, []]));
  for (const p of products) {
    const key = (SWAG_CATEGORIES as readonly string[]).includes(p.category)
      ? (p.category as (typeof SWAG_CATEGORIES)[number])
      : 'other';
    groups.get(key)!.push(p);
  }
  // An empty category is dropped rather than shown as "coming soon": the table
  // is the statement of what exists, and it says nothing about what is planned.
  return keys.filter((k) => groups.get(k)!.length > 0).map((k) => ({ key: k, items: groups.get(k)! }));
}

export default function Swag({ products, trm, locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';
  // Spanish is required, English optional: an untranslated row reads as Spanish, never blank.
  const pick = (es: string, en_: string) => (en && en_.trim() ? en_ : es);

  const lead = en
    ? 'Designed from the official Ethereum ecosystem assets and our own identity. Free at our events; the rest of the time it is sold, by card or in USDC on Base — 10 % off with USDC.'
    : 'Diseñado con los assets oficiales del ecosistema Ethereum y nuestra propia identidad. Gratis en nuestros eventos; el resto del tiempo se vende, con tarjeta o en USDC en Base — 10 % menos con USDC.';

  const groups = groupByCategory(products);

  return (
    <Layout>
      <Seo title={en ? 'Official swag' : 'Swag oficial'} description={lead} path="/swag" />

      <PageHeader eyebrow="Merch" title={en ? 'Official swag' : 'Swag oficial'} lead={lead} />

      {products.length === 0 && (
        // The fetch returned nothing — unconfigured env or an empty table. Say
        // so in one line and keep the rest of the page; a store with no stock
        // is still a page about how to earn the swag.
        <Section eyebrow={en ? 'Catalogue' : 'Catálogo'} title={en ? 'Official swag' : 'Swag oficial'}>
          <p className="rounded-card border border-dashed border-line-hairline bg-surface-slab p-5 text-sm text-content-muted">
            {en ? 'Catalogue unavailable right now.' : 'Catálogo no disponible por ahora.'}
          </p>
        </Section>
      )}

      {/* One section per kind, in a fixed order: caps, mugs, hoodies, t-shirts.
          A flat grid of seventeen would hide the fact that there are caps at
          all until you had read every caption. */}
      {groups.map((group) => (
        <Section key={group.key} eyebrow={en ? 'Catalogue' : 'Catálogo'} title={t(CATEGORY_NAMES[group.key])}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => {
              const name = pick(item.name_es, item.name_en) || item.sku;
              const description = pick(item.description_es, item.description_en);
              const image = posterSrc(item.image_path ? `/${item.image_path}` : null);
              const href = swagRoute(item.sku);

              return (
                <li
                  key={item.sku}
                  id={item.sku}
                  className="flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab"
                >
                  {image && (
                    // `object-contain`, not cover. These come in three shapes —
                    // 9:16 cap shots, square mugs, landscape pairs showing a
                    // front and a back — and cropping them all to a square cut
                    // the crown off every cap and half the artwork off every
                    // hoodie.
                    <Link href={href} className="relative block aspect-[4/3] bg-surface-inset">
                      <Image src={image} alt={name} fill sizes={GRID_SIZES} className="object-contain p-2" />
                    </Link>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-base font-bold leading-snug text-content-primary">
                      <Link href={href} className="transition-colors hover:text-eth-blue-text">
                        {name}
                      </Link>
                    </h3>
                    {description && (
                      <p className="flex-1 text-sm leading-relaxed text-content-muted">{description}</p>
                    )}

                    <div className="mt-1">
                      <Prices product={item} trm={trm} locale={locale} />
                    </div>

                    {/* The same module as the product page, compact: size first
                        when sized, then card (Shopify checkout, straight to
                        payment) or USDC (the app). Buying from the grid needs no
                        extra hop; the page exists for the ad and the share. */}
                    <PurchaseModule product={item} locale={locale} compact />
                  </div>
                </li>
              );
            })}
          </ul>

        </Section>
      ))}

      <Section
        eyebrow={en ? 'How to get it' : 'Cómo conseguirlo'}
        title={en ? 'Free at events, sold the rest of the time' : 'Gratis en eventos, a la venta el resto del tiempo'}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SWAG_WAYS.map((w) => (
            <div key={w.title.es} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <h3 className="text-base font-bold text-content-primary">{t(w.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(w.detail)}</p>
            </div>
          ))}
        </div>

        <a
          href={APP.swag}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-tap items-center rounded-control bg-eth-blue px-5 text-sm font-bold text-on-brand transition-colors hover:bg-eth-blue-lift"
        >
          {en ? 'See your collectibles' : 'Ver tus coleccionables'} →
        </a>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const [products, trm] = await Promise.all([getSwagCatalogue(), getTrm()]);
  return {
    props: { products, trm, locale: asLocale(locale) },
    revalidate: 60,
  };
};
