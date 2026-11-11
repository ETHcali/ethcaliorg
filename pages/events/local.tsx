import type { GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import EventGrid from '../../components/events/EventGrid';
import LumaCalendar from '../../components/events/LumaCalendar';
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
        <h1 className="mt-2 text-3xl sm:text-4xl">{t('events.local')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">
          {t('events.localLead')}
        </p>

        <section aria-labelledby="upcoming-heading" className="mt-10">
          <h2 id="upcoming-heading" className="text-xl sm:text-2xl">
            {t('events.upcoming')}
          </h2>
          <p className="mt-2 max-w-prose text-sm text-content-secondary">
            {t('events.upcomingLead')}
          </p>
          <div className="mt-5">
            <LumaCalendar title={t('events.upcoming')} openLabel={t('events.openLuma')} />
          </div>
        </section>

        <section aria-labelledby="past-heading" className="mt-12">
          <h2 id="past-heading" className="text-xl sm:text-2xl">
            {t('events.past')}
          </h2>
          <div className="mt-6">
            <EventGrid events={events} locale={locale} headingLevel={3} />
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { events: await getEvents('local'), locale: asLocale(locale) },
  revalidate: 60,
});
