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


export default function LocalEvents({ events, locale }: Props) {
  const t = translator(locale);

  return (
    <Layout>
      <Seo
        title={t('events.local')}
        description={t('events.localLead')}
        path="/events/local"
      />

      <div className="mx-auto max-w-page px-gutter py-12">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
          {t('events.title')}
        </p>
        <h1 className="mt-2 text-4xl">{t('events.local')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">
          {t('events.localLead')}
        </p>

        <div className="mt-10">
          <EventGrid events={events} locale={locale} />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { events: await getEvents('local'), locale: asLocale(locale) },
  revalidate: 60,
});
