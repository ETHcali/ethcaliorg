import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { getVenues } from '../lib/content';
import type { VenueRecord } from '../types/content';
import { asLocale, translator, type Locale } from '../lib/i18n';

interface Props {
  venues: VenueRecord[];
  locale: Locale;
}

export default function Venues({ venues, locale }: Props) {
  const t = translator(locale);
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
        <h1 className="mt-2 text-4xl">{t('nav.venues')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">{lead}</p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <li
              key={v.id}
              className="rounded-card border border-line-hairline bg-surface-slab p-4"
            >
              <h2 className="text-base font-bold text-content-primary">{v.name}</h2>
              {v.kind && <p className="mt-1 text-xs text-content-muted">{v.kind}</p>}
              {v.maps_url && (
                <a
                  href={v.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-eth-blue-text hover:underline"
                >
                  {locale === 'en' ? 'Open in Maps' : 'Ver en Maps'}
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
