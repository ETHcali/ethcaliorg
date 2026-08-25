/**
 * Events UI — renders event cards and metrics on the brand system.
 *
 * Public API is unchanged, because js/events-app.js drives it:
 *   renderInternationalEvents · renderLocalEvents
 *   renderInternationalMetrics · renderLocalMetrics
 *   setupMonthFilter · setupYearFilter · setupFilters
 *   formatDateRange · ensureHttps
 *
 * Design rules this file has to hold on its own, since it writes markup at
 * runtime: mono for dates, counts, chain names and POAP/NFT figures; Sarun for
 * names and descriptions; inline stroke SVG instead of Font Awesome; an
 * .empty-state rather than a blank grid.
 */

/* 1.6px stroke icons, sized by CSS. */
const ICON = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8L17 5.4a2 2 0 0 1 2.8 0L22 7.6"/><path d="m21 3-3 3M2 7.6 4.2 5.4a2 2 0 0 1 2.8 0L9.4 7.8a2 2 0 0 1 0 2.8L5.5 14.5a1 1 0 1 0 3 3L11 15"/><path d="m3 3 3 3"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
};

/** "NA" and "-" are how the source data spells an absent value. */
const has = (v) => Boolean(v) && v !== 'NA' && v !== '-';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

class EventsUI {
  constructor(eventsService) {
    this.eventsService = eventsService;
  }

  // ── shared pieces ───────────────────────────────────────────────────────

