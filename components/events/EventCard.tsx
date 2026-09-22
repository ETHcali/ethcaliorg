import Link from 'next/link';
import Image from 'next/image';
import type { EventRecord } from '../../types/content';
import { localized } from '../../types/content';
import { formatDateRange, type Locale, translator } from '../../lib/i18n';
import { posterSrc, GRID_SIZES } from '../../lib/images';
import { eventRoute } from '../../lib/routes';

/**
 * One event in a grid. The whole card is the link — this is the thing the old
 * site did not have: an event you can open, share, and land on directly.
 */
export default function EventCard({
  event,
  locale,
  headingLevel = 3,
}: {
  event: EventRecord;
  locale: Locale;
  /**
   * The card title's level. On a listing page the grid is the only thing under
   * the h1, so the cards are h2; on the home page they sit under a Section's own
   * h2 and stay h3. Hardcoding 3 made every listing page skip h1 → h3.
   */
  headingLevel?: 2 | 3;
}) {
  const Heading = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  const t = translator(locale);
  const name = localized(event as unknown as Record<string, unknown>, 'name', locale) ?? event.slug;
  const poster = posterSrc(event.poster_path);
  const summary = localized(event as unknown as Record<string, unknown>, 'summary', locale);

  return (
    <Link
      href={eventRoute(event.slug, event.kind)}
      className="group flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab transition-colors hover:border-line-brand"
    >
      {/* Fixed aspect ratio so a missing poster leaves a tidy block rather than
          collapsing the card and making the grid jump. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-inset">
        {poster ? (
          <Image
            src={poster}
            // The poster is the event's own artwork, not decoration — it is the
            // thing people recognise and the only way these turn up in image
            // search. It was alt="" across 36 cards on the events list alone.
            alt={name}
            fill
            sizes={GRID_SIZES}
            className="object-cover transition-transform duration-slow group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[11px] uppercase tracking-widest text-content-faint">
              ETH Cali
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide">
          <span className="rounded-full bg-eth-blue-wash px-2 py-0.5 text-eth-blue-text">
            {t(`kind.${event.kind}`)}
          </span>
          <span className="text-content-faint">{t(`role.${event.role}`)}</span>
        </div>

        <Heading className="text-base font-bold leading-snug text-content-primary">{name}</Heading>

        <p className="mono text-xs text-content-muted">
          {formatDateRange(event.starts_on, event.ends_on, locale)}
          {event.city && ` · ${event.city}`}
        </p>

        {summary && (
          <p className="line-clamp-3 text-sm text-content-secondary">{summary}</p>
        )}
      </div>
    </Link>
  );
}
