import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import TourMap from '../components/tour/TourMap';
import TrackMark from '../components/tour/TrackMark';
import Seo from '../components/layout/Seo';
import {
  TOUR,
  EAG_TRACKS,
  HSK_TRACKS,
  PRIZES,
  PRIZES_ARE_CUMULATIVE,
  DEVCON,
  PAYOUT,
  TOUR_MAP_COPY,
  SCHEDULE,
  SPONSORS,
  SHANHAIWOO,
  type Bilingual,
  type Slot,
} from '../content/builders-tour';
import { FRONTIER, QUEST, QUEST_CITIES, QUEST_COPY } from '../content/quest';
import { asLocale, formatDate, formatDateRange, type Locale } from '../lib/i18n';
import { APP } from '../lib/links';


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
    es: 'Tres fuentes de premios, juzgadas por separado. Un mismo proyecto puede llevarse más de una.',
    en: 'Three prize sources, judged separately. One project can take more than one.',
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
  frontierNote: {
    es: 'Para empresas — delega una misión en Asia.',
    en: 'For businesses — delegate a mission in Asia.',
  },
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
    <section id={id} className="border-t border-line-hairline py-10 sm:py-14">
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
 *
 * A site-relative href routes through next/link instead: Frontier Cities is our
 * own page, and sending it to a new tab would be treating it like somebody
 * else's site.
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
  const className = `group flex min-h-tap flex-col justify-center rounded-control px-5 py-3 transition-colors ${
    tone === 'brand'
      ? 'bg-eth-blue text-on-brand hover:bg-eth-blue-lift'
      : 'border border-line-strong text-content-primary hover:border-eth-blue hover:bg-eth-blue-wash'
  }`;

  const inner = (
    <>
      <span className="text-sm font-bold">{label} →</span>
      {note && (
        <span className={`mt-0.5 text-xs ${tone === 'brand' ? 'text-on-brand/80' : 'text-content-muted'}`}>
          {note}
        </span>
      )}
    </>
  );

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  );
}

