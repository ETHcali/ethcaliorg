/**
 * A URL that is safe to put in an `href`.
 *
 * Every outbound link on this site whose address comes from the CMS — a venue's
 * maps_url, a POAP, an NFT, a partner's site, an event's recap — is a string
 * someone typed into a form. Escaping it for HTML is not enough on its own:
 * `javascript:alert(1)` contains no HTML-special character, so it survives
 * escaping untouched and becomes a script that runs on click.
 *
 * React escapes an attribute value but does not refuse a scheme, so this matters
 * in JSX as well as in the one place the site builds markup by hand (the
 * Leaflet popup on /venues, which has no JSX to hide behind).
 *
 * The admin UI that writes these rows is gated by ADMIN_ROLE on chain, which
 * narrows who could set such a value — it does not make the value trustworthy.
 * The architecture rule this repo runs on says the database is an index and a
 * presentation layer and is never authoritative; a URL out of it is data, and
 * data gets checked at the point of use.
 *
 * Returns null for anything that is not http(s), including a malformed string,
 * so a caller can render nothing rather than a broken or hostile link.
 */
export function httpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : null;
  } catch {
    // Not absolute, so not something to send a visitor to a third party for.
    return null;
  }
}
