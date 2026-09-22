import { useEffect, useRef } from 'react';
import type { VenueRecord } from '../../types/content';
import type { Locale } from '../../lib/i18n';
import { httpUrl } from '../../lib/url';

/**
 * The venues, on a map of Cali.
 *
 * The static site had this and the rebuild dropped it, which left `venues.lat`
 * and `venues.lng` as columns nothing read — sixteen pairs of coordinates
 * carried by the CMS and rendered nowhere.
 *
 * Leaflet, imported inside the effect rather than at module scope. It touches
 * `window` on import and would break the build otherwise, and importing it here
 * keeps 144KB out of every other page's bundle: only someone who opens /venues
 * pays for it.
 *
 * OpenStreetMap's own tiles, keyless, darkened in CSS rather than fetched
 * pre-darkened. CARTO's dark basemap was the obvious choice and is what this
 * first used — it now stamps "API KEY REQUIRED" across every tile for anyone
 * without an account, which is a watermark across a page about where our
 * community meets. OSM standard tiles need no key; they are light and colourful,
 * so `.leaflet-tile-pane` inverts them in globals.css. The markers sit in a
 * different pane and are not touched by it.
 *
 * Attribution is required and is in the control Leaflet puts in the corner.
 */
export default function VenueMap({
  venues,
  locale,
}: {
  venues: readonly VenueRecord[];
  locale: Locale;
}) {
  const el = useRef<HTMLDivElement>(null);
  // The Leaflet instance, so a re-render or a fast-refresh does not leave a
  // second map initialised over the first — Leaflet throws "Map container is
  // already initialized" and the page dies.
  const map = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !el.current || map.current) return;

      const pins = venues.filter(
        (v) => v.lat != null && v.lng != null && !Number.isNaN(Number(v.lat))
      );
      if (!pins.length) return;

      const instance = L.map(el.current, {
        // A city map inside a scrolling page: a wheel over it should scroll the
        // page, not zoom the map, or reading the page becomes a trap. Ctrl and
        // the +/− buttons still zoom.
        scrollWheelZoom: false,
        attributionControl: true,
      });
      map.current = instance;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(instance);

      for (const v of pins) {
        const marker = L.circleMarker([Number(v.lat), Number(v.lng)], {
          radius: 7,
          // --eth-blue and --surface-void, written out because Leaflet draws
          // into an SVG it owns and never sees our stylesheet.
          color: '#2B23EF',
          weight: 2,
          fillColor: '#2B23EF',
          fillOpacity: 0.55,
        }).addTo(instance);

        const open = locale === 'en' ? 'Open in Maps' : 'Ver en Maps';
        // `httpUrl` and not just `escapeHtml`. This is the one place on the site
        // that builds markup by hand, and escaping alone would have let a
        // `javascript:` address straight into the href — it contains no
        // HTML-special character, so escaping passes it through untouched.
        const maps = httpUrl(v.maps_url);
        marker.bindPopup(
          `<strong>${escapeHtml(v.name)}</strong>` +
            (v.kind ? `<br><span class="venue-kind">${escapeHtml(v.kind)}</span>` : '') +
            (maps
              ? `<br><a href="${escapeHtml(maps)}" target="_blank" rel="noopener noreferrer">${open} →</a>`
              : '')
        );
      }

      instance.fitBounds(
        L.latLngBounds(pins.map((v) => [Number(v.lat), Number(v.lng)] as [number, number])),
        { padding: [40, 40], maxZoom: 14 }
      );
    })();

    return () => {
      cancelled = true;
      const m = map.current as { remove?: () => void } | null;
      m?.remove?.();
      map.current = null;
    };
  }, [venues, locale]);

  return (
    <div
      ref={el}
      // A fixed height, like the Maps and Luma embeds. A map has no intrinsic
      // aspect ratio — it shows whatever fits — so the box decides, not the
      // content.
      className="h-[420px] w-full overflow-hidden rounded-card border border-line-hairline bg-surface-inset"
      role="application"
      aria-label={locale === 'en' ? 'Map of our venues in Cali' : 'Mapa de nuestros lugares en Cali'}
    />
  );
}

/**
 * The names come from the CMS and go into a Leaflet popup as raw HTML.
 *
 * Single quotes are escaped too. Every attribute here is double-quoted so they
 * cannot break out today, but that is a property of this template rather than
 * of the function, and the next person to use it should not have to check.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
