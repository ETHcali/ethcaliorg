import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import {
  TOUR,
  EAG_TRACKS,
  HSK_TRACKS,
  PRIZES,
  SCHEDULE,
  SPONSORS,
  SHANHAIWOO,
  type Bilingual,
  type Slot,
} from '../content/builders-tour';
import { asLocale, formatDate, formatDateRange, type Locale } from '../lib/i18n';
import { DETAIL_SIZES } from '../lib/images';

interface Props {
  locale: Locale;
}

/** Every string on this page is bilingual inline; this is the only reader. */
const pick = (b: Bilingual, l: Locale) => b[l];

const COPY = {
  eyebrow: { es: 'Hackathon presencial', en: 'In-person hackathon' },
  when: { es: 'Cuándo', en: 'When' },
  where: { es: 'Dónde', en: 'Where' },
  howToJoin: { es: 'Cómo participar', en: 'How to join' },
  howToJoinLead: {
    es: 'Son dos registros distintos y necesitas los dos: uno te da el cupo presencial, el otro es donde entregas el proyecto.',
    en: 'Two separate registrations, and you need both: one gets you the seat, the other is where you submit the project.',
  },
  prizes: { es: 'Premios', en: 'Prizes' },
  prizesLead: {
    es: 'Dos tracks, dos premiaciones independientes. Puedes competir en ambos con el mismo proyecto.',
    en: 'Two tracks, judged separately. The same project can compete in both.',
  },
  tracks: { es: 'Tracks', en: 'Tracks' },
  tracksLead: {
    es: 'Elige uno. Los nombres van en inglés para que coincidan con los materiales de EAG y HashKey Chain.',
    en: 'Pick one. Names are kept as EAG and HashKey Chain publish them.',
  },
  schedule: { es: 'Agenda', en: 'Schedule' },
  scheduleLead: {
    es: 'Dos días completos. El sábado se aprende y se arranca; el domingo se construye, se entrega y se premia.',
    en: 'Two full days. Saturday you learn and start; Sunday you build, submit and win.',
  },
  venue: { es: 'La sede', en: 'The venue' },
  sponsors: { es: 'Quiénes lo hacen posible', en: 'Who makes it possible' },
  openMaps: { es: 'Abrir en Google Maps', en: 'Open in Google Maps' },
  prizeLabel: { es: 'Premio', en: 'Prize' },
  seePost: { es: 'Ver el anuncio', en: 'See the announcement' },
  ctaFinal: { es: '¿Listo?', en: 'Ready?' },
  ctaFinalLead: {
    es: 'Cupos limitados. El registro presencial cierra cuando se llena la sala.',
    en: 'Limited places. In-person registration closes when the room is full.',
  },
} satisfies Record<string, Bilingual>;

/** Colour carries meaning here: what you do vs. when you rest vs. when you win. */
const SLOT_STYLE: Record<Slot['kind'], string> = {
  opening: 'border-l-eth-blue',
  talk: 'border-l-eth-blue-text',
  workshop: 'border-l-eth-blue-text',
  hackathon: 'border-l-signal-confirmed',
  break: 'border-l-line-strong',
  demo: 'border-l-signal-pending',
  judgement: 'border-l-signal-pending',
  winner: 'border-l-signal-pending',
};

const SLOT_LABEL: Record<Slot['kind'], Bilingual> = {
  opening: { es: 'Apertura', en: 'Opening' },
  talk: { es: 'Charla', en: 'Talk' },
  workshop: { es: 'Taller', en: 'Workshop' },
  hackathon: { es: 'Hackathon', en: 'Hackathon' },
  break: { es: 'Pausa', en: 'Break' },
  demo: { es: 'Demos', en: 'Demos' },
  judgement: { es: 'Jurado', en: 'Judging' },
  winner: { es: 'Ganadores', en: 'Winners' },
};

