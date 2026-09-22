/**
 * One spelling of every public URL.
 *
 * `Seo` and `sitemap.xml` both have to answer "what is the absolute URL of this
 * page in this locale", and they have to answer it identically — a canonical
 * that disagrees with the sitemap is worse than having neither, because it tells
 * a crawler the two are different pages. So the rule lives here and both read it.
 */

/**
 * The origin, with the `www` — and that is not cosmetic.
 *
 * `ethcali.org` 307s to `www.ethcali.org`; only the `www` host returns 200. Every
 * canonical, hreflang and og:url on the site used to name the apex, which meant
 * they all pointed at a redirect. A canonical must be the URL that actually
 * serves the page, so it is this one. If the primary domain is ever switched to
 * the apex in Vercel, change it here and nowhere else.
 */
export const SITE = 'https://www.ethcali.org';

export const BRAND = 'ETH Cali';

/** The locales `next.config.js` publishes, and the one that carries no prefix. */
export const LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE = 'es';

export type SeoLocale = (typeof LOCALES)[number];

/**
 * A route in a locale, as a path.
 *
 * Spanish is the default and carries no prefix — `/events/local` is the Spanish
 * page and `/en/events/local` the English one, because that is what the old site
 * published. The home route is the one special case: `/` must not become `//`,
 * and `/en/` must not keep its trailing slash.
 */
export function localizedPath(route: string, locale: string): string {
  const base = route === '/' ? '' : route;
  return locale === DEFAULT_LOCALE ? base || '/' : `/${locale}${base}`;
}

/** The same thing, absolute. This is what goes in a canonical or a sitemap. */
export function absoluteUrl(route: string, locale: string): string {
  const path = localizedPath(route, locale);
  return `${SITE}${path === '/' ? '' : path}`;
}

/**
 * Every route that is not generated from the CMS.
 *
 * The sitemap reads this; the nav does not. They stay separate on purpose. Every
 * route here is now reachable from the nav, but the two lists answer different
 * questions — this one is "what is indexable", the nav is "what is worth a menu
 * entry", and a sitemap derived from a menu would drop a page the moment someone
 * tidied the bar.
 *
 * `changefreq` is omitted throughout: Google has said for years that it ignores
 * it, and a field nobody reads is a field that goes stale without anyone
 * noticing. `priority` is kept because it is at least internally consistent.
 */
export const STATIC_ROUTES: readonly { route: string; priority: number }[] = [
  { route: '/', priority: 1.0 },
  { route: '/builders-tour', priority: 0.9 },
  { route: '/builders-tour/frontier-cities-quest', priority: 0.9 },
  { route: '/builders-tour/winners', priority: 0.8 },
  { route: '/events/local', priority: 0.8 },
  { route: '/events/international', priority: 0.7 },
  { route: '/hackathons', priority: 0.8 },
  { route: '/hacker-houses', priority: 0.6 },
  { route: '/venues', priority: 0.6 },
  { route: '/about', priority: 0.7 },
  { route: '/team', priority: 0.6 },
  { route: '/dao', priority: 0.6 },
  { route: '/education', priority: 0.6 },
  { route: '/swag', priority: 0.5 },
  { route: '/technical-infra', priority: 0.5 },
  { route: '/brand-guidelines', priority: 0.4 },
];

/** Where ETH Cali actually posts. Feeds `sameAs` on the Organization record. */
export const SAME_AS = [
  'https://x.com/ethcali_org',
  'https://www.instagram.com/ethcali.eth/',
  'https://www.linkedin.com/company/eth-cali/',
  'https://t.me/ethcali',
  'https://discord.gg/269Qpf3rb2',
  'https://github.com/ETHcali',
] as const;

/**
 * The point at which appending the brand costs more than it adds.
 *
 * " | ETH Cali" is 11 characters. Google renders roughly 60 before it truncates,
 * and 14 event pages were losing the end of their own name to a suffix that says
 * the same thing on every page of the site. Past this length the title stands on
 * its own.
 */
export const BRAND_SUFFIX_LIMIT = 52;

export function pageTitle(title: string): string {
  if (title === BRAND) return title;
  return title.length > BRAND_SUFFIX_LIMIT ? title : `${title} | ${BRAND}`;
}
