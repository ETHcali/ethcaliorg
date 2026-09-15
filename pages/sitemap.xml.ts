import type { GetServerSideProps } from 'next';
import { getSitemapEvents } from '../lib/content';
import { LOCALES, DEFAULT_LOCALE, STATIC_ROUTES, absoluteUrl } from '../lib/seo';

/**
 * /sitemap.xml
 *
 * The site publishes 128 prerendered pages across two locales and, until now,
 * told a crawler about none of them: there was no sitemap and no robots.txt, so
 * every event page depended on being reachable by link-following alone.
 *
 * Served per request rather than prerendered. Events are edited in the wallet
 * app and picked up here by ISR within a minute, so a sitemap frozen at build
 * time would list yesterday's events until the next deploy. The edge cache below
 * keeps that from becoming a query per crawl.
 *
 * Each locale gets its own <url> carrying the full set of `xhtml:link`
 * alternates, including x-default. That is the shape Google documents for a
 * multilingual sitemap, and it is the same mapping `Seo` renders into the page
 * head — both read `absoluteUrl`, so the two cannot disagree.
 */

/** Hackathons and hacker houses have a richer page, at a different route. */
const HACKATHON_KINDS = new Set(['hackathon', 'hacker_house']);

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Entry {
  route: string;
  priority: number;
  lastmod?: string;
}

function renderUrl({ route, priority, lastmod }: Entry, locale: string): string {
  const alternates = [
    ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(absoluteUrl(route, l))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(route, DEFAULT_LOCALE))}"/>`,
  ].join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(route, locale))}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>` : null,
    `    <priority>${priority.toFixed(1)}</priority>`,
    alternates,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // A failed fetch must not serve a sitemap that silently omits every event —
  // that would actively tell a crawler those URLs are gone. Better to 503 and
  // let it retry with the previous sitemap still in its index.
  const events = await getSitemapEvents();

  const entries: Entry[] = [
    ...STATIC_ROUTES.map(({ route, priority }) => ({ route, priority })),
    ...events.map((e) => ({
      route: `${HACKATHON_KINDS.has(e.kind) ? '/hackathons' : '/events'}/${e.slug}`,
      priority: 0.6,
      lastmod: e.updated_at,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.flatMap((entry) => LOCALES.map((locale) => renderUrl(entry, locale))),
    '</urlset>',
  ].join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Crawlers re-fetch this far more often than the content changes.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(body);
  res.end();

  return { props: {} };
};

/** Never rendered: getServerSideProps ends the response itself. */
export default function Sitemap() {
  return null;
}