function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line-hairline py-14">
      <div className="mx-auto max-w-page px-gutter">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>
        {lead && <p className="mt-3 max-w-prose text-base text-content-secondary">{lead}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

/**
 * The primary action. Both registrations are primary — the page would be lying
 * if it implied one was optional, since a project only competes once it is on
 * Devfolio and only gets in the room once it is on Luma.
 */
function Cta({
  href,
  label,
  note,
  tone = 'brand',
}: {
  href: string;
  label: string;
  note?: string;
  tone?: 'brand' | 'outline';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex min-h-tap flex-col justify-center rounded-control px-5 py-3 transition-colors ${
        tone === 'brand'
          ? 'bg-eth-blue text-on-brand hover:bg-eth-blue-lift'
          : 'border border-line-strong text-content-primary hover:border-eth-blue hover:bg-eth-blue-wash'
      }`}
    >
      <span className="text-sm font-bold">{label} →</span>
      {note && (
        <span className={`mt-0.5 text-xs ${tone === 'brand' ? 'text-on-brand/80' : 'text-content-muted'}`}>
          {note}
        </span>
      )}
    </a>
  );
}

export default function BuildersTour({ locale }: Props) {
  const t = (b: Bilingual) => pick(b, locale);

  const dateRange = formatDateRange(TOUR.startsOn, TOUR.endsOn, locale);

  // Keyless embed. The Maps Embed API proper needs a key; this legacy form does
  // not, which matters for a page paid traffic lands on — a rotated key would
  // silently blank the map. Note it must be maps.google.com: the www.google.com
  // spelling of the same query returns an empty white frame.
  const mapSrc = `https://maps.google.com/maps?q=${TOUR.venue.lat},${TOUR.venue.lng}&z=16&hl=${locale}&output=embed`;

  return (
    <Layout>
      <Seo
        title={TOUR.title}
        description={t(TOUR.tagline)}
        path="/builders-tour"
        image={SHANHAIWOO.poster}
        type="article"
      />

      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 0%, var(--eth-blue-wash), transparent 70%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-page px-gutter pb-12 pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
            {t(COPY.eyebrow)}
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
            Ethereum Builders Tour
            <span className="block text-eth-blue-text">Cali, Colombia</span>
          </h1>

          <p className="mt-5 max-w-prose text-lg text-content-secondary">{t(TOUR.tagline)}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                {t(COPY.when)}
              </dt>
              <dd className="mono mt-1 text-base font-bold text-content-primary">{dateRange}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                {t(COPY.where)}
              </dt>
              <dd className="mt-1 text-base font-bold text-content-primary">
                <a href="#venue" className="hover:text-eth-blue-text">
                  {TOUR.venue.name}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-9 grid gap-3 sm:max-w-2xl sm:grid-cols-2">
            <Cta
              href={TOUR.registration.luma.url}
              label={t(TOUR.registration.luma.label)}
              note={t(TOUR.registration.luma.note)}
            />
            <Cta
              href={TOUR.registration.devfolio.url}
              label={t(TOUR.registration.devfolio.label)}
              note={t(TOUR.registration.devfolio.note)}
              tone="outline"
            />
          </div>
        </div>
      </header>

      {/* ── what it is ───────────────────────────────────────────────────── */}
      <Section id="about" title={TOUR.title}>
        <div className="max-w-prose whitespace-pre-line text-base leading-relaxed text-content-secondary">
          {t(TOUR.intro)}
        </div>
      </Section>

      {/* ── prizes ───────────────────────────────────────────────────────── */}
      <Section id="prizes" eyebrow={t(COPY.prizes)} title={t(COPY.prizes)} lead={t(COPY.prizesLead)}>
        <div className="grid gap-4 sm:grid-cols-2">
          {PRIZES.map((track) => (
            <div key={track.sponsor} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-eth-blue-text">
                {track.sponsor}
              </h3>
              <ul className="mt-4 space-y-3">
                {track.tiers.map((tier) => (
                  <li key={tier.place} className="flex items-baseline gap-3">
                    <span className="mono shrink-0 text-lg font-bold text-signal-pending">
                      {tier.place}
                    </span>
                    <span className="text-sm text-content-secondary">{t(tier.prize)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── tracks ───────────────────────────────────────────────────────── */}
      <Section id="tracks" eyebrow={t(COPY.tracks)} title={t(COPY.tracks)} lead={t(COPY.tracksLead)}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-content-faint">
          EAG · 6 tracks
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EAG_TRACKS.map((track) => (
            <div key={track.name} className="rounded-card border border-line-hairline bg-surface-slab p-4">
              <h4 className="text-sm font-bold leading-snug text-content-primary">{track.name}</h4>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(track.detail)}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-content-faint">
          HashKey Chain · 7 tracks
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {HSK_TRACKS.map((name) => (
            <li
              key={name}
              className="rounded-chip border border-line-hairline bg-surface-slab px-3.5 py-2 text-sm text-content-secondary"
            >
              {name}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── schedule ─────────────────────────────────────────────────────── */}
      <Section id="schedule" eyebrow={t(COPY.schedule)} title={t(COPY.schedule)} lead={t(COPY.scheduleLead)}>
        <div className="grid gap-8 lg:grid-cols-2">
          {SCHEDULE.map((day) => (
            <div key={day.date}>
              <h3 className="text-base font-bold text-content-primary">
                {t(day.label)}{' '}
                <span className="mono ml-1 text-sm font-normal text-content-faint">
                  {formatDate(day.date, locale, { year: undefined })}
                </span>
              </h3>

              <ol className="mt-4 space-y-1.5">
                {day.slots.map((slot, i) => (
                  <li
                    key={`${slot.start}-${i}`}
                    className={`border-l-2 py-2 pl-3.5 ${SLOT_STYLE[slot.kind]} ${
                      slot.highlight ? 'bg-surface-slab' : ''
                    } rounded-r-chip`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="mono shrink-0 text-xs font-bold text-content-primary">
                        {slot.start}
                        {slot.end && <span className="text-content-faint">–{slot.end}</span>}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                        {t(SLOT_LABEL[slot.kind])}
                      </span>
                    </div>

                    <p
                      className={`mt-0.5 text-sm ${
                        slot.highlight ? 'font-bold text-content-primary' : 'text-content-secondary'
                      }`}
                    >
                      {t(slot.activity)}
                    </p>

                    {slot.who && (
                      <p className="mt-0.5 text-xs text-content-muted">
                        <span className="text-content-secondary">{slot.who.name}</span> ·{' '}
                        {t(slot.who.role)}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      {/* ── ShanHaiWoo ───────────────────────────────────────────────────── */}
      <Section
        id="shanhaiwoo"
        eyebrow={t(COPY.prizeLabel)}
        title={`${SHANHAIWOO.name} · ${SHANHAIWOO.editionLabel}`}
        lead={t(SHANHAIWOO.blurb)}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="mono text-sm text-content-muted">
              {t(SHANHAIWOO.dates)} · {SHANHAIWOO.cities.join(' · ')}
            </p>

            <ol className="mt-5 space-y-3">
              {SHANHAIWOO.legs.map((leg) => (
                <li key={leg.city} className="rounded-card border border-line-hairline bg-surface-slab p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-bold text-content-primary">{leg.city}</h3>
                    <span className="mono text-xs text-content-faint">{leg.dates}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-content-muted">{t(leg.focus)}</p>
                </li>
              ))}
            </ol>

            <a
              href={SHANHAIWOO.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
            >
              {t(COPY.seePost)} →
            </a>
          </div>

          <Image
            src={SHANHAIWOO.poster}
            alt={`${SHANHAIWOO.name} 2026`}
            width={1200}
            height={675}
            sizes={DETAIL_SIZES}
            className="h-auto w-full rounded-card border border-line-hairline"
          />
        </div>
      </Section>

      {/* ── venue ────────────────────────────────────────────────────────── */}
      <Section id="venue" eyebrow={t(COPY.where)} title={t(COPY.venue)}>
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <h3 className="text-base font-bold text-content-primary">{TOUR.venue.name}</h3>
            <p className="mt-1 text-sm text-content-muted">{TOUR.venue.city}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={TOUR.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center text-sm text-eth-blue-text hover:underline"
              >
                {t(COPY.openMaps)} →
              </a>
              <a
                href={TOUR.venue.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center text-sm text-eth-blue-text hover:underline"
              >
                zonamerica.com →
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-card border border-line-hairline">
            <iframe
              src={mapSrc}
              title={TOUR.venue.name}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full border-0"
            />
          </div>
        </div>
      </Section>

      {/* ── sponsors ─────────────────────────────────────────────────────── */}
      <Section id="sponsors" title={t(COPY.sponsors)}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SPONSORS.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col items-center justify-center gap-3 rounded-card border border-line-hairline bg-surface-slab p-5 text-center transition-colors hover:border-line-brand"
              >
                <div className="flex h-12 items-center justify-center">
                  {s.logo ? (
                    <Image
                      src={s.logo}
                      alt={s.name}
                      width={s.wide ? 180 : 110}
                      height={48}
                      sizes={s.wide ? '180px' : '110px'}
                      className={`max-h-12 w-auto object-contain ${s.wide ? 'max-w-[180px]' : 'max-w-[110px]'}`}
                    />
                  ) : (
                    <span className="text-base font-bold leading-tight text-content-primary">
                      {s.name}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                  {t(s.role)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── final CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-line-hairline py-16">
        <div className="mx-auto max-w-page px-gutter">
          <h2 className="text-3xl">{t(COPY.ctaFinal)}</h2>
          <p className="mt-2 max-w-prose text-base text-content-secondary">{t(COPY.ctaFinalLead)}</p>

          <div className="mt-7 grid gap-3 sm:max-w-2xl sm:grid-cols-2">
            <Cta
              href={TOUR.registration.luma.url}
              label={t(TOUR.registration.luma.label)}
              note={t(TOUR.registration.luma.note)}
            />
            <Cta
              href={TOUR.registration.devfolio.url}
              label={t(TOUR.registration.devfolio.label)}
              note={t(TOUR.registration.devfolio.note)}
              tone="outline"
            />
          </div>

          <a
            href={TOUR.registration.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[36px] items-center text-sm text-eth-blue-text hover:underline"
          >
            {t(TOUR.registration.telegram.label)} →
          </a>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
