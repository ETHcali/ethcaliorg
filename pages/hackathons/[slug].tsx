import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import { getEvent, getEventSlugs } from '../../lib/content';
import type { EventDetail } from '../../types/content';
import { localized } from '../../types/content';
import { posterSrc, DETAIL_SIZES } from '../../lib/images';
import { asLocale, formatDateRange, translator, type Locale } from '../../lib/i18n';

interface Props {
  event: EventDetail;
  locale: Locale;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line-hairline bg-surface-slab p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {label}
      </p>
      <p className="mono mt-1 text-xl font-bold text-content-primary">{value}</p>
    </div>
  );
}

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {label}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-chip border border-line-hairline px-3 py-1.5 text-xs text-content-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A hackathon or hacker house, at its own URL.
 *
 * Replaces the three hand-written HTML pages that existed for exactly three of
 * the four hackathons, and that were reachable only from a dropdown in
 * navbar.html — never linked from the events pages listing those same events.
 * This template is driven by the data, so a new hackathon gets a page by being
 * entered in the CMS.
 */
export default function HackathonPage({ event, locale }: Props) {
  const t = translator(locale);
  const row = event as unknown as Record<string, unknown>;
  const name = localized(row, 'name', locale) ?? event.slug;
  const summary = localized(row, 'summary', locale);
  const body = localized(row, 'body', locale);
  const poster = posterSrc(event.poster_path);
  const h = event.hackathon;

  const stats = [
    h?.participant_count != null && { label: t('hackathons.participants'), value: String(h.participant_count) },
    h?.project_count != null && { label: t('hackathons.projects'), value: String(h.project_count) },
    h?.prize_pool && { label: t('hackathons.prizePool'), value: h.prize_pool },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Layout>
      <Seo
        title={name}
        description={
          summary ??
          `${t(`kind.${event.kind}`)} · ${formatDateRange(event.starts_on, event.ends_on, locale)}${
            event.city ? ` · ${event.city}` : ''
          }`
        }
        path={`/hackathons/${event.slug}`}
        image={event.poster_path}
        type="article"
      />

      <article className="mx-auto max-w-page px-gutter py-10">
        <Link
          href="/hackathons"
          className="mono text-xs text-content-muted transition-colors hover:text-content-primary"
        >
          ← {t('hackathons.title')}
        </Link>

        <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide">
              <span className="rounded-full bg-eth-blue-wash px-2 py-0.5 text-eth-blue-text">
                {t(`kind.${event.kind}`)}
              </span>
              <span className="text-content-faint">{t(`role.${event.role}`)}</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl">{name}</h1>

            <p className="mono mt-3 text-sm text-content-muted">
              {formatDateRange(event.starts_on, event.ends_on, locale)}
              {event.venue?.name && ` · ${event.venue.name}`}
              {event.city && ` · ${event.city}`}
            </p>

            {summary && (
              <p className="mt-4 max-w-prose text-base text-content-secondary">{summary}</p>
            )}

            {/* Who we ran it with. For the hacker houses this is ekinoxis.xyz,
                and naming the partner is the point of the relationship. */}
            {h?.partner_org && (
              <p className="mt-4 text-sm text-content-muted">
                {t('hackathons.partner')}{' '}
                {h.partner_url ? (
                  <a
                    href={h.partner_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eth-blue-text hover:underline"
                  >
                    {h.partner_org}
                  </a>
                ) : (
                  <span className="text-content-primary">{h.partner_org}</span>
                )}
              </p>
            )}
          </div>

          {poster && (
            <Image
              src={poster}
              alt=""
              width={640}
              height={640}
              sizes={DETAIL_SIZES}
              className="h-auto w-full rounded-card border border-line-hairline"
            />
          )}
        </header>

        {stats.length > 0 && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        )}

        {body && (
          <div className="mt-10 max-w-prose whitespace-pre-line text-base leading-relaxed text-content-secondary">
            {body}
          </div>
        )}

        <Chips label={t('hackathons.tracks')} items={h?.tracks ?? []} />
        <Chips label={t('hackathons.sponsors')} items={h?.sponsors ?? []} />
        <Chips label={t('hackathons.winners')} items={h?.winners ?? []} />

        {(h?.external_url || event.registration_url || event.recap_url || event.youtube_url) && (
          <section className="mt-10">
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t('events.links')}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                [h?.external_url, h?.partner_org ?? 'Web'],
                [event.registration_url, t('events.register')],
                [event.recap_url, t('events.recap')],
                [event.youtube_url, t('events.video')],
              ]
                .filter(([href]) => Boolean(href))
                .map(([href, label]) => (
                  <a
                    key={href as string}
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
                  >
                    {label as string}
                  </a>
                ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['es'] }) => {
  const [hackathons, houses] = await Promise.all([
    getEventSlugs('hackathon'),
    getEventSlugs('hacker_house'),
  ]);
  const slugs = [...hackathons, ...houses];

  return {
    // Named per locale so /en is built and verified in CI, not on first request.
    paths: locales.flatMap((locale) => slugs.map((slug) => ({ params: { slug }, locale }))),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params, locale }) => {
  const event = await getEvent(String(params?.slug ?? ''));

  // A meetup reached through /hackathons/<slug> is a wrong URL, not a page.
  // Without this check the richer template would render for any event and the
  // same content would live at two URLs.
  if (!event || (event.kind !== 'hackathon' && event.kind !== 'hacker_house')) {
    return { notFound: true, revalidate: 60 };
  }

  return { props: { event, locale: asLocale(locale) }, revalidate: 60 };
};
