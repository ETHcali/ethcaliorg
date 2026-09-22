import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { organizationJsonLd } from '../lib/jsonld';
import { Section } from '../components/layout/Page';
import Streams from '../components/media/Streams';
import { RESULTS, RESULTS_COPY, PROJECTS } from '../content/results';
import EventCard from '../components/events/EventCard';
import { getEvents, getPartners, getVenues } from '../lib/content';
import type { EventRecord, PartnerRecord } from '../types/content';
import { MISSION, CHAINS, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { APP } from '../lib/links';

interface Props {
  upcoming: EventRecord[];
  past: EventRecord[];
  partners: PartnerRecord[];
  totals: { events: number; hackathons: number; years: number; venues: number };
  locale: Locale;
}

/**
 * Marks that are drawn for a white ground and disappear on ours.
 *
 * Devcon's is deep blue and the Gobernación's is dark type inside a crest —
 * against `--surface-slab` the first is a smudge and the second is unreadable,
 * which it already was on the live site. Recolouring either would misrepresent
 * it: Devcon's blue IS the brand, and a government crest is not ours to alter.
 * So they get `--surface-paper` behind them, the same answer the Builders Tour
 * sponsor wall reached for Icesi and Devcon.
 *
 * Keyed by logo path rather than by name, because the path is what decides
 * whether the artwork needs a plate. `partners` has no column for this and the
 * schema is the wallet app's to change.
 */
const NEEDS_PLATE = new Set([
  '/tour/devcon-viii.webp',
  '/gov/gov_valle.png',
  '/gov/SEDEC.png',
  '/universities/universidad_icesi.png',
]);

/** A row of partner or chain logos. Greyscale until hover, so no single sponsor shouts. */
function LogoRow({
  items,
}: {
  items: readonly { name: string; logo: string | null; url?: string | null }[];
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const plate = item.logo ? NEEDS_PLATE.has(item.logo) : false;
        const inner = (
          <>
            <div
              className={`relative flex h-12 w-full items-center justify-center ${
                plate ? 'rounded-chip bg-surface-paper px-3' : ''
              }`}
            >
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={120}
                  height={48}
                  sizes="120px"
                  // Both dimensions auto, not just width: next/image warns on
                  // every one of these logos otherwise, because constraining one
                  // axis in CSS and leaving the other fixed distorts the mark.
                  className={`h-auto w-auto object-contain transition-opacity ${
                    plate ? 'max-h-10' : 'max-h-12 opacity-80 group-hover:opacity-100'
                  }`}
                />
              ) : (
                <span className="text-sm font-bold text-content-secondary">{item.name}</span>
              )}
            </div>
            {/* The caption, but only when there is artwork above it to caption.
                A partner with no logo already renders its name as a wordmark,
                and printing it again underneath said "Cámara de Comercio de
                Cali / Cámara de Comercio de Cali".

                `content-secondary`, not `content-faint`. Faint on a slab is
                3.26:1 and this is small type — below the 18.66px bold that
                would let it off with 3:1 — so every name under every logo on
                this page failed AA. Secondary is 12.09:1. */}
            {item.logo && (
              <span className="mt-2 block text-center text-xs leading-tight text-content-secondary">
                {item.name}
              </span>
            )}
          </>
        );

        return (
          <li key={item.name}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-card border border-line-hairline bg-surface-slab p-4 transition-colors hover:border-line-brand"
              >
                {inner}
              </a>
            ) : (
              <div className="group flex flex-col rounded-card border border-line-hairline bg-surface-slab p-4">
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Home({ upcoming, past, partners, totals, locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  const by = (kind: string) => partners.filter((p) => p.kind === kind);

  const stats = [
    { label: en ? 'Events' : 'Eventos', value: totals.events },
    { label: 'Hackathons', value: totals.hackathons },
    { label: en ? 'Venues' : 'Lugares', value: totals.venues },
    { label: en ? 'Years' : 'Años', value: totals.years },
  ];

  return (
    <Layout>
      <Seo
        title="ETH Cali"
        description={
          en
            ? 'The Ethereum community of Cali, Colombia. Meetups, workshops, hackathons and the builders behind them.'
            : 'La comunidad Ethereum de Cali, Colombia. Meetups, workshops, hackathons y la gente que los construye.'
        }
        path="/"
        jsonLd={organizationJsonLd(locale)}
      />

      {/* The banner read "Inscripciones abiertas" under a signal-confirmed dot
          for a weekend that ended on 20 September, which is the site telling a
          first-time visitor to go and register for something that is over. The
          slot still earns its place above the fold — it is the most recent thing
          we did — so it now points at the result instead. */}
      <section className="mx-auto max-w-page px-gutter pt-8">
        <Link
          href={RESULTS.path}
          className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line-brand bg-eth-blue-wash px-5 py-4 transition-colors hover:border-eth-blue"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-eth-blue-text">
            {en ? 'Results' : 'Resultados'}
          </span>
          <span className="text-sm font-bold text-content-primary">
            {RESULTS_COPY.title[locale]} · {RESULTS.hackathon}
          </span>
          <span className="mono text-xs text-content-muted">
            {en
              ? `${RESULTS.hackers}+ hackers · ${PROJECTS.length} projects`
              : `+${RESULTS.hackers} hackers · ${PROJECTS.length} proyectos`}
          </span>
          <span className="ml-auto text-sm font-semibold text-eth-blue-text">→</span>
        </Link>
      </section>

      <section className="mx-auto max-w-page px-gutter pb-4 pt-9 sm:pt-12">
        <h1 className="max-w-3xl text-3xl sm:text-5xl">El Jardín Infinito</h1>
        <p className="mt-5 max-w-prose text-lg text-content-secondary">
          {en
            ? 'The Ethereum community of Cali, Colombia. We run meetups, workshops and hackathons, and we lend the hardware so other people can run theirs.'
            : 'La comunidad Ethereum de Cali, Colombia. Organizamos meetups, workshops y hackathons, y prestamos los equipos para que otros organicen los suyos.'}
        </p>

        <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
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

      {/* Upcoming first, and only when there is something. "Recent events"
          showing a year-old meetup is accurate and useless; an empty upcoming
          section would be worse, so it simply is not rendered. */}
      {upcoming.length > 0 && (
        <Section title={en ? 'Coming up' : 'Próximos eventos'}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      <Section title={en ? 'What we have run' : 'Lo que hemos hecho'}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {past.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))}
        </div>
        <Link
          href="/events/local"
          className="mt-6 inline-block text-sm text-eth-blue-text hover:underline"
        >
          {en ? 'All events' : 'Todos los eventos'} →
        </Link>
      </Section>

      {/* The most recent thing we ran, as a thing you can watch rather than a
          thing you can read about. It sits after the events because that is what
          it is a recording of, and below the fold because it is a third-party
          frame — see the note in components/media/Streams.tsx. */}
      <Section
        eyebrow={RESULTS.hackathon}
        title={RESULTS_COPY.streamTitle[locale]}
        lead={RESULTS_COPY.streamLead[locale]}
      >
        <Streams locale={locale} />
        <Link
          href={RESULTS.path}
          className="mt-6 inline-block text-sm text-eth-blue-text hover:underline"
        >
          {RESULTS_COPY.title[locale]} →
        </Link>
      </Section>

      {by('host').length > 0 && (
        <Section
          eyebrow={en ? 'Ecosystem' : 'Ecosistema'}
          title={en ? 'Who we run things with' : 'Con quienes organizamos'}
        >
          <LogoRow items={by('host').map((p) => ({ name: p.name, logo: p.logo_path, url: p.url }))} />
        </Section>
      )}

      <Section
        eyebrow={en ? 'Where we build' : 'Dónde construimos'}
        title={en ? 'Chains we deploy to' : 'Cadenas donde desplegamos'}
      >
        <LogoRow items={CHAINS.map((c) => ({ name: c.name, logo: c.logo }))} />
      </Section>

      {by('university').length > 0 && (
        <Section
          eyebrow={en ? 'Education' : 'Educación'}
          title={en ? 'Partner universities' : 'Universidades'}
        >
          <LogoRow
            items={by('university').map((p) => ({ name: p.name, logo: p.logo_path, url: p.url }))}
          />
        </Section>
      )}

      {/* `supporter` is the government and institutional row now: the
          Gobernación, the Cámara de Comercio and the Alcaldía. It used to also
          carry Uniswap Labs and ETHGlobal, which are in the organisers row
          above with the same logo files — the two marks rendered twice on this
          page under two different headings. Those rows are unpublished. */}
      {by('supporter').length > 0 && (
        <Section title={en ? 'Government and institutions' : 'Organizaciones gubernamentales'}>
          <LogoRow
            items={by('supporter').map((p) => ({ name: p.name, logo: p.logo_path, url: p.url }))}
          />
        </Section>
      )}

      <Section title={en ? 'Get involved' : 'Participa'}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: '/events',
              title: en ? 'Come to an event' : 'Ven a un evento',
              detail: en
                ? 'Meetups, workshops and hackathons in Cali and the region.'
                : 'Meetups, workshops y hackathons en Cali y la región.',
              external: false,
            },
            {
              href: APP.donations,
              title: en ? 'Support us' : 'Apóyanos',
              detail: en
                ? 'Donate on chain. Every peso is verifiable.'
                : 'Dona en cadena. Cada peso es verificable.',
              external: true,
            },
            {
              href: '/technical-infra',
              title: en ? 'Borrow our hardware' : 'Pide prestados los equipos',
              detail: en
                ? 'Free, and you do not have to be part of ETH Cali.'
                : 'Gratis, y no hace falta ser de ETH Cali.',
              external: false,
            },
          ].map((c) =>
            c.external ? (
              <a
                key={c.href}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-card border border-line-hairline bg-surface-slab p-5 transition-colors hover:border-line-brand"
              >
                <h3 className="text-base font-bold text-content-primary">{c.title}</h3>
                <p className="mt-2 text-sm text-content-muted">{c.detail}</p>
              </a>
            ) : (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-card border border-line-hairline bg-surface-slab p-5 transition-colors hover:border-line-brand"
              >
                <h3 className="text-base font-bold text-content-primary">{c.title}</h3>
                <p className="mt-2 text-sm text-content-muted">{c.detail}</p>
              </Link>
            )
          )}
        </div>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const [all, partners, venues] = await Promise.all([getEvents(), getPartners(), getVenues()]);
  const years = new Set(all.map((e) => e.starts_on.slice(0, 4)));

  // Compared as YYYY-MM-DD strings, which sorts correctly and avoids the
  // timezone slip that parsing a bare date into a Date would reintroduce.
  // An event counts as upcoming through its last day, not its first.
  const today = new Date().toISOString().slice(0, 10);
  const isUpcoming = (e: EventRecord) => (e.ends_on ?? e.starts_on) >= today;

  return {
    props: {
      upcoming: all.filter(isUpcoming).sort((a, b) => a.starts_on.localeCompare(b.starts_on)),
      past: all.filter((e) => !isUpcoming(e)).slice(0, 6),
      partners,
      totals: {
        events: all.length,
        hackathons: all.filter((e) => e.kind === 'hackathon' || e.kind === 'hacker_house').length,
        years: years.size,
        venues: venues.length,
      },
      locale: asLocale(locale),
    },
    revalidate: 60,
  };
};
