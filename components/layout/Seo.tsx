import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE = 'https://ethcali.org';
const FALLBACK_IMAGE = '/branding/Banner1200x400.png';

interface Props {
  title: string;
  description: string;
  /** Absolute path, e.g. `/events/hackathon-web3-cali`. Falls back to the current route. */
  path?: string;
  /** Site-relative path to the share image. An event passes its own poster. */
  image?: string | null;
  /** `article` for a single event, `website` for a listing. */
  type?: 'website' | 'article';
}

/**
 * Per-page metadata.
 *
 * The old site gave every page the same banner, so an event shared to X or
 * WhatsApp showed the ETH Cali logo rather than that event's poster. Passing
 * `image` per event is the whole reason event pages exist as URLs.
 */
export default function Seo({ title, description, path, image, type = 'website' }: Props) {
  const router = useRouter();
  const locale = router.locale ?? 'es';
  const route = path ?? router.asPath.split('?')[0];

  // Spanish is the default locale and carries no prefix, matching the URLs the
  // old site published.
  const localized = locale === 'es' ? route : `/${locale}${route}`;
  const url = `${SITE}${localized === '/' ? '' : localized}`;
  const share = `${SITE}${image || FALLBACK_IMAGE}`;
  const full = `${title} | ETH Cali`;

  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Tell search engines the two locales are the same page, or they read
          them as duplicate content and pick one arbitrarily. */}
      <link rel="alternate" hrefLang="es" href={`${SITE}${route === '/' ? '' : route}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE}/en${route === '/' ? '' : route}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE}${route === '/' ? '' : route}`} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={share} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'es_CO'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={share} />
    </Head>
  );
}
