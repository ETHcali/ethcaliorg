import type { GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import EventGrid from '../../components/events/EventGrid';
import { getEvents } from '../../lib/content';
import type { EventRecord } from '../../types/content';
import { asLocale, translator, type Locale } from '../../lib/i18n';

interface Props {
  events: EventRecord[];
  locale: Locale;
}

/**
 * OUR international footprint — Devcon, ETHGlobal, the hacker houses run with
 * Ekinoxis. Not a world calendar.
 *
 * The page this replaces rendered databases/2025ethereumevents.csv, a public
 * list of every Ethereum event on earth in 2025, under the heading "dónde hemos
 * estado". It was honest about not being our events, but it meant our actual
 * international presence was shown nowhere, and by 2026 the list was a year stale.
 */
export default function InternationalEvents({ events, locale }: Props) {
  const t = translator(locale);

  return (
    <Layout>
      <Seo
        title={t('events.international')}
        description={t('events.internationalLead')}
        path="/events/international"
      />

      <div className="mx-auto max-w-page px-gutter py-12">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
          {t('events.title')}
        </p>
        <h1 className="mt-2 text-4xl">{t('events.international')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">
          {t('events.internationalLead')}
        </p>

        <div className="mt-10">
          <EventGrid events={events} locale={locale} />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { events: await getEvents('international'), locale: asLocale(locale) },
  revalidate: 60,
});
