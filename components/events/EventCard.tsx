import Link from 'next/link';
import Image from 'next/image';
import type { EventRecord } from '../../types/content';
import { localized } from '../../types/content';
import { formatDateRange, type Locale, translator } from '../../lib/i18n';
import { posterSrc, GRID_SIZES } from '../../lib/images';

/**
 * One event in a grid. The whole card is the link — this is the thing the old
 * site did not have: an event you can open, share, and land on directly.
 */
export default function EventCard({ event, locale }: { event: EventRecord; locale: Locale }) {
  const t = translator(locale);
  const name = localized(event as unknown as Record<string, unknown>, 'name', locale) ?? event.slug;
  const poster = posterSrc(event.poster_path);
  const summary = localized(event as unknown as Record<string, unknown>, 'summary', locale);

  // Hackathons and hacker houses have a richer page of their own.
  const base = event.kind === 'hackathon' || event.kind === 'hacker_house' ? '/hackathons' : '/events';

  return (
    <Link
      href={`${base}/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab transition-colors hover:border-line-brand"
    >
      {/* Fixed aspect ratio so a missing poster leaves a tidy block rather than
          collapsing the card and making the grid jump. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-inset">
        {poster ? (
          <Image
            src={poster}
            alt=""
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

        <h3 className="text-base font-bold leading-snug text-content-primary">{name}</h3>

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
