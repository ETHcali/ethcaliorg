import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { Section } from '../components/layout/Page';
import EventCard from '../components/events/EventCard';
import { getEvents, getPartners, getVenues } from '../lib/content';
import type { EventRecord, PartnerRecord } from '../types/content';
import { MISSION, CHAINS, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { APP } from '../lib/links';

interface Props {
  recent: EventRecord[];
  partners: PartnerRecord[];
  totals: { events: number; hackathons: number; years: number; venues: number };
  locale: Locale;
}

/** A row of partner or chain logos. Greyscale until hover, so no single sponsor shouts. */
function LogoRow({
  items,
}: {
  items: readonly { name: string; logo: string | null; url?: string | null }[];
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const inner = (
          <>
            <div className="relative flex h-12 w-full items-center justify-center">
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={120}
                  height={48}
                  sizes="120px"
                  className="max-h-12 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100"
                />
              ) : (
                <span className="text-sm font-bold text-content-secondary">{item.name}</span>
              )}
            </div>
            <span className="mt-2 block text-center text-[11px] leading-tight text-content-faint">
              {item.name}
            </span>
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

export default function Home({ recent, partners, totals, locale }: Props) {
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
      />

      {/* The one time-boxed thing on the site, above the fold until 20 September
          because that is what the ad spend points at. */}
      <section className="mx-auto max-w-page px-gutter pt-8">
        <Link
          href="/builders-tour"
          className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line-brand bg-eth-blue-wash px-5 py-4 transition-colors hover:border-eth-blue"
        >
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-signal-confirmed">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-confirmed" aria-hidden />
            {en ? 'Registration open' : 'Inscripciones abiertas'}
          </span>
          <span className="text-sm font-bold text-content-primary">
            Ethereum Builders Tour: Cali
          </span>
          <span className="mono text-xs text-content-muted">
            {en ? '19–20 September' : '19–20 de septiembre'}
          </span>
          <span className="ml-auto text-sm font-semibold text-eth-blue-text">→</span>
        </Link>
      </section>

      <section className="mx-auto max-w-page px-gutter pb-4 pt-12">
        <h1 className="max-w-3xl text-4xl sm:text-5xl">El Jardín Infinito</h1>
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

      <Section title={en ? 'Recent events' : 'Eventos recientes'}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))}
        </div>
        <Link href="/events" className="mt-6 inline-block text-sm text-eth-blue-text hover:underline">
          {en ? 'All events' : 'Todos los eventos'} →
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

      {by('supporter').length > 0 && (
        <Section title={en ? 'Who backs us' : 'Quiénes nos respaldan'}>
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

  return {
    props: {
      recent: all.slice(0, 6),
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
