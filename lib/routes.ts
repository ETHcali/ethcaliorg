/**
 * Where an event's page lives.
 *
 * Three places used to work this out for themselves — the card in a grid, the
 * `Event` JSON-LD, and the sitemap — each with its own copy of "hackathons and
 * hacker houses go to /hackathons, everything else to /events". Three copies of
 * a rule is three chances to disagree about a URL, and a sitemap that disagrees
 * with a link is worse than either alone: it tells a crawler the two are
 * different pages.
 */
import type { EventRecord } from '../types/content';

/**
 * Events whose real page is not at the route their kind implies.
 *
 * The Builders Tour is the only one, and it is here because the campaign page
 * came first. `/builders-tour` is what the ad spend pointed at, what its og:url
 * says, and what carries the schedule, the sponsors, the prizes and the
 * results; the CMS row for the same weekend is a stub whose own "external link"
 * pointed back here. One hackathon, one URL — this is the one.
 *
 * `next.config.js` 308s the CMS route to the same place, so the URL that was
 * published still resolves rather than 404ing.
 */
const CANONICAL: Record<string, string> = {
  'ethereum-builders-tour-cali': '/builders-tour',
};

const RICHER = new Set(['hackathon', 'hacker_house']);

export function eventRoute(slug: string, kind: EventRecord['kind'] | string): string {
  return CANONICAL[slug] ?? `${RICHER.has(kind) ? '/hackathons' : '/events'}/${slug}`;
}

/** True when this slug's page is somewhere else, so /hackathons/<slug> must not be built. */
export function hasCanonicalOverride(slug: string): boolean {
  return slug in CANONICAL;
}
