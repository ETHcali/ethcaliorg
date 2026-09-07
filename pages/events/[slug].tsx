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

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-content-secondary">{children}</dd>
    </div>
  );
}

function LinkChip({ href, children }: { href: string; children: React.ReactNode }) {
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
 * One event, at its own URL.
 *
 * This page is the point of the whole migration. The old site rendered event
 * detail into a modal, so nothing was linkable, shareable or indexable, and every
 * share fell back to the site banner. Here each event has a canonical URL and
 * its own og:image.
 */
export default function EventPage({ event, locale }: Props) {
  const t = translator(locale);
  const row = event as unknown as Record<string, unknown>;
  const name = localized(row, 'name', locale) ?? event.slug;
  const summary = localized(row, 'summary', locale);
  const body = localized(row, 'body', locale);
  const poster = posterSrc(event.poster_path);

  const links: { href: string; label: string }[] = [
    [event.registration_url, t('events.register')],
    [event.social_url, t('events.social')],
    [event.recap_url, t('events.recap')],
    [event.photos_url, t('events.photos')],
    [event.youtube_url, t('events.video')],
  ]
    .filter(([href]) => Boolean(href))
    .map(([href, label]) => ({ href: href as string, label: label as string }));

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
        path={`/events/${event.slug}`}
        image={event.poster_path}
        type="article"
      />

      <article className="mx-auto max-w-page px-gutter py-10">
        <Link
          href="/events"
          className="mono text-xs text-content-muted transition-colors hover:text-content-primary"
        >
          ← {t('events.back')}
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

            {summary && (
              <p className="mt-4 max-w-prose text-base text-content-secondary">{summary}</p>
            )}

            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <Fact label={t('events.date')}>
                {formatDateRange(event.starts_on, event.ends_on, locale)}
              </Fact>

              {(event.venue || event.city) && (
                <Fact label={t('events.venue')}>
                  {event.venue?.maps_url || event.location_url ? (
                    <a
                      href={(event.venue?.maps_url ?? event.location_url) as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eth-blue-text hover:underline"
                    >
                      {event.venue?.name ?? event.city}
                    </a>
                  ) : (
                    event.venue?.name ?? event.city
                  )}
                  {event.city && event.venue?.name && ` · ${event.city}`}
                </Fact>
              )}

              {event.rsvp_count !== null && (
                <Fact label={t('events.attendees')}>
                  <span className="mono">{event.rsvp_count}</span>
                </Fact>
              )}
            </dl>
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

        {body && (
          <div className="mt-10 max-w-prose whitespace-pre-line text-base leading-relaxed text-content-secondary">
            {body}
          </div>
        )}

        {links.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t('events.links')}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map((l) => (
                <LinkChip key={l.href} href={l.href}>
                  {l.label}
                </LinkChip>
              ))}
            </div>
          </section>
        )}

        {event.poaps.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t('events.poaps')}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {event.poaps.map((p) => (
                <LinkChip key={p.id} href={p.poap_url}>
                  POAP
                  {/* A copied count, not a live one — stated plainly rather than
                      shown as though it were read from the chain. */}
                  {p.collectors !== null && (
                    <span className="mono ml-2 text-content-faint">
                      {p.collectors} {t('events.collectors')}
                    </span>
                  )}
                </LinkChip>
              ))}
            </div>
          </section>
        )}

        {event.nfts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {t('events.nfts')}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {event.nfts.map((n) =>
                n.nft_url ? (
                  <LinkChip key={n.id} href={n.nft_url}>
                    {n.protocol ?? 'NFT'}
                    {n.mints !== null && (
                      <span className="mono ml-2 text-content-faint">
                        {n.mints} {t('events.mints')}
                      </span>
                    )}
                  </LinkChip>
                ) : (
                  <span
                    key={n.id}
                    className="inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs text-content-muted"
                  >
                    {n.protocol ?? 'NFT'}
                  </span>
                )
              )}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['es'] }) => {
  // Hackathons and hacker houses live at /hackathons/<slug> and are excluded
  // here. Building them at both paths gave one event two URLs, each declaring
  // itself canonical — which is the duplicate-content problem, self-inflicted.
  const [all, hackathons, houses] = await Promise.all([
    getEventSlugs(),
    getEventSlugs('hackathon'),
    getEventSlugs('hacker_house'),
  ]);
  const elsewhere = new Set([...hackathons, ...houses]);

  const slugs = all.filter((slug) => !elsewhere.has(slug));

  return {
    // Every locale is named explicitly. A path without a `locale` is prerendered
    // for the default locale only, leaving /en/events/<slug> to be built on
    // first request — which works, but means the English pages are never built
    // in CI and so are never verified.
    paths: locales.flatMap((locale) => slugs.map((slug) => ({ params: { slug }, locale }))),
    // An event published in the CMS after this build should resolve on first
    // request rather than 404 until the next deploy.
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params, locale }) => {
  const slug = String(params?.slug ?? '');
  const event = await getEvent(slug);

  // An unpublished or deleted event 404s. RLS already hides drafts from the anon
  // key, so this is the same check from two directions.
  if (!event) return { notFound: true, revalidate: 60 };

  // fallback:'blocking' means this path is still reachable for a hackathon —
  // by an old link, or by anything guessing the URL. Redirect rather than
  // render, so there is exactly one canonical page per event.
  if (event.kind === 'hackathon' || event.kind === 'hacker_house') {
    return {
      redirect: { destination: `/hackathons/${event.slug}`, permanent: true },
      revalidate: 60,
    };
  }

  return {
    props: { event, locale: asLocale(locale) },
    // CMS edits appear within a minute without a redeploy.
    revalidate: 60,
  };
};
