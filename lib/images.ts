/**
 * Poster paths and `next/image`.
 *
 * Two problems, both fixed here, both of which made the events grid look broken:
 *
 * **Weight.** The posters are the original artwork — PNGs up to 3.5 MB, 35 MB in
 * the folder. Served raw through a plain `<img>`, one events page pulled 31.6 MB.
 * The images were not failing; they were arriving too late to look like they had
 * arrived at all. `next/image` re-encodes to WebP/AVIF at the size actually
 * displayed, which is roughly 3.5 MB → 40 KB per card.
 *
 * **Filenames.** They used to be the artwork names: spaces, `#`, `+`, `&`.
 * `next/image` percent-decodes the `url` parameter before fetching, so `#` became
 * a URL fragment and truncated the path — `…Meetup #1 + Ethereum Birthday…png`
 * resolved to `…Meetup ` and 400'd. The old static site hit the same class of bug
 * and worked around it with `encodeURIComponent`; a workaround only holds until
 * the next consumer forgets. The files are now named `YYYY-MM-DD-title.ext`,
 * lowercase, hyphens only, and `public.events.poster_path` points at those.
 *
 * So there is nothing left to encode or decode, and this module deliberately does
 * no transformation — it only guards against a path that predates the rename.
 */

/** Matches the naming rule every poster now follows. */
const SAFE_PATH = /^\/[A-Za-z0-9/_-]+\.[A-Za-z0-9]+$/;

/**
 * Returns a path safe to hand to `next/image`, or null.
 *
 * A path containing a percent escape is one the rename missed — most likely a row
 * edited in the CMS by pasting an old URL. Returning null shows the card's "ETH
 * Cali" placeholder, which is a visible prompt to fix the row rather than a 400
 * in the network tab that nobody looks at.
 */
export function posterSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  return SAFE_PATH.test(path) ? path : null;
}

/**
 * `sizes` for a poster inside the three-column event grid.
 *
 * Without this the browser assumes the image fills the viewport and fetches the
 * largest candidate, which puts the weight problem straight back on a phone.
 */
export const GRID_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw';

/** `sizes` for the single large poster on a detail page. */
export const DETAIL_SIZES = '(min-width: 1024px) 320px, 92vw';
