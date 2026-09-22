import Head from 'next/head';
import { useRouter } from 'next/router';
import { SITE, BRAND, LOCALES, DEFAULT_LOCALE, absoluteUrl, pageTitle } from '../../lib/seo';
import { clamp } from '../../lib/descriptions';

const FALLBACK_IMAGE = '/branding/Banner1200x400.png';

/** The fallback banner's real pixels. Sharing platforms lay out the card before
 *  the image lands, and without these the card reflows once it does. */
const FALLBACK_DIMENSIONS = { width: 1200, height: 400 };

interface Props {
  title: string;
  description: string;
  /** Absolute path, e.g. `/events/hackathon-web3-cali`. Falls back to the current route. */
  path?: string;
  /** Site-relative path to the share image. An event passes its own poster. */
  image?: string | null;
  /** The share image's real pixels, when the caller knows them. Platforms lay
   *  out the card before the image lands; without these it reflows after. */
  imageSize?: { width: number; height: number };
  /** `article` for a single event, `website` for a listing. */
  type?: 'website' | 'article';
  /** JSON-LD for this page. Rendered as-is into a ld+json script. */
  jsonLd?: Record<string, unknown> | readonly Record<string, unknown>[];
}

/**
 * Per-page metadata.
 *
 * The old site gave every page the same banner, so an event shared to X or
 * WhatsApp showed the ETH Cali logo rather than that event's poster. Passing
 * `image` per event is the whole reason event pages exist as URLs.
 */
export default function Seo({
  title,
  description,
  path,
  image,
  imageSize,
  type = 'website',
  jsonLd,
}: Props) {
  const router = useRouter();
  const locale = router.locale ?? DEFAULT_LOCALE;
  const route = path ?? router.asPath.split('?')[0].split('#')[0];

  const url = absoluteUrl(route, locale);
  const share = `${SITE}${image || FALLBACK_IMAGE}`;

  // Two things this rule fixes: "ETH Cali | ETH Cali" on the home page, whose
  // title is already the brand, and 14 event pages whose own names were being
  // truncated in results to make room for a suffix identical on every page.
  const full = pageTitle(title);

  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  // Every page below the root gets a breadcrumb, not just the ones that pass a
  // hand-built trail. 22 pages had no structured data at all, and for a one-level
  // page the trail is fully derivable — root, then this page. A page that already
  // supplies its own (an event, three levels deep) keeps it.
  const hasCrumbs = blocks.some((b) => b['@type'] === 'BreadcrumbList');
  const autoCrumbs =
    route === '/' || hasCrumbs
      ? null
      : {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: BRAND, item: absoluteUrl('/', locale) },
            { '@type': 'ListItem', position: 2, name: title, item: url },
          ],
        };

  const allBlocks = autoCrumbs ? [...blocks, autoCrumbs] : blocks;

  return (
    <Head>
      <title>{full}</title>
      {/* Clamped here rather than at 20 call sites: a description longer than
          a result page renders is silently truncated mid-word. */}
      <meta name="description" content={clamp(description)} />
      <link rel="canonical" href={url} />

      {/* Tell search engines the two locales are the same page, or they read
          them as duplicate content and pick one arbitrarily. */}
      {LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={absoluteUrl(route, l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl(route, DEFAULT_LOCALE)} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={clamp(description)} />
      <meta property="og:image" content={share} />
      <meta property="og:image:alt" content={title} />
      {/* Dimensions only when they are known: the fallback's, or the ones the
          caller passed. An event poster from the database is a different
          shape per row and ships without them rather than with numbers that
          would be wrong. */}
      {(() => {
        const size = image ? imageSize : FALLBACK_DIMENSIONS;
        return size ? (
          <>
            <meta property="og:image:width" content={String(size.width)} />
            <meta property="og:image:height" content={String(size.height)} />
          </>
        ) : null;
      })()}
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'es_CO'} />
      <meta property="og:locale:alternate" content={locale === 'en' ? 'es_CO' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ethcali_org" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={clamp(description)} />
      <meta name="twitter:image" content={share} />

      {allBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // The content is ours, built from typed records rather than user
          // input. `<` is still escaped so a stray sequence in a CMS string
          // cannot close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </Head>
  );
}
