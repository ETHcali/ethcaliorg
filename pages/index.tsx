import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import EventCard from '../components/events/EventCard';
import { getEvents } from '../lib/content';
import type { EventRecord } from '../types/content';
import { asLocale, translator, type Locale } from '../lib/i18n';

interface Props {
  recent: EventRecord[];
  totals: { events: number; hackathons: number; years: number };
  locale: Locale;
}

export default function Home({ recent, totals, locale }: Props) {
  const t = translator(locale);

  const stats = [
    { label: t('events.title'), value: totals.events },
    { label: t('hackathons.title'), value: totals.hackathons },
    { label: locale === 'en' ? 'Years' : 'Años', value: totals.years },
  ];

  return (
    <Layout>
      <Seo
        title="ETH Cali"
        description={t('events.lead')}
        path="/"
      />

      {/* The one time-boxed thing on the site. It sits above the fold until
          20 September because that is what the ad spend is pointing at. */}
      <section className="mx-auto max-w-page px-gutter pt-8">
        <Link
          href="/builders-tour"
          className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line-brand bg-eth-blue-wash px-5 py-4 transition-colors hover:border-eth-blue"
        >
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-signal-confirmed">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-confirmed" aria-hidden />
            {locale === 'en' ? 'Registration open' : 'Inscripciones abiertas'}
          </span>
          <span className="text-sm font-bold text-content-primary">
            Ethereum Builders Tour: Cali
          </span>
          <span className="mono text-xs text-content-muted">
            {locale === 'en' ? '19–20 September' : '19–20 de septiembre'}
          </span>
          <span className="ml-auto text-sm font-semibold text-eth-blue-text">→</span>
        </Link>
      </section>

      <section className="mx-auto max-w-page px-gutter pb-4 pt-10">
        <h1 className="max-w-3xl text-4xl sm:text-5xl">El Jardín Infinito</h1>
        <p className="mt-5 max-w-prose text-base text-content-secondary">{t('events.lead')}</p>

        <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-card border border-line-hairline bg-surface-slab p-4">
              <p className="mono text-2xl font-bold text-content-primary">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-page px-gutter py-12">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl">{t('events.heading')}</h2>
          <Link href="/events" className="text-sm text-eth-blue-text hover:underline">
            {t('events.all')} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const all = await getEvents();
  const years = new Set(all.map((e) => e.starts_on.slice(0, 4)));

  return {
    props: {
      recent: all.slice(0, 6),
      totals: {
        events: all.length,
        hackathons: all.filter((e) => e.kind === 'hackathon' || e.kind === 'hacker_house').length,
        years: years.size,
      },
      locale: asLocale(locale),
    },
    revalidate: 60,
  };
};
