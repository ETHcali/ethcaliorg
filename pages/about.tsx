import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { getEvents, getVenues, getPartners, getTeam } from '../lib/content';
import { ABOUT, MISSION, IMPACT, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';

interface Counts {
  events: number;
  meetups: number;
  workshops: number;
  hackathons: number;
  hosted: number;
  venues: number;
  universities: number;
  years: number;
  team: number;
}

interface Props {
  counts: Counts;
  locale: Locale;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-card border border-line-hairline bg-surface-slab p-4">
      <p className="mono text-2xl font-bold text-content-primary">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {label}
      </p>
    </div>
  );
}

/**
 * What ETH Cali is.
 *
 * This route was the team page — "Nosotros" opening on twenty portraits, never
 * saying what the organisation had built. The people are at /team now and this
 * page finally does the job its URL promised.
 *
 * Every figure is counted in getStaticProps from the rows the CMS already holds,
 * so the page cannot claim 47 events on the day there are 48.
 */
export default function About({ counts, locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';
  const L = ABOUT.labels;

  return (
    <Layout>
      <Seo title={t(ABOUT.title)} description={t(ABOUT.lead)} path="/about" />

      <PageHeader eyebrow={t(ABOUT.eyebrow)} title={t(ABOUT.title)} lead={t(ABOUT.lead)} />

      <Section title={t(ABOUT.origin.title)}>
        <div className="max-w-prose whitespace-pre-line text-base leading-relaxed text-content-secondary">
          {t(ABOUT.origin.body)}
        </div>
      </Section>

      <Section title={t(ABOUT.numbers.title)} lead={t(ABOUT.numbers.lead)}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={String(counts.events)} label={t(L.events)} />
          <Stat value={String(counts.hosted)} label={t(L.hosted)} />
          <Stat value={String(counts.meetups)} label={t(L.meetups)} />
          <Stat value={String(counts.workshops)} label={t(L.workshops)} />
          <Stat value={String(counts.hackathons)} label={t(L.hackathons)} />
          <Stat value={String(counts.venues)} label={t(L.venues)} />
          <Stat value={String(counts.universities)} label={t(L.universities)} />
          <Stat value={String(counts.years)} label={t(L.years)} />
        </div>

        {/* The onchain half, which the events table cannot count. Same figures
            and the same caveat as the home page — stated once here rather than
            re-derived, so the two pages cannot disagree. */}
        <div className="mt-6 rounded-card border border-line-hairline bg-surface-slab p-5">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {IMPACT.metrics.map((m) => (
              <div key={m.value}>
                <p className="mono text-xl font-bold text-content-primary">{m.value}</p>
                <p className="mt-1 text-xs text-content-secondary">{m.label[locale]}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-prose text-xs leading-relaxed text-content-muted">
            {t(IMPACT.note)}
          </p>
          <a
            href={IMPACT.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-eth-blue-text hover:underline"
          >
            {t(IMPACT.cta)} →
          </a>
        </div>
      </Section>

      <Section title={t(ABOUT.doing.title)} lead={t(ABOUT.doing.lead)}>
        <div className="grid gap-4 sm:grid-cols-2">
          {ABOUT.doing.items.map((item) => (
            <div
              key={item.href}
              className="flex flex-col rounded-card border border-line-hairline bg-surface-slab p-5"
            >
              <h3 className="text-base font-bold text-content-primary">{t(item.title)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{t(item.body)}</p>
              <Link
                href={item.href}
                className="mt-4 text-sm font-semibold text-eth-blue-text hover:underline"
              >
                {t(item.cta)} →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={en ? 'What drives us' : 'Qué nos mueve'}
        title={en ? 'Our mission' : 'Nuestra misión'}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MISSION.map((m) => (
            <div key={m.title.es} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <h3 className="text-base font-bold text-content-primary">{t(m.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(m.detail)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t(ABOUT.team.title)}>
        <p className="max-w-prose text-base leading-relaxed text-content-secondary">
          {t(ABOUT.team.body)}
        </p>
        <Link
          href="/team"
          className="mt-6 inline-flex min-h-tap items-center rounded-control border border-line-strong px-5 text-sm font-semibold text-content-primary transition-colors hover:border-eth-blue hover:bg-eth-blue-wash"
        >
          {t(ABOUT.team.cta)} · {counts.team} →
        </Link>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const [events, venues, partners, team] = await Promise.all([
    getEvents(),
    getVenues(),
    getPartners(),
    getTeam(),
  ]);

  const kind = (k: string) => events.filter((e) => e.kind === k).length;
  const years = new Set(events.map((e) => e.starts_on.slice(0, 4)));

  return {
    props: {
      counts: {
        events: events.length,
        meetups: kind('meetup'),
        workshops: kind('workshop'),
        hackathons: kind('hackathon'),
        // `host` and `cohost` are both "we made this happen"; `colab` and
        // `participant` are not, and counting them here would turn showing up
        // into organising.
        hosted: events.filter((e) => e.role === 'host' || e.role === 'cohost').length,
        venues: venues.length,
        universities: partners.filter((p) => p.kind === 'university').length,
        years: years.size,
        team: team.length,
      },
      locale: asLocale(locale),
    },
    revalidate: 60,
  };
};
