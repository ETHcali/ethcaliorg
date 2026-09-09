import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import EventGrid from '../components/events/EventGrid';
import { getEventsByKind } from '../lib/content';
import type { EventRecord } from '../types/content';
import { asLocale, type Locale } from '../lib/i18n';

interface Props {
  houses: EventRecord[];
  locale: Locale;
}

/**
 * Hacker houses, run with ekinoxis.xyz.
 *
 * These are seeded as unpublished drafts: the source only gives a month, never a
 * day, a city, or ETH Cali's role as distinct from Ekinoxis's. RLS hides drafts
 * from the anon key, so this page renders empty until someone who was there
 * fills the rows in — which is the right failure mode. An empty page invites a
 * correction; a page full of invented dates does not.
 */
export default function HackerHouses({ houses, locale }: Props) {
  const en = locale === 'en';

  const lead = en
    ? 'Free spaces for developers to build and take part in international hackathons, run with Ekinoxis Labs.'
    : 'Espacios libres para que desarrolladores construyan y participen en hackathons internacionales, junto a Ekinoxis Labs.';

  return (
    <Layout>
      <Seo title={en ? 'Hacker houses' : 'Hacker houses'} description={lead} path="/hacker-houses" />

      <PageHeader
        eyebrow={en ? 'Hacker houses' : 'Hacker houses'}
        title={en ? 'Where we host builders' : 'Donde alojamos builders'}
        lead={lead}
      />

      <Section>
        {houses.length ? (
          <EventGrid events={houses} locale={locale} />
        ) : (
          <div className="rounded-card border border-line-hairline bg-surface-slab p-6">
            <p className="text-sm text-content-secondary">
              {en
                ? 'Nothing published here yet. The hacker houses we have taken part in are recorded as drafts, waiting on exact dates and cities before they go public.'
                : 'Todavía no hay nada publicado. Las hacker houses en las que hemos participado están guardadas como borradores, a la espera de fechas y ciudades exactas antes de publicarse.'}
            </p>
            <a
              href="https://www.ekinoxis.xyz/hacker-house"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-eth-blue-text hover:underline"
            >
              ekinoxis.xyz/hacker-house →
            </a>
          </div>
        )}
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { houses: await getEventsByKind('hacker_house'), locale: asLocale(locale) },
  revalidate: 60,
});
