import { useMemo, useState } from 'react';
import type { EventRecord } from '../../types/content';
import { type Locale, translator } from '../../lib/i18n';
import EventCard from './EventCard';

/**
 * A filterable grid.
 *
 * Filtering by year rather than month: the old site offered twelve month
 * buttons across four years of data, so "Marzo" mixed 2023 and 2025 and most
 * buttons returned one or two rows. Years are how anyone actually looks for
 * one of these.
 */
export default function EventGrid({
  events,
  locale,
}: {
  events: EventRecord[];
  locale: Locale;
}) {
  const t = translator(locale);
  const [year, setYear] = useState<string>('all');

  const years = useMemo(
    () => [...new Set(events.map((e) => e.starts_on.slice(0, 4)))].sort().reverse(),
    [events]
  );

  const shown = year === 'all' ? events : events.filter((e) => e.starts_on.startsWith(year));

  if (!events.length) {
    return <p className="text-sm text-content-muted">{t('events.empty')}</p>;
  }

  return (
    <>
      {years.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t('events.title')}>
          {['all', ...years].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              aria-pressed={year === y}
              className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-colors ${
                year === y
                  ? 'bg-eth-blue text-on-brand'
                  : 'border border-line-hairline text-content-muted hover:text-content-primary'
              }`}
            >
              {y === 'all' ? t('events.all') : y}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((event) => (
          <EventCard key={event.id} event={event} locale={locale} />
        ))}
      </div>
    </>
  );
}
