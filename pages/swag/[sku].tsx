import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import Prices from '../../components/swag/Prices';
import PurchaseModule from '../../components/swag/PurchaseModule';
import { getSwagProduct, getSwagSkus } from '../../lib/content';
import { clamp } from '../../lib/descriptions';
import { getTrm, type Trm } from '../../lib/fx';
import { asLocale, type Locale } from '../../lib/i18n';
import { posterSrc } from '../../lib/images';
import { breadcrumbJsonLd } from '../../lib/jsonld';
import { SITE, absoluteUrl, localizedPath } from '../../lib/seo';
import { swagRoute, usdPrice } from '../../lib/swag';
import type { SwagProduct } from '../../types/content';

interface Props {
  product: SwagProduct;
  /** Null when datos.gov.co was unreachable at build. The page then shows USD only. */
  trm: Trm | null;
  locale: Locale;
}

/** The category, as the page says it. Anything the table adds later reads as itself. */
const CATEGORY: Record<string, { es: string; en: string }> = {
  Cap: { es: 'Gorra', en: 'Cap' },
  Mug: { es: 'Mug', en: 'Mug' },
  Hoodie: { es: 'Hoodie', en: 'Hoodie' },
  'T-shirt': { es: 'Camiseta', en: 'T-shirt' },
};

/**
 * One product, at its own URL.
 *
 * This is the page an ad lands on, so it has to stand alone: the photo, both
 * prices, the size picker and the two ways to pay, with nothing to scroll past
 * first. The grid links here; the purchase module is the same one the grid
 * card renders, so buying from either surface is the same flow.
 */
export default function SwagProductPage({ product, trm, locale }: Props) {
  const en = locale === 'en';
  // Spanish is required, English optional: an untranslated row reads as Spanish, never blank.
  const pick = (es: string, en_: string) => (en && en_.trim() ? en_ : es);

  const name = pick(product.name_es, product.name_en) || product.sku;
  const description = pick(product.description_es, product.description_en).trim();
  const category = CATEGORY[product.category]?.[locale] ?? product.category;
  const route = swagRoute(product.sku);
  const imagePath = product.image_path ? `/${product.image_path}` : null;
  const image = posterSrc(imagePath);
  const list = usdPrice(product);

  const fallbackDescription = en
    ? `${name}, official ETH Cali ${category.toLowerCase()}. By card or in USDC on Base, shipped from the store.`
    : `${name}, ${category.toLowerCase()} oficial de ETH Cali. Con tarjeta o en USDC en Base, con envío desde la tienda.`;
  const seoDescription = clamp(description || fallbackDescription);

  const productJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: product.sku,
    category,
    brand: { '@type': 'Brand', name: 'ETH Cali' },
    ...(imagePath ? { image: `${SITE}${imagePath}` } : {}),
    description: seoDescription,
    ...(list !== null
      ? {
          offers: {
            '@type': 'Offer',
            url: absoluteUrl(route, locale),
            priceCurrency: 'USD',
            price: list.toFixed(2),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <Layout>
      <Seo
        title={`${name} — ETH Cali`}
        description={seoDescription}
        path={route}
        image={imagePath}
        type="product"
        jsonLd={[
          productJsonLd,
          breadcrumbJsonLd(
            [
              { name: 'ETH Cali', route: '/' },
              { name: en ? 'Official swag' : 'Swag oficial', route: '/swag' },
              { name, route },
            ],
            locale
          ),
        ]}
      />

      <article className="mx-auto max-w-page px-gutter py-10">
        <Link
          href="/swag"
          className="mono text-xs text-content-muted transition-colors hover:text-content-primary"
        >
          ← {en ? 'All swag' : 'Todo el swag'}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
          {image ? (
            // `object-contain`: the photos come in three shapes and cropping
            // any of them to a fixed box cuts the artwork.
            <div className="relative aspect-square overflow-hidden rounded-card border border-line-hairline bg-surface-inset">
              <Image
                src={image}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 92vw"
                className="object-contain p-4"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-card border border-dashed border-line-hairline bg-surface-inset text-sm text-content-faint">
              ETH Cali
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">{category}</p>
              <h1 className="mt-2 text-3xl sm:text-4xl">{name}</h1>
              {description && (
                <p className="mt-4 max-w-prose whitespace-pre-line text-base leading-relaxed text-content-secondary">
                  {description}
                </p>
              )}
            </div>

            <Prices product={product} trm={trm} locale={locale} size="lg" />

            <PurchaseModule product={product} locale={locale} />

          </div>
        </div>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['es'] }) => {
  const skus = await getSwagSkus();
  return {
    // Every locale named explicitly, so /en/swag/<sku> is built and verified in
    // CI rather than left to the first visitor.
    paths: locales.flatMap((locale) => skus.map((sku) => ({ params: { sku: sku.toLowerCase() }, locale }))),
    // A product activated in the CMS after this build resolves on first request.
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params, locale }) => {
  const raw = String(params?.sku ?? '');
  const sku = raw.toUpperCase();

  // One URL per product, lowercase. The SKU itself stays uppercase on chain
  // and in Supabase; a link typed with capitals 308s to the canonical
  // spelling rather than serving a second copy of the page. Same locale.
  if (raw !== raw.toLowerCase()) {
    return {
      redirect: { destination: localizedPath(swagRoute(sku), asLocale(locale)), permanent: true },
      revalidate: 60,
    };
  }

  const [product, trm] = await Promise.all([getSwagProduct(sku), getTrm()]);
  // Inactive or unknown 404s. RLS already hides inactive rows from the anon key.
  if (!product) return { notFound: true, revalidate: 60 };

  return {
    props: { product, trm, locale: asLocale(locale) },
    revalidate: 60,
  };
};
