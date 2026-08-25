/**
 * Venues page — reads databases/venuesethcali.csv and renders the grid, the
 * per-type counts, and the type filter.
 *
 * Rewritten onto the brand system. The previous version used emoji as venue
 * icons (🏟️, 🍸, 🔄) — the brand forbids emoji in UI, so types are labelled in
 * mono text and the loading state is the standard spinner.
 */

const VENUES_CSV = 'databases/venuesethcali.csv';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** "Club Music" → "club-music", so a type can be a data-filter value. */
const slug = (s) => String(s).toLowerCase().trim().replace(/\s+/g, '-');

function parseCsvLine(line) {
  const out = [];
  let cur = '', quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((f) => f.trim().replace(/^"|"$/g, ''));
}

function parseVenues(text) {
  // The file is saved with a UTF-8 BOM, which otherwise ends up glued to the
  // first header cell and makes the "Name" check fail.
  return text.replace(/^﻿/, '').split('\n').slice(1)
    .map((l) => l.trim()).filter(Boolean)
    .map(parseCsvLine)
    .filter((f) => f.length >= 4 && f[0] && f[0] !== 'Name')
    .map((f) => ({
      name: f[0],
      type: f[1] || 'Otro',
      status: f[2] || '',
      activities: Number(f[3]) || 0,
      url: f[4] || '',
    }));
}

function venueCard(v) {
  const isActive = v.status.toUpperCase() === 'ACTIVATED';
  return `
    <article class="logo-card venue-card" data-type="${esc(slug(v.type))}">
      <div class="card-head">
        <h3>${esc(v.name)}</h3>
        <span class="pill ${isActive ? 'pill-confirmed' : 'pill-pending'}">${isActive ? 'Activo' : 'En pausa'}</span>
      </div>
      <span class="label">${esc(v.type)}</span>
      <div class="event-meta" style="margin-top:12px">
        <span>${v.activities} ${v.activities === 1 ? 'actividad' : 'actividades'}</span>
      </div>
      ${v.url ? `<a class="card-cta" href="${esc(v.url)}" target="_blank" rel="noopener">Ver en el mapa
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
    </article>`;
}

function statsHtml(venues) {
  const byType = venues.reduce((acc, v) => (acc[v.type] = (acc[v.type] || 0) + 1, acc), {});
  const cards = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, n]) => `
      <button class="metric-card stat-card" type="button" data-type="${esc(slug(type))}">
        <div class="metric-number">${n}</div>
        <div class="metric-label">${esc(type)}</div>
      </button>`).join('');

  return `
    <div class="metrics-grid">
      <button class="metric-card stat-card" type="button" data-type="all">
        <div class="metric-number">${venues.length}</div>
        <div class="metric-label">Venues en total</div>
      </button>
      ${cards}
    </div>`;
}

function filterHtml(venues) {
  const types = [...new Set(venues.map((v) => v.type))].sort();
  const btn = (value, label, active) =>
    `<button class="month-btn filter-btn${active ? ' active' : ''}" type="button"
             data-filter="${esc(value)}" aria-pressed="${active}">${esc(label)}</button>`;
  return btn('all', 'Todos', true) + types.map((t) => btn(slug(t), t, false)).join('');
}

function applyFilter(type) {
  document.querySelectorAll('.venue-card').forEach((card) => {
    card.hidden = type !== 'all' && card.dataset.type !== type;
  });
}

function selectFilter(type) {
  document.querySelectorAll('.filter-btn').forEach((b) => {
    const on = b.dataset.filter === type;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  applyFilter(type);
}

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('venues-container');
  if (!grid) return;

  let venues;
  try {
    const res = await fetch(VENUES_CSV);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    venues = parseVenues(await res.text());
  } catch (err) {
    console.error(`Could not load ${VENUES_CSV}:`, err);
    grid.innerHTML = `<div class="empty-state"><strong>No pudimos cargar los venues.</strong>
      Recarga la página o escríbenos por Telegram.</div>`;
    return;
  }

  if (!venues.length) {
    grid.innerHTML = `<div class="empty-state"><strong>Nada por aquí todavía.</strong>
      Los venues aparecerán aquí cuando se activen.</div>`;
    return;
  }

  grid.innerHTML = venues.map(venueCard).join('');

  const stats = document.getElementById('venue-stats');
  if (stats) stats.innerHTML = statsHtml(venues);

  const filters = document.getElementById('venue-filters');
  if (filters) filters.innerHTML = filterHtml(venues);

  // A stat card and a filter chip do the same thing, so both route through
  // selectFilter and the two stay in sync.
  document.querySelectorAll('.stat-card, .filter-btn').forEach((el) => {
    el.addEventListener('click', () => selectFilter(el.dataset.type ?? el.dataset.filter));
  });
});
