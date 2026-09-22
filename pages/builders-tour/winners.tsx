import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import { Section } from '../../components/layout/Page';
import Streams from '../../components/media/Streams';
import { clamp } from '../../lib/descriptions';
import { breadcrumbJsonLd } from '../../lib/jsonld';
import { asLocale, formatDate, type Locale } from '../../lib/i18n';
import { TOUR, type Bilingual } from '../../content/builders-tour';
import {
  RESULTS,
  RESULTS_COPY,
  WINNERS,
  OTHERS,
  HSK,
  HSK_ANNOUNCED,
  HSK_ENTRANTS,
  resultsLead,
  othersLead,
  projectBySlug,
  devfolioUrl,
  devfolioProfile,
  type Project,
  type HskSlot,
} from '../../content/results';

interface Props {
  locale: Locale;
}

/**
 * Outbound link on a project card. Every one of these leaves the site, so they
 * all carry the same rel and the same shape — a reader should not have to work
 * out which of four buttons behaves differently.
 */
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
    >
      {children}
    </a>
  );
}

/**
 * The credit line.
 *
 * Names are the point of this page, so they are rendered at body size rather
 * than as metadata, and each one links to the profile that proves it. A member
 * without a Devfolio handle is still named — the submission is the record, and
 * some of them were entered without one.
 */
function Team({ team }: { team: Project['team'] }) {
  return (
    <p className="mt-3 text-sm text-content-secondary">
      {team.map((m, i) => (
        <span key={m.name}>
          {i > 0 && <span className="text-content-faint"> · </span>}
          {m.handle ? (
            <a
              href={devfolioProfile(m.handle)}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-eth-blue-text"
            >
              {m.name}
            </a>
          ) : (
            m.name
          )}
        </span>
      ))}
    </p>
  );
}

function Tracks({ tracks }: { tracks: readonly string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {tracks.map((track) => (
        <li
          key={track}
          className="rounded-chip border border-line-hairline px-2.5 py-1 text-[11px] text-content-muted"
        >
          {track}
        </li>
      ))}
    </ul>
  );
}

function Links({ project, t }: { project: Project; t: (b: Bilingual) => string }) {
  const { github, demo, video } = project.links;
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Out href={devfolioUrl(project.slug)}>{t(RESULTS_COPY.onDevfolio)}</Out>
      {github && <Out href={github}>{t(RESULTS_COPY.code)}</Out>}
      {demo && <Out href={demo}>{t(RESULTS_COPY.demo)}</Out>}
      {video && <Out href={video}>{t(RESULTS_COPY.video)}</Out>}
    </div>
  );
}

/**
 * A winner, with the photograph taken when they presented.
 *
 * The photo is the reason this page exists rather than a list of links: a
 * ranking is a table, but the people who built the thing are a room. It leads
 * the card on mobile and sits beside it from `lg` up, alternating sides so five
 * stacked cards do not read as a template.
 */
