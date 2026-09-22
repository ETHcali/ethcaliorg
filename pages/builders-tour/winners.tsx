import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import { Section } from '../../components/layout/Page';
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
  HSK_STACKED,
  resultsLead,
  othersLead,
  projectBySlug,
  devfolioUrl,
  devfolioProfile,
  type Project,
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
 * Names are the point of this page, so they get an eyebrow of their own, the
 * way the tracks do, and are rendered at body size rather than as metadata.
 * Each one links to the Devfolio profile that proves it and looks like a link:
 * primary text, underlined in the brand colour, with an outbound mark. It was
 * plain text with a hover, which is a link only to someone who happens to
 * move the mouse over it, and nobody does that on a phone.
 *
 * A member without a Devfolio handle is still named — the submission is the
 * record, and some of them were entered without one.
 */
function Team({ team, t }: { team: Project['team']; t: (b: Bilingual) => string }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {t(RESULTS_COPY.teamLabel)}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {team.map((m) => (
          <li key={m.name}>
            {m.handle ? (
              <a
                href={devfolioProfile(m.handle)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-content-primary underline decoration-line-brand decoration-1 underline-offset-4 transition-colors hover:text-eth-blue-text hover:decoration-eth-blue"
              >
                {m.name}
                <span className="ml-0.5 text-[10px] text-content-muted" aria-hidden>
                  ↗
                </span>
              </a>
            ) : (
              <span className="text-content-secondary">{m.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The tracks a project entered, and they are not metadata.
 *
 * They were hairline chips in the faintest text on the page, which is how you
 * style a tag nobody is meant to read. A track is what the project is *for* —
 * agent economy, open hardware, real-world Ethereum — and on this page it is
 * also which juries saw it. So they get the brand wash and an eyebrow, and
 * they sit directly under the tagline rather than after the blurb.
 */
function Tracks({ tracks, t }: { tracks: readonly string[]; t: (b: Bilingual) => string }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {t(RESULTS_COPY.tracksLabel)}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {tracks.map((track) => (
          <li
            key={track}
            className="rounded-chip border border-line-brand bg-eth-blue-wash px-2.5 py-1 text-[11px] font-semibold text-eth-blue-text"
          >
            {track}
          </li>
        ))}
      </ul>
    </div>
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
 * One place on a podium — EAG's or HashKey Chain's, filled or reserved.
 *
 * There used to be two cards. EAG's five were full-width, photo beside text,
 * each about a screen tall; HashKey's three were small, photo on top, with no
 * blurb and no tracks. Two juries, two shapes, and the second read as a
 * footnote to the first even though its top prize is the biggest on the page.
 *
 * This is the one card both podiums use now, and its shape is the one the EAG
 * card already had on a phone: photo on top, then place and prize, name,
 * tagline, tracks, team, the full blurb, links. Every place on the page carries
 * the same facts in the same order, and a phone reader sees exactly what they
 * saw before — the change is that a laptop now shows three of these in a row
 * instead of one stretched across the screen.
 *
 * `also` is the place this project took on the other podium, if it took one.
 * Two projects won with both juries, and the same photo twice on one page
 * needs a sentence saying so.
 *
 * An empty slot keeps the frame: place and prize are known, the middle says
 * "to be announced", and the border is dashed. `signal-pending` is amber and
 * means waiting, which is exactly what it is.
 */
function PrizeCard({
  project,
  place,
  prize,
  token,
  also,
  t,
}: {
  project: Project | null;
  place: number;
  prize: number;
  token: string;
  also?: { label: string; href: string };
  t: (b: Bilingual) => string;
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-card bg-surface-slab ${
        project ? 'border border-line-brand' : 'border border-dashed border-line-hairline'
      }`}
    >
      {project?.photo && (
        <Image
          src={project.photo}
          alt={`${project.name} — ${RESULTS.hackathon}, Cali`}
          width={1280}
          height={960}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {/* The rank as a numeral, monospaced: it is a result, not a heading. */}
            <span className="mono text-3xl font-bold text-eth-blue-text">{place}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t(RESULTS_COPY.placeLabel)}
            </span>
          </div>
          <span className="mono text-sm font-bold text-content-primary">
            {prize} {token}
          </span>
        </div>

        {project ? (
          <>
            <h3 className="mt-3 text-xl sm:text-2xl">{project.name}</h3>
            <p className="mt-1 text-base text-eth-blue-text">{t(project.tagline)}</p>
            {also && (
              <a
                href={also.href}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary transition-colors hover:text-content-primary"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-confirmed"
                  aria-hidden
                />
                {also.label}
              </a>
            )}

            <Tracks tracks={project.tracks} t={t} />
            <Team team={project.team} t={t} />

            <p className="mt-4 text-sm leading-relaxed text-content-secondary">
              {t(project.blurb)}
            </p>

            <div className="mt-auto">
              <Links project={project} t={t} />
            </div>
          </>
        ) : (
          // Centred rather than pushed to the bottom: a reserved place beside a
          // filled one is a short card next to a tall one, and `mt-auto` would
          // strand the label at the foot of a column of nothing.
          <p className="flex flex-1 items-center justify-center gap-2 py-10 text-sm text-content-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-pending" aria-hidden />
            {t(RESULTS_COPY.hskAwaiting)}
          </p>
        )}
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
      <Tracks tracks={project.tracks} t={t} />
      <Team team={project.team} t={t} />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-content-muted">{t(project.blurb)}</p>
      <Links project={project} t={t} />
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
        {/* Three across on a laptop, two on a tablet, one on a phone — the
            same grid the HashKey section uses, so five places and three
            places are visibly the same kind of thing. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WINNERS.map((project) => {
            const hsk = HSK.slots.find((s) => s.slug === project.slug);
            return (
              <PrizeCard
                key={project.slug}
                project={project}
                place={project.place}
                prize={RESULTS.prize.each}
                token={RESULTS.prize.token}
                also={
                  hsk && {
                    label: t(RESULTS_COPY.alsoHsk).replace('{n}', String(hsk.place)),
                    href: '#hashkey',
                  }
                }
                t={t}
              />
            );
          })}
        </div>
      </Section>

      {/* The title sponsor's own track, judged separately from the EAG prize.
          The three places stood open and dashed on this page for two days
          after EAG's were announced, so a builder who entered this track could
          see the result was still coming; they are filled now. The recording
          of the weekend used to sit between the two podiums — it lives on the
          campaign page, where it is the event, not on the results. */}
      <Section
        id="hashkey"
        eyebrow={HSK.sponsor}
        title={t(RESULTS_COPY.hskTitle)}
        lead={t(HSK_ANNOUNCED ? RESULTS_COPY.hskLeadAnnounced : RESULTS_COPY.hskLeadPending)}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HSK.slots.map((slot) => {
            const project = slot.slug ? projectBySlug(slot.slug) : null;
            return (
              <PrizeCard
                key={slot.place}
                project={project}
                place={slot.place}
                prize={slot.prize}
                token={HSK.token}
                also={
                  project?.place
                    ? {
                        label: t(RESULTS_COPY.alsoEag).replace('{n}', String(project.place)),
                        href: '#podium',
                      }
                    : undefined
                }
                t={t}
              />
            );
          })}
        </div>

        <p className="mt-6 text-sm text-content-muted">
          {HSK_ANNOUNCED
            ? t(RESULTS_COPY.hskStacked).replace('{n}', String(HSK_STACKED))
            : t(RESULTS_COPY.hskCumulative)}
        </p>

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

      <Section id="projects" title={t(RESULTS_COPY.othersTitle)} lead={othersLead(locale)}>
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
