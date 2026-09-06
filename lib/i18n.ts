/**
 * Translations.
 *
 * Next's i18n routing gives us the locale; this maps it to a string table. Keys
 * fall back to Spanish when a locale is missing a string, and to the key itself
 * if neither has it — a visible `events.title` in the UI is a bug report, which
 * is more useful than an empty element.
 */
import es from '../locales/es.json';
import en from '../locales/en.json';

export type Locale = 'es' | 'en';

const TABLES: Record<Locale, unknown> = { es, en };

export function isLocale(value: string | undefined): value is Locale {
  return value === 'es' || value === 'en';
}

export function asLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : 'es';
}

function lookup(table: unknown, path: string): string | null {
  let node: unknown = table;
  for (const part of path.split('.')) {
    if (typeof node !== 'object' || node === null) return null;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : null;
}

/** `t('events.heading')` for the given locale, falling back to Spanish. */
export function translator(locale: Locale) {
  return (path: string): string =>
    lookup(TABLES[locale], path) ?? lookup(TABLES.es, path) ?? path;
}

/**
 * Dates render in the reader's locale but always in Colombia's timezone.
 * `starts_on` is a bare date; parsing it as UTC and formatting in local time
 * shifts it a day backwards for anyone west of Greenwich, which silently moved
 * events into the wrong month on the old site.
 */
export function formatDate(iso: string, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-CO', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  });
}

/**
 * "19 – 20 de septiembre de 2026", or just the start when there is no end.
 *
 * Collapses the shared part of the range rather than repeating it. Without the
 * same-month case a two-day event reads "19 de septiembre – 20 de septiembre de
 * 2026", which is what a machine writes and no one says.
 */
export function formatDateRange(start: string, end: string | null, locale: Locale): string {
  if (!end || end === start) return formatDate(start, locale);

  // Same month: "19 – 20 de septiembre de 2026".
  if (start.slice(0, 7) === end.slice(0, 7)) {
    return `${Number(start.slice(8, 10))} – ${formatDate(end, locale)}`;
  }

  // Same year, different month: drop the repeated year from the start only.
  if (start.slice(0, 4) === end.slice(0, 4)) {
    return `${formatDate(start, locale, { year: undefined })} – ${formatDate(end, locale)}`;
  }

  // Different years: both must carry their own, or "30 December – 2 January 2026"
  // reads as 30 December 2026.
  return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
}