function WinnerCard({
  project,
  t,
  flip,
}: {
  project: Project & { place: number };
  t: (b: Bilingual) => string;
  flip: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-card border border-line-hairline bg-surface-slab">
      <div className={`grid lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        {project.photo && (
          <Image
            src={project.photo}
            alt={`${project.name} — ${RESULTS.hackathon}, Cali`}
            width={1280}
            height={960}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-56 w-full object-cover sm:h-72 lg:h-full"
          />
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-baseline gap-3">
            {/* The rank as a numeral, monospaced: it is a result, not a heading. */}
            <span className="mono text-3xl font-bold text-eth-blue-text">
              {project.place}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t(RESULTS_COPY.placeLabel)}
            </span>
          </div>

          <h3 className="mt-3 text-2xl">{project.name}</h3>
          <p className="mt-1 text-base text-eth-blue-text">{t(project.tagline)}</p>

          <Team team={project.team} />

          <p className="mt-4 text-sm leading-relaxed text-content-secondary">{t(project.blurb)}</p>

          <Tracks tracks={project.tracks} />
          <Links project={project} t={t} />
        </div>
      </div>
    </article>
  );
}

/** Everything that was submitted and did not place. Same fields, less room. */
function ProjectCard({ project, t }: { project: Project; t: (b: Bilingual) => string }) {
  return (
    <article className="flex flex-col rounded-card border border-line-hairline bg-surface-slab p-5">
      <h3 className="text-lg">{project.name}</h3>
      <p className="mt-1 text-sm text-eth-blue-text">{t(project.tagline)}</p>
      <Team team={project.team} />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-content-muted">{t(project.blurb)}</p>
      <Tracks tracks={project.tracks} />
      <Links project={project} t={t} />
    </article>
  );
}

/**
 * One place on the HashKey Chain track — filled, or reserved.
 *
 * The two states are deliberately the same card at the same height: the place
 * and the amount are known either way, and only the middle changes. An empty
 * slot that collapsed to a thin strip would read as an afterthought rather than
 * as a result that has not arrived, and the row would reflow the day one lands.
 *
 * The border is dashed while empty and solid once filled. That is the only
 * signal colour decision here — `signal-pending` is amber and means waiting,
 * which is exactly what this is.
 */
function HskSlotCard({ slot, t }: { slot: HskSlot; t: (b: Bilingual) => string }) {
  const project = slot.slug ? projectBySlug(slot.slug) : null;

  return (
    <article
      className={`flex min-h-[200px] flex-col rounded-card bg-surface-slab p-5 ${
        project ? 'border border-line-brand' : 'border border-dashed border-line-hairline'
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="mono text-3xl font-bold text-eth-blue-text">{slot.place}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
            {t(RESULTS_COPY.placeLabel)}
          </span>
        </div>
        <span className="mono text-sm font-bold text-content-primary">
          {slot.prize} {HSK.token}
        </span>
      </div>

      {project ? (
        <>
          <h3 className="mt-4 text-lg">{project.name}</h3>
          <p className="mt-1 text-sm text-eth-blue-text">{t(project.tagline)}</p>
          <Team team={project.team} />
          <div className="mt-auto pt-4">
            <Links project={project} t={t} />
          </div>
        </>
      ) : (
        // Centred rather than pushed to the bottom. Once one place is filled it
        // is a tall card next to two short ones, and `mt-auto` would strand the
        // label at the foot of a column of nothing.
        <p className="flex flex-1 items-center justify-center gap-2 py-6 text-sm text-content-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-pending" aria-hidden />
          {t(RESULTS_COPY.hskAwaiting)}
        </p>
      )}
    </article>
  );
}

/**
 * What came out of the Builders Tour stop in Cali.
 *
 * Nested under the campaign for the same reason Frontier Cities is: it belongs
 * to it. The campaign page sells a weekend that has now happened, and without
 * this page the only record of what got built is a Devfolio filter URL that
 * nobody outside the room would ever find.
 */
export default function Winners({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];

  return (
    <Layout>
      <Seo
        title={t(RESULTS_COPY.seoTitle)}
        description={clamp(resultsLead(locale))}
        path={RESULTS.path}
        image={WINNERS[0]?.photo ?? null}
        type="article"
        jsonLd={breadcrumbJsonLd(
          [
            { name: 'ETH Cali', route: '/' },
            { name: TOUR.title, route: '/builders-tour' },
            { name: t(RESULTS_COPY.title), route: RESULTS.path },
          ],
          locale
        )}
      />

      <header className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 0%, var(--eth-blue-wash), transparent 70%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-page px-gutter pb-10 pt-10 sm:pt-14">
          <Link
            href="/builders-tour"
            className="mono text-xs text-content-muted transition-colors hover:text-content-primary"
          >
            ← {t(RESULTS_COPY.backToTour)}
          </Link>

          {/* Eyebrow, name, one sentence, one line of fact. That is the hero.

              There were three stat tiles under this reading Hackers +25,
              Proyectos 13, En < 48 h — which is the sentence above them, set
              twice, the second time in boxes. The numbers belong in the
              sentence, where they are a claim about a weekend rather than a
              dashboard, and the tiles were the only thing between the reader
              and the first winner. */}
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
            {t(RESULTS_COPY.eyebrow)}
          </p>
          <h1 className="mt-2 text-4xl leading-[1.05] sm:text-5xl">{t(RESULTS_COPY.title)}</h1>
          <p className="mt-5 max-w-prose text-lg text-content-secondary">{resultsLead(locale)}</p>

          <p className="mono mt-5 text-sm text-content-muted">
            {formatDate(RESULTS.judgedOn, locale)} · {TOUR.venue.name[locale]}
          </p>
        </div>
      </header>

      {/* EAG's five. The eyebrow names the sponsor for the same reason the
          HashKey section does: two prize sets were judged in this room and a
          heading that says only "the winners" claims both. */}
      <Section
        id="podium"
        eyebrow="EAG"
        title={t(RESULTS_COPY.winnersTitle)}
        lead={t(RESULTS_COPY.podiumLead)}
      >
        <div className="grid gap-6">
          {WINNERS.map((project, i) => (
            <WinnerCard key={project.slug} project={project} t={t} flip={i % 2 === 1} />
          ))}
        </div>
      </Section>

      <Section
        id="stream"
        title={t(RESULTS_COPY.streamTitle)}
        lead={t(RESULTS_COPY.streamLead)}
      >
        <Streams locale={locale} />
      </Section>

      {/* The title sponsor's own track, with its three places standing open.
          Judged separately from the EAG prize and not decided yet — so the
          podium is built and empty rather than absent. A builder who entered
          this track can see their result is still coming, and announcing it
          later is a slug in `HSK.slots`, not a section written on the day. */}
      <Section
        id="hashkey"
        eyebrow={HSK.sponsor}
        title={t(RESULTS_COPY.hskTitle)}
        lead={t(HSK_ANNOUNCED ? RESULTS_COPY.hskLeadAnnounced : RESULTS_COPY.hskLeadPending)}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {HSK.slots.map((slot) => (
            <HskSlotCard key={slot.place} slot={slot} t={t} />
          ))}
        </div>

        <p className="mt-6 text-sm text-content-muted">{t(RESULTS_COPY.hskCumulative)}</p>

        {/* Who is actually in the running, read off the track chips rather than
            listed again. Five of the thirteen entered this track, and naming
            them is the difference between "a prize exists" and "one of these
            five is about to get it". */}
        {HSK_ENTRANTS.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t(RESULTS_COPY.hskEntrants)} · {HSK_ENTRANTS.length}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {HSK_ENTRANTS.map((p) => (
                <li key={p.slug}>
                  <a
                    href={devfolioUrl(p.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* The other prize competed for in the same room and not yet allocated.
          One card rather than a podium, because the Ethereum Foundation has not
          said how many tickets there are — a row of empty slots would be
          claiming a number nobody published. */}
      <Section id="devcon" title={t(RESULTS_COPY.devconTitle)}>
        <div className="max-w-prose rounded-card border border-dashed border-line-hairline bg-surface-slab p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-content-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-pending" aria-hidden />
            Ethereum Foundation
          </p>
          <p className="mt-2 text-sm leading-relaxed text-content-muted">
            {t(RESULTS_COPY.devconPending)}
          </p>
        </div>
      </Section>

      <Section
        id="projects"
        title={t(RESULTS_COPY.othersTitle)}
        lead={othersLead(locale)}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OTHERS.map((project) => (
            <ProjectCard key={project.slug} project={project} t={t} />
          ))}
        </div>

        <a
          href={RESULTS.devfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-tap items-center rounded-control border border-line-strong px-5 text-sm font-semibold text-content-primary transition-colors hover:border-eth-blue hover:bg-eth-blue-wash"
        >
          {RESULTS.hackathon} · {RESULTS.track} →
        </a>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
