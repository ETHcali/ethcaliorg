import { useState } from 'react';
import Image from 'next/image';
import { WORLD_PATH } from './world-path';
import {
  TOUR_STOPS,
  MISSION_STOPS,
  TOUR_MAP_COPY,
  type TourStop,
  type Bilingual,
} from '../../content/builders-tour';
import type { Locale } from '../../lib/i18n';

const W = 1000;
const H = 500;

/**
 * Equirectangular, which is why this needs no projection library: the mapping
 * from degrees to viewBox units is linear, and the committed world path was
 * generated with exactly this formula.
 */
const x = (lng: number) => ((lng + 180) / 360) * W;
const y = (lat: number) => ((90 - lat) / 180) * H;

/**
 * Every stop the tour has landed on, as a map you can open.
 *
 * The map is cropped to the Atlantic band rather than showing the whole globe.
 * All five stops sit between roughly 30°N and 30°S, so a full world view spends
 * most of its pixels on empty ocean and Siberia, and shrinks the markers to
 * nothing on a phone. The crop is a viewBox, not a different projection — the
 * same arithmetic places every marker.
 */
export default function TourMap({ locale }: { locale: Locale }) {
  const t = (b: Bilingual) => b[locale];
  const [selected, setSelected] = useState<TourStop | null>(
    TOUR_STOPS.find((s) => s.upcoming) ?? null
  );
  // Zoom is a separate piece of state from selection: hovering should preview a
  // stop without yanking the map around under the pointer. Only a click zooms.
  const [zoomed, setZoomed] = useState<TourStop | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  // Every point, tour and mission, so the frame covers Sydney and Shenzhen as
  // readily as Cali. Computed rather than hardcoded for exactly that reason.
  const ALL = [...TOUR_STOPS, ...MISSION_STOPS];
  const xs = ALL.map((s) => x(s.lng));
  const ys = ALL.map((s) => y(s.lat));
  const padX = 130;
  const padY = 70;
  const minX = Math.max(0, Math.min(...xs) - padX);
  const maxX = Math.min(W, Math.max(...xs) + padX);
  const minY = Math.max(0, Math.min(...ys) - padY);
  const maxY = Math.min(H, Math.max(...ys) + padY);
  const wide = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };

  // Zoomed frame keeps the wide frame's aspect ratio, so the SVG box never
  // changes shape and the surrounding layout does not jump on click.
  const ZOOM = 2.2;
  const zoomW = wide.w / ZOOM;
  const zoomH = wide.h / ZOOM;
  const view = zoomed
    ? {
        x: Math.min(Math.max(x(zoomed.lng) - zoomW / 2, 0), W - zoomW),
        y: Math.min(Math.max(y(zoomed.lat) - zoomH / 2, 0), H - zoomH),
        w: zoomW,
        h: zoomH,
      }
    : wide;
  const viewBox = `${view.x} ${view.y} ${view.w} ${view.h}`;

  // Marker geometry is in viewBox units, so it shrinks as the frame shrinks.
  // Dividing by the zoom factor keeps dots and labels the same on-screen size.
  const k = view.w / wide.w;

  const isZoomed = Boolean(zoomed && selected && zoomed.city === selected.city);
  const embedUrl = selected?.lumaEmbedId
    ? `https://lu.ma/embed/event/${selected.lumaEmbedId}/simple`
    : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-card border border-line-hairline bg-surface-slab">
        <svg
          viewBox={viewBox}
          className="h-auto w-full transition-[view-box] duration-slow"
          style={{ transition: 'all 480ms var(--ease)' }}
          role="img"
          aria-label={t(TOUR_MAP_COPY.title)}
        >
          <path d={WORLD_PATH} fill="var(--surface-ridge)" stroke="none" />

          {ALL.map((stop) => {
            const cx = x(stop.lng);
            const cy = y(stop.lat);
            const isSelected = selected?.city === stop.city;
            // Three states, three colours: green is the one you can still
            // attend, amber is where the winners go, blue is already run.
            const colour = stop.upcoming
              ? 'var(--signal-confirmed)'
              : stop.isMission
                ? 'var(--signal-pending)'
                : 'var(--eth-blue-text)';

            return (
              <g
                key={stop.city}
                onClick={() => {
                  setSelected(stop);
                  // Clicking the stop you are already zoomed into pulls back out.
                  setZoomed((z) => (z?.city === stop.city ? null : stop));
                }}
                onMouseEnter={() => setSelected(stop)}
                className="cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                onFocus={() => setFocused(stop.city)}
                onBlur={() => setFocused(null)}
                aria-label={`${stop.city}, ${t(stop.country)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(stop);
                    setZoomed((z) => (z?.city === stop.city ? null : stop));
                  }
                }}
              >
                {/* The upcoming stop pulses. Nothing else on the map moves, so
                    the one animated thing is the one you can still attend. */}
                {stop.upcoming && (
                  <circle cx={cx} cy={cy} r={14 * k} fill={colour} opacity={0.18}>
                    <animate
                      attributeName="r"
                      values={`${10 * k};${22 * k};${10 * k}`}
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.28;0;0.28"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Generous transparent hit area — the visible dot is 5px in
                    viewBox units, which is an unhittable target on a phone. */}
                <circle cx={cx} cy={cy} r={22 * k} fill="transparent" />

                {focused === stop.city && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={13 * k}
                    fill="none"
                    stroke="var(--eth-blue-lift)"
                    strokeWidth={2 * k}
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={(isSelected ? 8 : 5.5) * k}
                  fill={stop.isMission ? 'var(--surface-slab)' : colour}
                  stroke={stop.isMission ? colour : 'var(--surface-slab)'}
                  strokeWidth={(stop.isMission ? 2.5 : 2) * k}
                  className="transition-all"
                />

                <text
                  x={cx}
                  y={stop.labelBelow ? cy + 22 * k : cy - 14 * k}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill={isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}
                  style={{ font: `600 ${(isSelected ? 15 : 13) * k}px var(--font-sans)` }}
                >
                  {stop.city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* The detail panel. Always shows something — it opens on the upcoming
          stop — so the map never reads as inert on first paint. */}
      <div className="rounded-card border border-line-hairline bg-surface-slab p-5">
        {selected ? (
          <>
            {/* The live event replaces the poster once you have committed to a
                stop by clicking it. Loading it only on zoom is deliberate: five
                Luma iframes on first paint is five third-party page loads for a
                panel showing one of them. */}
            {isZoomed && embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${selected.city} — Luma`}
                loading="lazy"
                className="mb-4 h-[420px] w-full rounded-chip border border-line-hairline bg-surface-inset"
              />
            ) : (
              selected.image && (
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-chip bg-surface-inset">
                  <Image
                    src={selected.image}
                    alt={selected.city}
                    fill
                    sizes="(min-width: 1024px) 320px, 92vw"
                    className="object-cover"
                  />
                </div>
              )
            )}

            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                selected.upcoming
                  ? 'bg-signal-confirmed/15 text-signal-confirmed'
                  : selected.isMission
                    ? 'bg-signal-pending/15 text-signal-pending'
                    : 'bg-surface-ridge text-content-muted'
              }`}
            >
              {selected.isMission
                ? t(TOUR_MAP_COPY.mission)
                : selected.upcoming
                  ? t(TOUR_MAP_COPY.next)
                  : t(TOUR_MAP_COPY.done)}
            </span>

            <h3 className="mt-3 text-lg font-bold text-content-primary">{selected.city}</h3>
            <p className="text-sm text-content-muted">{t(selected.country)}</p>
            {selected.dates && (
              <p className="mono mt-2 text-sm text-content-secondary">{t(selected.dates)}</p>
            )}
            {selected.host && (
              <p className="mt-1 text-xs text-content-faint">
                {t(TOUR_MAP_COPY.cohost)} <span className="mono">{selected.host}</span>
              </p>
            )}

            {selected.lumaUrl && (
              <a
                href={selected.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 inline-flex min-h-tap items-center rounded-control px-4 text-sm font-bold transition-colors ${
                  selected.upcoming
                    ? 'bg-eth-blue text-on-brand hover:bg-eth-blue-lift'
                    : 'border border-line-strong text-content-primary hover:border-eth-blue hover:bg-eth-blue-wash'
                }`}
              >
                {t(TOUR_MAP_COPY.openLuma)} →
              </a>
            )}

            {zoomed && (
              <button
                type="button"
                onClick={() => setZoomed(null)}
                className="mt-3 block text-sm text-content-muted transition-colors hover:text-content-primary"
              >
                ← {t(TOUR_MAP_COPY.back)}
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
