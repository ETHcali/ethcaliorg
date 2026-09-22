import type { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { getVenues } from '../lib/content';
import type { VenueRecord } from '../types/content';
import { asLocale, translator, type Locale } from '../lib/i18n';
import { httpUrl } from '../lib/url';

/**
 * Client-only. Leaflet reaches for `window` the moment it is imported, so there
 * is nothing for it to do during a static render — and the venues page is
 * prerendered for both locales at build time.
 */
const VenueMap = dynamic(() => import('../components/venues/VenueMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-card border border-line-hairline bg-surface-inset" />
  ),
});

interface Props {
  venues: VenueRecord[];
  locale: Locale;
}

export default function Venues({ venues, locale }: Props) {
  const t = translator(locale);
  const mapped = venues.filter((v) => v.lat != null && v.lng != null);
  const unmapped = venues.filter((v) => v.lat == null || v.lng == null);
  const lead =
    locale === 'en'
      ? 'The places that have hosted us in Cali and the region.'
      : 'Los lugares que nos han acogido en Cali y la región.';

  return (
    <Layout>
      <Seo title={t('nav.venues')} description={lead} path="/venues" />

      <div className="mx-auto max-w-page px-gutter py-12">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
          {t('nav.venues')}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{t('nav.venues')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">{lead}</p>

        {/* The map the static site had and the rebuild lost, which left
            `venues.lat` and `venues.lng` as columns nothing read.

            It is now the whole page: the grid of cards that used to sit under it
            said the same thing in a less useful shape. */}
        {mapped.length > 0 && (
          <div className="mt-10">
            <VenueMap venues={mapped} locale={locale} />
            {/* Said out loud rather than quietly dropping them: a venue with no
                coordinates is a row to finish, not a venue that does not exist. */}
            {unmapped.length > 0 && (
              <p className="mt-3 text-xs text-content-muted">
                {locale === 'en'
                  ? `${mapped.length} of ${venues.length} on the map. Still to be placed: `
                  : `${mapped.length} de ${venues.length} en el mapa. Faltan por ubicar: `}
                {unmapped.map((v) => v.name).join(' · ')}
              </p>
            )}
          </div>
        )}

        {/* The same venues, for readers the map cannot serve.
            A Leaflet map is a canvas of tiles and an SVG of circles: a screen
            reader gets nothing from it, and neither does a crawler. Dropping the
            card grid without this would have left /venues with a heading, a
            sentence and no content — nineteen places we have been, invisible to
            search and unreachable without a mouse.

            `sr-only` is Tailwind's clip-rect, not `display: none`. The list is
            in the accessibility tree and in the HTML; it simply takes no space. */}
        <ul className="sr-only">
          {venues.map((v) => (
            <li key={v.id}>
              <h2>{v.name}</h2>
              {v.kind && <p>{v.kind}</p>}
              {httpUrl(v.maps_url) && (
                <a href={httpUrl(v.maps_url) as string} target="_blank" rel="noopener noreferrer">
                  {locale === 'en' ? `Open ${v.name} in Maps` : `Ver ${v.name} en Maps`}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { venues: await getVenues(), locale: asLocale(locale) },
  revalidate: 60,
});
