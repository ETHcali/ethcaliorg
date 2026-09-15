/**
 * Meta descriptions for event pages.
 *
 * 47 of the 48 events in the CMS have no summary in either language, so every
 * detail page fell back to `Kind · Date · City` — around 30 characters, and
 * identical for any two events of the same kind in the same month. Two pages
 * shared a description outright.
 *
 * A summary written by a human still wins and is used whenever there is one.
 * This is what to write when there is not: a sentence built from the fields that
 * are always populated — what we did, what it was, where, and when — which is
 * unique per event because the name and the date are in it.
 *
 * The right long-term fix is summaries in the CMS. This stops the pages being
 * invisible in the meantime, and quietly stops applying to each event as soon as
 * someone writes one.
 */
import { formatDateRange, type Locale } from './i18n';
import type { EventRecord } from '../types/content';

/** What ETH Cali did, as a verb rather than the noun the UI badge uses. */
const ROLE_VERB: Record<string, { es: string; en: string }> = {
  host: { es: 'Organizamos', en: 'ETH Cali hosted' },
  cohost: { es: 'Coorganizamos', en: 'ETH Cali co-hosted' },
  colab: { es: 'Colaboramos en', en: 'ETH Cali collaborated on' },
  participant: { es: 'Participamos en', en: 'ETH Cali took part in' },
  volunteering: { es: 'Hicimos voluntariado en', en: 'ETH Cali volunteered at' },
};

/** The kind, as it reads mid-sentence with an article. */
const KIND_PHRASE: Record<string, { es: string; en: string }> = {
  meetup: { es: 'un meetup', en: 'a meetup' },
  workshop: { es: 'un taller', en: 'a workshop' },
  hackathon: { es: 'un hackathon', en: 'a hackathon' },
  conference: { es: 'una conferencia', en: 'a conference' },
  hacker_house: { es: 'una hacker house', en: 'a hacker house' },
  volunteering: { es: 'una jornada de voluntariado', en: 'a volunteering day' },
  other: { es: 'un evento', en: 'an event' },
};

export function eventDescription(
  event: EventRecord & { venue?: { name: string } | null },
  name: string,
  summary: string | null,
  locale: Locale
): string {
  if (summary && summary.trim()) return summary.trim();

  const verb = (ROLE_VERB[event.role] ?? ROLE_VERB.host)[locale];
  const kind = (KIND_PHRASE[event.kind] ?? KIND_PHRASE.other)[locale];
  const date = formatDateRange(event.starts_on, event.ends_on, locale);
  const city = event.city;

  const where = city
    ? locale === 'en'
      ? ` in ${city}`
      : ` en ${city}`
    : '';

  const head =
    locale === 'en'
      ? `${verb} ${name}, ${kind}${where} on ${date}.`
      : `${verb} ${name}, ${kind}${where}, ${date}.`;

  const venue = event.venue?.name
    ? locale === 'en'
      ? ` Venue: ${event.venue.name}.`
      : ` Sede: ${event.venue.name}.`
    : '';

  return clamp(`${head}${venue}`);
}

/**
 * Keep a description inside what a result page will actually render.
 *
 * Cuts on a word boundary rather than mid-word, and only when there is
 * something to cut — a sentence that already fits is returned untouched.
 */
export function clamp(text: string, max = 158): string {
  const s = text.replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[.,;:—-]$/, '')}…`;
}