export default function BuildersTour({ locale }: Props) {
  const t = (b: Bilingual) => pick(b, locale);
  const en = locale === 'en';

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
        // The share card is the tour's own poster, not the mission artwork.
        // This is what appears in a Facebook ad and a WhatsApp forward, so it
        // should say Ethereum Builders Tour rather than show a dragon.
        image="/tour/eag-builders-tour.jpg"
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
        <div className="relative mx-auto max-w-page px-gutter pb-10 pt-12 sm:pb-12 sm:pt-16">
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

          {/* Two audiences, three doors. The first two are for a builder and
              are both required; the third is the one a business owner reading
              this page has been looking for, and until now it was buried eight
              sections down. Three across only from lg — at sm the third wraps
              to its own full-width row, which reads correctly as "and,
              separately, this one is for you". */}
          <div className="mt-9 grid gap-3 sm:max-w-2xl sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-3">
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
            <Cta
              href={FRONTIER.path}
              label={FRONTIER.name}
              note={t(COPY.frontierNote)}
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

        {/* The official piece, framed rather than dropped in: a brand-tinted
            glow behind it and a hairline over it, so it reads as part of the
            page instead of a pasted JPEG. */}
        <div className="relative mt-10 overflow-hidden rounded-card border border-line-brand">
          <div
            className="pointer-events-none absolute -inset-8 blur-2xl"
            style={{ background: 'radial-gradient(ellipse at 50% 120%, var(--eth-blue-wash), transparent 70%)' }}
            aria-hidden
          />
          <Image
            src="/tour/eag-builders-tour.jpg"
            alt="Ethereum Builders Tour — EAG Global Application & Builder Initiative 2026"
            width={1200}
            height={675}
            sizes="(min-width: 1024px) 1000px, 92vw"
            className="relative h-auto w-full"
            priority
          />
        </div>
      </Section>

      {/* ── the tour map ─────────────────────────────────────────────────── */}
      <Section
        id="tour-map"
        eyebrow={t(TOUR_MAP_COPY.eyebrow)}
        title={t(TOUR_MAP_COPY.title)}
        lead={t(TOUR_MAP_COPY.lead)}
      >
        <TourMap locale={locale} />
      </Section>

      {/* ── sponsors ─────────────────────────────────────────────────────── */}
      {/* Three tiers, and the order is identical at every width: title sponsor,
          then the four partners in one order, then the venue. Each tier stacks
          to a single column on a phone rather than re-flowing into a different
          arrangement, so somebody reading on a phone and somebody reading on a
          laptop see the same sponsors in the same sequence.

          The previous version rendered all six marks at one size with a 10px
          role caption. HashKey Chain funds the prize money and got exactly as
          much room as everyone else; nobody could tell from the wall who paid
          for what. Each tile now states the contribution and links to the
          section of this page that backs it up. */}
      <Section id="sponsors" title={t(COPY.sponsors)}>
        {SPONSORS.filter((s) => s.tier === 'title').map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex flex-col items-center gap-5 rounded-card border border-line-brand bg-eth-blue-wash p-6 text-center transition-colors hover:border-eth-blue sm:flex-row sm:text-left"
          >
            {/* The plate is opt-in, same as the partner tiles: HashKey's mark
                ships as artwork with its own dark ground, and a white plate
                under it renders as a black square inside a white box. */}
            <span
              className={`flex w-full shrink-0 items-center justify-center px-5 py-4 sm:w-[220px] ${
                s.plate ? 'rounded-chip bg-surface-paper' : 'rounded-chip bg-surface-slab'
              }`}
            >
              {s.logo ? (
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={220}
                  height={72}
                  sizes="(min-width: 640px) 180px, 60vw"
                  className="max-h-16 w-auto object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-surface-void">{s.name}</span>
              )}
            </span>

            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-eth-blue-text">
                {t(s.role)}
              </span>
              <span className="mt-1.5 block text-xl font-bold text-content-primary">{s.name}</span>
              <span className="mt-2 block text-sm leading-relaxed text-content-secondary">
                {t(s.gives)}
              </span>
            </span>
          </a>
        ))}

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPONSORS.filter((s) => s.tier === 'partner').map((s) => (
            <li key={s.name} className="flex flex-col">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 flex-col items-center gap-4 rounded-card border border-line-hairline bg-surface-slab p-5 text-center transition-colors hover:border-line-brand"
              >
                <span
                  className={`flex h-12 items-center justify-center ${
                    s.plate ? 'w-full rounded-chip bg-surface-paper px-3' : ''
                  }`}
                >
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
                </span>

                <span className="text-[10px] font-bold uppercase tracking-widest text-eth-blue-text">
                  {t(s.role)}
                </span>
                <span className="text-sm leading-relaxed text-content-muted">{t(s.gives)}</span>
              </a>

              {/* Second and third destinations, so neither can be nested inside
                  the tile's own anchor — a link inside a link is invalid and
                  browsers resolve it unpredictably. */}
              {(s.proof || s.x) && (
                <span className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 text-[11px]">
                  {s.proof && (
                    <a
                      href={s.proof}
                      className="font-semibold text-eth-blue-text hover:underline"
                    >
                      {en ? 'see it' : 'ver'} →
                    </a>
                  )}
                  {s.x && (
                    <a
                      href={s.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-content-faint transition-colors hover:text-eth-blue-text"
                    >
                      {s.x.replace('https://x.com/', '@')}
                    </a>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>

        {SPONSORS.filter((s) => s.tier === 'venue').map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex flex-col items-center gap-4 rounded-card border border-line-hairline bg-surface-slab p-6 text-center transition-colors hover:border-line-brand"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-eth-blue-text">
              {t(s.role)}
            </span>

            {s.logo && (
              // Sized so the institutional row under the wordmark is actually
              // legible: below ~300px wide its type falls under 8px and the
              // marks turn to noise. The lockup is never cropped — Gobernación
              // del Valle, Alcaldía de Cali, Cámara de Comercio and comfandi are
              // part of the mark.
              <Image
                src={s.logo}
                alt={`${s.name} — Gobernación del Valle del Cauca, Alcaldía de Santiago de Cali, Cámara de Comercio de Cali, comfandi`}
                width={1731}
                height={707}
                sizes="(min-width: 640px) 520px, 88vw"
                className="h-auto w-full max-w-[520px]"
              />
            )}

            <span className="max-w-prose text-sm leading-relaxed text-content-muted">
              {t(s.gives)}
            </span>
          </a>
        ))}
      </Section>

      {/* ── tracks ───────────────────────────────────────────────────────── */}
      <Section id="tracks" eyebrow={t(COPY.tracks)} title={t(COPY.tracks)} lead={t(COPY.tracksLead)}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-content-faint">
          EAG · 6 tracks
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EAG_TRACKS.map((track) => (
            <div key={track.name} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <TrackMark track={track.name} />
              <h4 className="mt-3 text-sm font-bold leading-snug text-content-primary">
                {track.name}
              </h4>
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

      {/* ── prizes ───────────────────────────────────────────────────────── */}
      <Section id="prizes" eyebrow={t(COPY.prizes)} title={t(COPY.prizes)} lead={t(COPY.prizesLead)}>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {PRIZES.map((track) => (
            <div
              key={track.sponsor}
              className="flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab"
            >
              {/* The prize gets a face rather than a number. A month in three
                  cities and a USDT pot read very differently as pictures. */}
              <div className="relative aspect-[16/9] bg-surface-inset">
                <Image
                  src={track.image}
                  alt={track.sponsor}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 45vw, 92vw"
                  className={`object-cover ${
                    track.focus === 'right' ? 'object-right' : 'object-center'
                  }`}
                />
                {/* The scrim has to carry a light label over a LIGHT image —
                    EAG's banner is white artwork — so it is stronger than a
                    dark-image card would need. Same scrim on all three, or the
                    row stops reading as one set. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, var(--surface-slab) 14%, rgb(6 6 11 / 0.62) 30%, transparent 66%)',
                  }}
                  aria-hidden
                />
                <h3 className="absolute bottom-3 left-4 text-sm font-bold uppercase tracking-wide text-content-primary">
                  {track.sponsor}
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm text-content-muted">{t(track.blurb)}</p>
                <ul className="mt-4 space-y-3">
                  {track.tiers.map((tier) => (
                    <li key={tier.place} className="flex items-baseline gap-3">
                      <span className="mono shrink-0 text-2xl font-bold text-signal-pending">
                        {tier.place}
                      </span>
                      <span className="text-sm leading-relaxed text-content-secondary">
                        {t(tier.prize)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Said plainly: a builder who assumes the tracks are exclusive picks
            one and aims lower than they need to. */}
        <p className="mt-3 rounded-card border border-line-brand bg-eth-blue-wash px-5 py-4 text-sm leading-relaxed text-content-secondary">
          <span className="font-bold text-content-primary">
            {en ? 'Prizes stack.' : 'Los premios se acumulan.'}
          </span>{' '}
          {t(PRIZES_ARE_CUMULATIVE).replace(/^[^.]*\.\s*/, '')}
        </p>

        <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-content-faint">
          {en ? 'Getting paid' : 'Cómo se paga'}
        </h3>
        <p className="mt-2 max-w-prose text-sm text-content-secondary">{t(PAYOUT.note)}</p>

        <div className="mt-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex items-center gap-5 rounded-card border border-line-hairline bg-surface-slab p-6">
            <Image
              src={PAYOUT.logo}
              alt={PAYOUT.token}
              width={64}
              height={64}
              sizes="64px"
              className="h-16 w-16 shrink-0"
            />
            <div>
              <p className="mono text-2xl font-bold text-content-primary">{PAYOUT.token}</p>
              <p className="mono mt-1 text-sm text-content-muted">{t(PAYOUT.chain)}</p>
            </div>
          </div>

          <div className="rounded-card border border-line-brand bg-eth-blue-wash p-6">
            <h3 className="text-lg font-bold text-content-primary">
              {t(PAYOUT.noWallet.title)}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-content-secondary">
              {t(PAYOUT.noWallet.body)}
            </p>
            <a
              href={APP.home}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-tap items-center rounded-control bg-eth-blue px-5 text-sm font-bold text-on-brand transition-colors hover:bg-eth-blue-lift"
            >
              {t(PAYOUT.noWallet.cta)} →
            </a>
          </div>
        </div>
        </div>
      </Section>

      {/* ── Frontier Cities ─────────────────────────────────────────────── */}
      {/* The one section on this page not addressed to a builder, and it says so
          in its first three words. It stands where the EAG Global Buildathon
          used to: that section explained a 12,500 USD pool of which 1,000 is
          actually awarded here, and readers took the big number for the prize
          they were competing for. The Devfolio requirement is already stated in
          "how to join", so nothing load-bearing left with it.

          The layout is deliberately unlike the rest of the page — three city
          cards and a value strip, no poster. The ShanHaiWoo artwork is a few
          hundred pixels below in the Devcon section, where it belongs to the
          builder story; repeating it here would make the two offers look like
          one. */}
      <Section
        id="frontier"
        eyebrow={FRONTIER.name}
        title={
          en
            ? 'For businesses: delegate a mission in Asia'
            : 'Para empresas: delega una misión en Asia'
        }
        lead={t(QUEST_COPY.lead)}
      >
        <div className="overflow-hidden rounded-card border border-line-brand bg-eth-blue-wash">
          <div className="grid gap-px bg-line-hairline sm:grid-cols-3">
            {QUEST_CITIES.map((city) => (
              <div key={city.id} className="bg-surface-slab p-5">
                <h3 className="text-base font-bold text-content-primary">{city.name}</h3>
                <p className="mono mt-1 text-xs text-content-faint">{t(city.dates)}</p>
                <p className="mt-3 text-sm leading-relaxed text-content-muted">{t(city.known)}</p>
              </div>
            ))}
          </div>

          {/* The reference value is the fact a business owner is scanning for,
              so it gets the same monospaced treatment the prize figures get. */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 px-5 py-5">
            <p className="mono text-3xl font-bold text-eth-blue-text">
              {QUEST.postedValueUsd.toLocaleString(en ? 'en-US' : 'es-CO')} USD
            </p>
            <p className="max-w-prose text-sm text-content-secondary">
              {en
                ? 'the reference value per mission, agreed before anything is run'
                : 'el valor de referencia por misión, acordado antes de ejecutar nada'}
            </p>
            <Cta
              href={FRONTIER.path}
              label={t(QUEST_COPY.formTitle)}
              note={t(QUEST.window)}
              tone="outline"
            />
          </div>
        </div>
      </Section>

      {/* ── road to Devcon ───────────────────────────────────────────────── */}
      {/* Devcon's own identity carries this section rather than ours: the deep
          blue on a light plate is how that mark is meant to be seen, and a
          reader should recognise it before they read a word. */}
      <Section
        id="devcon"
        eyebrow="Road to Devcon"
        title={en ? 'The road ends at Devcon' : 'El camino termina en Devcon'}
        lead={t(DEVCON.blurb)}
      >
        <div className="overflow-hidden rounded-card border border-signal-pending/40">
          <a
            href={DEVCON.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <Image
              src={DEVCON.banner}
              alt={`${DEVCON.name} — ${t(DEVCON.place)}`}
              width={1500}
              height={500}
              sizes="(min-width: 1024px) 1000px, 92vw"
              className="h-auto w-full"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4"
              style={{ background: 'linear-gradient(to top, rgb(6 6 11 / 0.85), transparent)' }}
            >
              <p className="mono text-sm font-bold text-content-primary">
                {t(DEVCON.dates)} · {t(DEVCON.place)}
              </p>
              <span className="text-xs font-semibold text-signal-pending opacity-0 transition-opacity group-hover:opacity-100">
                devcon.org →
              </span>
            </div>
          </a>

          <div className="grid gap-px bg-line-hairline sm:grid-cols-3">
            {DEVCON.facts.map((f) => (
              <div key={f.label.es} className="bg-surface-slab p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-signal-pending">
                  {t(f.label)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-content-secondary">{t(f.value)}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 bg-surface-slab px-5 py-5">
            <Image
              src={DEVCON.programme}
              alt="Road to Devcon India"
              width={300}
              height={300}
              sizes="88px"
              className="h-[88px] w-[88px] shrink-0 rounded-chip"
            />
            <p className="mono text-3xl font-bold text-signal-pending">
              {DEVCON.ticketValueUsd} USD
            </p>
            <p className="text-sm text-content-muted">
              {en ? 'the value of each ticket' : 'el valor de cada entrada'}
            </p>
            <a
              href={DEVCON.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-tap w-full items-center justify-center rounded-control border border-signal-pending/50 px-4 text-sm font-bold text-signal-pending transition-colors hover:bg-signal-pending/10 sm:ml-auto sm:w-auto"
            >
              devcon.org →
            </a>
          </div>
        </div>

        {/* The mission is how a winner actually gets to Mumbai, so it sits under
            Devcon rather than in a section of its own. */}
        <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-content-faint">
          {SHANHAIWOO.name} · {en ? 'three cities, one journey' : 'tres ciudades, un solo recorrido'}
        </h3>

        {/* Same treatment as the Devcon banner above: the artwork runs full
            width with its own scrim carrying the dates, and the whole banner is
            the link. The two pieces then read as a pair rather than as a banner
            and a thumbnail. */}
        <div className="mt-4 overflow-hidden rounded-card border border-line-hairline">
          <a
            href={SHANHAIWOO.site}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <Image
              src={SHANHAIWOO.poster}
              alt={`${SHANHAIWOO.name} 2026`}
              width={1200}
              height={675}
              sizes="(min-width: 1024px) 1000px, 92vw"
              className="h-auto w-full"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4"
              style={{ background: 'linear-gradient(to top, rgb(6 6 11 / 0.85), transparent)' }}
            >
              <p className="mono text-sm font-bold text-content-primary">
                {t(SHANHAIWOO.dates)} · {SHANHAIWOO.cities.join(' · ')}
              </p>
              <span className="text-xs font-semibold text-eth-blue-text opacity-0 transition-opacity group-hover:opacity-100">
                shanhaiwoo.com →
              </span>
            </div>
          </a>

          <div className="bg-surface-slab p-6">
            <ol className="space-y-0">
              {SHANHAIWOO.legs.map((leg, i) => {
                const last = i === SHANHAIWOO.legs.length - 1;
                return (
                  <li key={leg.city} className="relative flex gap-4 pb-7 last:pb-0">
                    {!last && (
                      <span
                        className="absolute left-[7px] top-4 h-full w-px bg-line-strong"
                        aria-hidden
                      />
                    )}
                    <span
                      className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                        'devcon' in leg && leg.devcon
                          ? 'border-signal-pending bg-signal-pending'
                          : 'border-eth-blue-text bg-surface-slab'
                      }`}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="text-base font-bold text-content-primary">{leg.city}</h4>
                        <span className="mono text-xs text-content-faint">{leg.dates}</span>
                        {'devcon' in leg && leg.devcon && (
                          <span className="rounded-full bg-signal-pending/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-signal-pending">
                            Devcon
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-content-muted">
                        {t(leg.focus)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* The business offer used to be pitched here, at the bottom of a
                section about a builder's prize. It now has its own section a
                screen above, so repeating the same destination inside the
                journey would be asking twice in the same breath. */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ['shanhaiwoo.com', SHANHAIWOO.site],
                ['@shanhaiwoo', SHANHAIWOO.x],
                ['devcon.org', DEVCON.url],
                ['@efdevcon', DEVCON.x],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
                >
                  {label} →
                </a>
              ))}
            </div>
          </div>
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

        {/* The same lockup the sponsor row carries, given the width it was drawn
            for — this is where the institutional backing is worth reading. */}
        <a
          href={TOUR.venue.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block rounded-card border border-line-hairline bg-surface-slab px-6 py-7 transition-colors hover:border-line-strong"
        >
          <Image
            src="/tour/nido.png"
            alt="NIDO · Zonamerica — Gobernación del Valle del Cauca, Alcaldía de Santiago de Cali, Cámara de Comercio de Cali, comfandi"
            width={1731}
            height={707}
            sizes="(min-width: 1024px) 720px, 88vw"
            className="mx-auto h-auto w-full max-w-[720px]"
          />
        </a>
      </Section>

      {/* ── final CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-line-hairline py-12 sm:py-16">
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
