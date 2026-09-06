import type { GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import EventGrid from '../../components/events/EventGrid';
import { getEventsByKind } from '../../lib/content';
import type { EventRecord } from '../../types/content';
import { asLocale, translator, type Locale } from '../../lib/i18n';

interface Props {
  events: EventRecord[];
  locale: Locale;
}

/**
 * Every hackathon and hacker house in one place.
 *
 * There was no such page. The three hand-written hackathon pages were linked
 * only from a navbar dropdown, and the fourth hackathon (Hacksession Base Batch
 * LATAM) had no page at all.
 */
export default function HackathonsIndex({ events, locale }: Props) {
  const t = translator(locale);

  return (
    <Layout>
      <Seo title={t('hackathons.title')} description={t('hackathons.lead')} path="/hackathons" />

      <div className="mx-auto max-w-page px-gutter py-12">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
          {t('hackathons.title')}
        </p>
        <h1 className="mt-2 text-4xl">{t('hackathons.heading')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">{t('hackathons.lead')}</p>

        <div className="mt-10">
          {events.length ? (
            <EventGrid events={events} locale={locale} />
          ) : (
            <p className="text-sm text-content-muted">{t('hackathons.empty')}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const [hackathons, houses] = await Promise.all([
    getEventsByKind('hackathon'),
    getEventsByKind('hacker_house'),
  ]);

  return {
    props: {
      events: [...hackathons, ...houses].sort((a, b) => b.starts_on.localeCompare(a.starts_on)),
      locale: asLocale(locale),
    },
    revalidate: 60,
  };
};