  /** A labelled fact line: icon + mono value. */
  static meta(icon, value, href) {
    if (!has(value)) return '';
    const inner = href
      ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(value)}</a>`
      : esc(value);
    return `<div class="event-meta">${icon}<span>${inner}</span></div>`;
  }

  static detail(label, body) {
    return body ? `<div class="detail-item"><span class="addr-label">${esc(label)}</span>${body}</div>` : '';
  }

  /**
   * hostColab arrives from the CSV as either a plain name or "Name: https://…".
   * Rendering the cell verbatim printed the whole URL into the card body, which
   * is both ugly and against the rule that a link never shows as a raw string.
   */
  static collab(raw) {
    if (!has(raw)) return '';
    const m = /^(.*?):\s*(https?:\/\/\S+)$/s.exec(String(raw).trim());
    if (!m) return EventsUI.meta(ICON.handshake, raw);
    const [, name, url] = m;
    return EventsUI.meta(ICON.handshake, name.trim() || url, url);
  }

  static linkOut(href, text) {
    return has(href)
      ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(text)} ${ICON.ext}</a>`
      : '';
  }

  chainLine(chain, suffix) {
    if (!has(chain)) return '';
    const logo = this.eventsService.getChainLogo(chain);
    return `<span class="chip"><img src="${esc(logo)}" alt=""><span class="chain-name">${esc(chain)}</span>${
      suffix ? `<span class="faint mono">${esc(suffix)}</span>` : ''}</span>`;
  }

  static renderInto(containerId, html, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    container.innerHTML = html || `
      <div class="empty-state">
        <strong>Nada por aquí todavía.</strong>${esc(emptyMessage)}
      </div>`;
    return container;
  }

  // ── international ───────────────────────────────────────────────────────

  renderInternationalEvents(events, containerId = 'events-list') {
    const html = (events || []).map((e) => this.internationalCard(e)).join('');
    EventsUI.renderInto(containerId, html, ' Los próximos eventos internacionales aparecerán aquí.');
  }

  internationalCard(event) {
    const cta = has(event.link)
      ? `<a class="card-cta" href="${esc(this.ensureHttps(event.link))}" target="_blank" rel="noopener">Ver el evento ${ICON.ext}</a>`
      : '<span class="card-cta faint">Sin enlace todavía</span>';

    return `
      <article class="event-card" data-month="${esc(event.month)}">
        <div class="event-card-body">
          <span class="eyebrow">Internacional</span>
          <h3>${esc(event.name)}</h3>
          ${EventsUI.meta(ICON.calendar, this.formatDateRange(event.startDate, event.endDate))}
          ${EventsUI.meta(ICON.pin, event.location)}
          ${has(event.social) ? EventsUI.meta(ICON.users, `@${event.social}`, `https://twitter.com/${event.social}`) : ''}
          ${cta}
        </div>
      </article>`;
  }

  // ── local ───────────────────────────────────────────────────────────────

  renderLocalEvents(events, containerId = 'events-list') {
    const html = (events || []).map((e) => this.localCard(e)).join('');
    EventsUI.renderInto(containerId, html, ' Ajusta los filtros o vuelve más tarde.');
  }

  localCard(event) {
    const details = [
      EventsUI.detail('Post oficial', EventsUI.linkOut(event.socialMediaPost, 'Ver el post')),
      EventsUI.detail('Registro', EventsUI.linkOut(event.registrationPage, 'Página de registro')),
      EventsUI.detail('NFT', EventsUI.linkOut(event.nftUrl, 'Ver el NFT')),
      EventsUI.detail('Protocolo de mint', has(event.protocolToMint) ? `<span class="mono">${esc(event.protocolToMint)}</span>` : ''),
      EventsUI.detail('Chain del NFT', this.chainLine(event.chainNft, has(event.mintsNft) ? `${event.mintsNft} mints` : '')),
      EventsUI.detail('POAP', EventsUI.linkOut(event.poapLink, 'Ver el POAP')),
      EventsUI.detail('Chain del POAP', this.chainLine(event.chainPOAP)),
      EventsUI.detail('Recap', EventsUI.linkOut(event.recapSocialMedia, 'Ver el recap')),
      EventsUI.detail('Fotos', EventsUI.linkOut(event.registroFotografico, 'Registro fotográfico')),
      EventsUI.detail('Grabación', EventsUI.linkOut(event.youtubeRecording, 'Ver el video')),
    ].filter(Boolean).join('');

    const tags = [event.typeContent, event.typeEvent]
      .filter(has)
      .map((t) => `<span class="label">${esc(t)}</span>`)
      .join('');

    const cta = has(event.registroFotografico)
      ? `<a class="card-cta" href="${esc(event.registroFotografico)}" target="_blank" rel="noopener">Registro fotográfico ${ICON.ext}</a>`
      : has(event.socialMediaPost)
        ? `<a class="card-cta" href="${esc(event.socialMediaPost)}" target="_blank" rel="noopener">Ver el post ${ICON.ext}</a>`
        : '<span class="card-cta faint">Sin enlace todavía</span>';

    return `
      <article class="event-card" data-month="${esc(event.month)}" data-year="${esc(event.year)}">
        ${has(event.image) ? `<div class="event-photo"><img src="${esc(event.image)}" alt="" loading="lazy"
             onerror="this.closest('.event-photo').remove()"></div>` : ''}
        <div class="event-card-body">
          <h3>${esc(event.name)}</h3>
          ${EventsUI.meta(ICON.calendar, event.date)}
          ${EventsUI.meta(ICON.pin, event.locationName, has(event.locationUrl) ? event.locationUrl : null)}
          ${EventsUI.collab(event.hostColab)}
          ${has(event.rsvp) ? EventsUI.meta(ICON.users, `${event.rsvp} RSVP`) : ''}
          ${tags ? `<div class="row" style="margin-top:12px">${tags}</div>` : ''}
          ${details ? `
            <details class="event-details">
              <summary>Ver detalles ${ICON.chevron}</summary>
              <div class="details-grid">${details}</div>
            </details>` : ''}
          ${cta}
        </div>
      </article>`;
  }

  // ── metrics ─────────────────────────────────────────────────────────────

  static metricCard(value, label) {
    return `<div class="metric-card"><div class="metric-number">${esc(value)}</div><div class="metric-label">${esc(label)}</div></div>`;
  }

  renderInternationalMetrics(metrics, containerId = 'metrics-container') {
    EventsUI.renderInto(containerId, `
      <div class="metrics-grid">
        ${EventsUI.metricCard(metrics.totalEvents, 'Eventos')}
        ${EventsUI.metricCard(metrics.totalCountries, 'Países')}
      </div>`);
  }

  renderLocalMetrics(metrics, containerId = 'metrics-container') {
    const badges = (obj) => Object.entries(obj || {})
      .map(([k, v]) => `<span class="label">${esc(k)} · ${esc(v)}</span>`).join('');

    const chains = Object.entries(metrics.chainMints || {})
      .map(([chain, mints]) => this.chainLine(chain, `${mints} mints`)).join('');

    EventsUI.renderInto(containerId, `
      <div class="metrics-grid">
        ${EventsUI.metricCard(metrics.totalEvents, 'Eventos')}
        ${EventsUI.metricCard(metrics.totalAttendees, 'Asistentes')}
      </div>
      <div class="grid grid-3" style="margin-top:12px">
        <div class="card"><h4>Por tipo de contenido</h4><div class="row" style="margin-top:12px">${badges(metrics.typeContentCounts)}</div></div>
        <div class="card"><h4>Por tipo de evento</h4><div class="row" style="margin-top:12px">${badges(metrics.typeEventCounts)}</div></div>
        <div class="card"><h4>Mints de NFT por chain</h4><div class="row" style="margin-top:12px">${chains}</div></div>
      </div>`);
  }

  // ── filters ─────────────────────────────────────────────────────────────

  setupMonthFilter(events, renderFunction) {
    this.bindFilterGroup('.month-btn', events, renderFunction);
  }

  setupYearFilter(events, renderFunction) {
    this.bindFilterGroup('.year-btn', events, renderFunction);
  }

  setupFilters(events, renderFunction) {
    this.setupMonthFilter(events, renderFunction);
    this.setupYearFilter(events, renderFunction);
  }

  bindFilterGroup(selector, events, renderFunction) {
    const btns = document.querySelectorAll(selector);
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        this.applyFilters(events, renderFunction);
      });
    });
  }

  applyFilters(events, renderFunction) {
    const value = (sel, attr) => document.querySelector(sel)?.getAttribute(attr) ?? 'all';
    renderFunction(this.eventsService.filterEventsByYearAndMonth(
      events,
      value('.year-btn.active', 'data-year'),
      value('.month-btn.active', 'data-month'),
    ));
  }

  // ── helpers ─────────────────────────────────────────────────────────────

  formatDateRange(startDate, endDate) {
    if (!has(endDate) || startDate === endDate) return startDate;
    return `${startDate} – ${endDate}`;
  }

  ensureHttps(url) {
    if (!url) return '';
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }
}

// Export for use in other modules
window.EventsUI = EventsUI;
