/**
 * Structured data.
 *
 * Schema.org records for the two things a crawler can actually do something
 * with here: who ETH Cali is, and when each event was. An `Event` record is what
 * puts a date, a place and a name into a Google result rather than a blue link,
 * which for an organisation whose output is ~90 past events is the difference
 * between being indexed and being found.
 *
 * Everything here is derived from typed rows. Nothing takes free text from a
 * query string, and `Seo` escapes `<` before writing it into the script tag.
 */
import { SITE, BRAND, SAME_AS, absoluteUrl } from './seo';
import type { EventDetail } from '../types/content';
import { localized } from '../types/content';

/** Schema.org wants a stable node id so records can reference each other. */
const ORG_ID = `${SITE}/#organization`;

export function organizationJsonLd(locale: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND,
    alternateName: 'Fundación Innovación del Pacífico',
    url: absoluteUrl('/', locale),
    logo: `${SITE}/branding/ethcali-horizontal-light.png`,
    description:
      locale === 'en'
        ? 'The Ethereum community of Cali, Colombia. Meetups, workshops, hackathons and the builders behind them.'
        : 'La comunidad Ethereum de Cali, Colombia. Meetups, workshops, hackathons y la gente que los construye.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cali',
      addressRegion: 'Valle del Cauca',
      addressCountry: 'CO',
    },
    sameAs: [...SAME_AS],
  };
}

/** `kind` maps onto the one Schema.org subtype that is not a lie. */
const EVENT_TYPE: Record<string, string> = {
  hackathon: 'Hackathon',
  workshop: 'EducationEvent',
  conference: 'BusinessEvent',
  meetup: 'SocialEvent',
  hacker_house: 'SocialEvent',
  volunteering: 'SocialEvent',
};

/**
 * One event.
 *
 * `endDate` falls back to `startDate` because Schema.org treats a missing end as
 * an open-ended event, which a one-day meetup is not. `eventStatus` and
 * `eventAttendanceMode` are stated outright: Google warns on their absence, and
 * every one of these was a real event people physically attended.
 */
export function eventJsonLd(event: EventDetail, locale: string): Record<string, unknown> {
  const name = localized(event as unknown as Record<string, unknown>, 'name', locale) ?? event.slug;
  const summary = localized(event as unknown as Record<string, unknown>, 'summary', locale);
  const route = `${event.kind === 'hackathon' || event.kind === 'hacker_house' ? '/hackathons' : '/events'}/${event.slug}`;

  const location = event.venue
    ? {
        '@type': 'Place',
        name: event.venue.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.city ?? 'Cali',
          addressCountry: event.country ?? 'CO',
        },
        ...(event.venue.lat && event.venue.lng
          ? { geo: { '@type': 'GeoCoordinates', latitude: event.venue.lat, longitude: event.venue.lng } }
          : {}),
      }
    : {
        '@type': 'Place',
        name: event.city ?? 'Cali',
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.city ?? 'Cali',
          addressCountry: event.country ?? 'CO',
        },
      };

  return {
    '@context': 'https://schema.org',
    '@type': EVENT_TYPE[event.kind] ?? 'Event',
    name,
    url: absoluteUrl(route, locale),
    startDate: event.starts_on,
    endDate: event.ends_on ?? event.starts_on,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(summary ? { description: summary } : {}),
    ...(event.poster_path ? { image: `${SITE}${event.poster_path}` } : {}),
    location,
    // Named inline rather than as a bare {'@id'} reference: a crawler parsing
    // this page on its own never sees the homepage's Organization node, and a
    // dangling @id resolves to nothing. The id is kept so the two do link up
    // for anything that reads the whole site.
    organizer: { '@type': 'Organization', '@id': ORG_ID, name: BRAND, url: SITE },
    ...(event.registration_url
      ? {
          offers: {
            '@type': 'Offer',
            url: event.registration_url,
            price: '0',
            priceCurrency: 'COP',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}
