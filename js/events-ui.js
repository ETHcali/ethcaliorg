/**
 * Events UI — a paginated data grid with a detail modal.
 *
 * Public API is unchanged, because js/events-app.js drives it:
 *   renderInternationalEvents · renderLocalEvents
 *   renderInternationalMetrics · renderLocalMetrics
 *   setupMonthFilter · setupYearFilter · setupFilters
 *   formatDateRange · ensureHttps
 *
 * Was a wall of cards, which buried the numbers: RSVP, NFT mints and POAP
 * collectors are the interesting part of an event record and a card shows one
 * of them at a time. A grid puts them in columns you can scan down, and the
 * long tail of links moves into a modal instead of an inline <details>.
 *
 * Design rules this file holds on its own, since it writes markup at runtime:
 * mono for every fact (dates, counts, chains, hosts); Sarun for names and
 * descriptions; inline stroke SVG, never Font Awesome or emoji; an
 * .empty-state rather than a blank grid.
 */

const PAGE_SIZE = 12;

const ICON = {
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
};

/**
 * The sheet's own vocabulary, in the page's language. The columns are filled in
 * by hand and mix English, Spanish and a typo ("Voluntering"), which the grid was
 * printing verbatim as COLAB / OWN / VOLUNTERING on a Spanish page. Anything not
 * listed falls through unchanged, so a new value in the sheet still shows up.
 */
const LABEL = {
  Event: 'Evento', Meetup: 'Meetup', Workshop: 'Taller', Hackathon: 'Hackathon',
  Conference: 'Conferencia', Proyecto: 'Proyecto',
  Colab: 'Colaboración', own: 'Propio', Attendees: 'Asistentes',
  Voluntering: 'Voluntariado', Ethcolombia: 'ETHColombia',
};
const label = (v) => LABEL[String(v ?? '').trim()] ?? v;

/** "NA" and "-" are how the source spreadsheets spell an absent value. */
const has = (v) => {
  const s = String(v ?? '').trim();
  return Boolean(s) && !['na', '-', 'n/a', 'no tiene'].includes(s.toLowerCase());
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const num = (v) => {
  const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * A value becomes a link only if it really addresses somewhere, and it is
 * normalised to an absolute URL on the way.
 *
 * The scheme test used to run *before* anything added a missing "https://", and
 * the global calendar CSV writes bare hosts — "zugrama.org/", "buidleurope.com".
 * So 75 of the 84 populated Link cells and 60 of the 65 Chat cells were thrown
 * away, and 73 of 85 events rendered "—" in Enlaces and claimed in the modal
 * that they had no links at all. Every one of them has a website.
 */
function toUrl(v) {
  const s = String(v ?? '').trim();
  if (!s) return null;
  // A bare host still has to look like one, or a stray note becomes a link.
  const candidate = /^https?:\/\//i.test(s) ? s
    : /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/?#]|$)/i.test(s) ? `https://${s}`
    : null;
  if (!candidate) return null;
  try { return new URL(candidate).href; } catch { return null; }
}

/** Host only, for the link chips — the URL itself is never printed raw. */
function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]; }
}

/**
 * The links attached to one event, in the order a reader wants them.
 * Each entry is [label, url]; the chip shows the label and the host, which is
 * as much of a preview as a static site can honestly give. A real OG card
 * needs something server-side to fetch and cache the target's metadata.
 */
function linksFor(e) {
  const candidates = [
    ['Post oficial', e.socialMediaPost],
    ['Registro', e.registrationPage],
    ['NFT', e.nftUrl],
    ['POAP', e.poapLink],
    ['Recap', e.recapSocialMedia],
    ['Fotos', e.registroFotografico],
    ['Grabación', e.youtubeRecording],
    ['Ubicación', e.locationUrl],
    ['Host', e.hostColabUrl],
    ['Sitio', e.link],
    ['Chat', e.chat],
  ];
  // Only a real http(s) URL becomes a chip. "Carpeta del Evento" holds a Drive
  // folder *name* ("2022 11 14 Devcon VI") in all 46 populated rows — rendering
  // it as a link produced a chip whose host was the folder name punycoded, and
  // an internal archive label means nothing to a visitor anyway. It is left out
  // entirely rather than shown as a dead link.
  return candidates
    .map(([label, raw]) => [label, has(raw) ? toUrl(raw) : null])
    .filter(([, url]) => url);
}

class EventsUI {
  constructor(eventsService) {
    this.eventsService = eventsService;
    this.state = { local: { rows: [], page: 1 }, international: { rows: [], page: 1 } };
    this.modal = null;
  }

  // ── grid ────────────────────────────────────────────────────────────────

  renderLocalEvents(events, containerId = 'events-list') {
    this.state.local.rows = events || [];
    this.state.local.page = 1;
    this.paint('local', containerId);
  }

  renderInternationalEvents(events, containerId = 'events-list') {
    this.state.international.rows = events || [];
    this.state.international.page = 1;
    this.paint('international', containerId);
  }

  paint(kind, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const { rows, page } = this.state[kind];

    if (!rows.length) {
      container.innerHTML = `<div class="empty-state">
        <strong>Nada por aquí todavía.</strong>
        Ajusta los filtros o vuelve más tarde.</div>`;
      return;
    }

    const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const current = Math.min(page, pages);
    const slice = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    container.innerHTML = `
      <div class="grid-scroll">
        <table class="data-grid">
          <thead>${kind === 'local' ? EventsUI.localHead() : EventsUI.intlHead()}</thead>
          <tbody>${slice.map((e, i) =>
            (kind === 'local' ? this.localRow(e, i) : this.intlRow(e, i))).join('')}</tbody>
        </table>
      </div>
      ${EventsUI.pager(current, pages, rows.length)}`;

    // Rows are buttons in spirit: click or Enter opens the detail modal.
    container.querySelectorAll('tr[data-index]').forEach((tr) => {
      const open = () => this.openModal(kind, slice[Number(tr.dataset.index)]);
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); }
      });
    });

    container.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state[kind].page = Number(btn.dataset.page);
        this.paint(kind, containerId);
        container.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
  }

  static localHead() {
    return `<tr>
      <th>Fecha</th><th>Evento</th><th>Tipo</th><th>Lugar</th>
      <th class="right">RSVP</th><th class="right">Mints</th><th class="right">POAP</th><th>Enlaces</th>
    </tr>`;
  }

  static intlHead() {
    return `<tr><th>Fechas</th><th>Evento</th><th>Dónde</th><th>Enlaces</th></tr>`;
  }

  localRow(e, i) {
    const mints = num(e.mintsNft);
    const poap = num(e.collectorsPOAP);
    const rsvp = num(e.rsvp);
    const links = linksFor(e).length;
    return `<tr data-index="${i}" tabindex="0" role="button" aria-label="Ver detalles de ${esc(e.name)}">
      <td class="mono nowrap">${esc(e.date)}</td>
      <td class="cell-name">${esc(e.name)}</td>
      <td>${has(e.typeContent) ? `<span class="label">${esc(label(e.typeContent))}</span>` : ''}</td>
      <td class="cell-muted">${esc(e.locationName || '')}</td>
      <td class="right mono">${rsvp ?? '<span class="faint">—</span>'}</td>
      <td class="right mono">${mints ?? '<span class="faint">—</span>'}</td>
      <td class="right mono">${poap ?? '<span class="faint">—</span>'}</td>
      <td class="nowrap">${EventsUI.linkCount(links)}</td>
    </tr>`;
  }

  /** A count on its own read as a stray number in a numeric table; the glyph
   *  says what is being counted. */
  static linkCount(n) {
    return n
      ? `<span class="link-count">${ICON.link}<span class="mono">${n}</span></span>`
      : '<span class="faint">—</span>';
  }

  intlRow(e, i) {
    const links = linksFor(e).length;
    return `<tr data-index="${i}" tabindex="0" role="button" aria-label="Ver detalles de ${esc(e.name)}">
      <td class="mono nowrap">${esc(this.formatDateRange(e.startDate, e.endDate))}</td>
      <td class="cell-name">${esc(e.name)}</td>
      <td class="cell-muted">${esc(e.location || '')}</td>
      <td class="nowrap">${EventsUI.linkCount(links)}</td>
    </tr>`;
  }

  static pager(current, pages, total) {
    if (pages < 2) return `<p class="pager-count mono">${total} eventos</p>`;
    const btn = (p, label, disabled, extra = '') =>
      `<button class="pager-btn${extra}" type="button" ${disabled ? 'disabled' : `data-page="${p}"`}>${label}</button>`;

    // A window of pages around the current one, so 40 pages never becomes 40
    // buttons. First and last are always reachable.
    const win = new Set([1, pages, current, current - 1, current + 1]);
    const nums = [...win].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
    let out = '', last = 0;
    for (const p of nums) {
      if (p - last > 1) out += '<span class="pager-gap mono">…</span>';
      out += btn(p, String(p), false, p === current ? ' is-current' : '');
      last = p;
    }
    return `
      <nav class="pager" aria-label="Paginación">
        ${btn(current - 1, ICON.prev, current === 1)}
        ${out}
        ${btn(current + 1, ICON.next, current === pages)}
        <span class="pager-count mono">${total} eventos</span>
      </nav>`;
  }

  // ── modal ───────────────────────────────────────────────────────────────

  openModal(kind, e) {
    this.closeModal();

    const facts = kind === 'local' ? [
      ['Fecha', e.date],
      ['Tipo de contenido', label(e.typeContent)],
      ['Tipo de evento', label(e.typeEvent)],
      ['Lugar', e.locationName],
      // The name only. This row used to print the whole cell, so an event whose
      // host cell read "Devcon: https://archive.devcon.org/watch/?event=…" put a
      // raw query string in the modal. The URL is a chip below instead.
      ['Host / colaboración', e.hostColabName || e.hostColab],
      ['RSVP', e.rsvp],
      ['Protocolo de mint', e.protocolToMint],
      ['Chain del NFT', e.chainNft],
      ['Mints', e.mintsNft],
      ['Chain del POAP', e.chainPOAP],
      ['Collectors POAP', e.collectorsPOAP],
    ] : [
      ['Fechas', this.formatDateRange(e.startDate, e.endDate)],
      ['Dónde', e.location],
      ['Social', has(e.social) ? `@${e.social}` : ''],
    ];

    const rows = facts.filter(([, v]) => has(v)).map(([k, v]) =>
      `<div class="modal-fact"><dt>${esc(k)}</dt><dd class="mono">${esc(v)}</dd></div>`).join('');

    const links = linksFor(e).map(([text, url]) => `
      <a class="link-chip" href="${esc(url)}" target="_blank" rel="noopener">
        <span class="link-chip-label">${esc(text)}</span>
        <span class="link-chip-host mono">${esc(hostOf(url))}</span>
        ${ICON.ext}
      </a>`).join('');

    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(e.name)}">
        <button class="modal-close" type="button" aria-label="Cerrar">${ICON.close}</button>
        ${has(e.image) ? `<div class="modal-photo"><img src="${esc(e.image)}" alt=""
             onerror="this.closest('.modal-photo').remove()"></div>` : ''}
        <div class="modal-body">
          <h3>${esc(e.name)}</h3>
          <dl class="modal-facts">${rows}</dl>
          ${links ? `<h4 class="modal-subhead">Enlaces</h4><div class="link-chips">${links}</div>`
                  : '<p class="faint" style="margin-top:16px">Este evento no tiene enlaces registrados.</p>'}
          ${EventsUI.lumaBlock(e)}
        </div>
      </div>`;

    const luma = wrap.querySelector('[data-luma]');
    if (luma) luma.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.className = 'luma-frame';
      frame.src = `https://luma.com/embed/event/${luma.dataset.luma}/simple`;
      frame.loading = 'lazy';
      frame.title = 'Página del evento en Luma';
      frame.allow = 'fullscreen';
      luma.replaceWith(frame);
    });

    const close = () => this.closeModal();
    wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); });
    wrap.querySelector('.modal-close').addEventListener('click', close);
    this.escHandler = (ev) => { if (ev.key === 'Escape') close(); };
    document.addEventListener('keydown', this.escHandler);

    document.body.appendChild(wrap);
    document.body.style.overflow = 'hidden';   // stop the page scrolling behind
    wrap.querySelector('.modal-close').focus();
    this.modal = wrap;
  }

  /**
   * Luma's own event page, embedded on request.
   *
   * Only Luma allows this. Its /embed/event/<api_id>/simple response carries no
   * X-Frame-Options and no frame-ancestors, while the plain lu.ma page sends
   * `sameorigin` and Meetup sends CSP `frame-ancestors 'self'` — Chrome refuses
   * both outright, and neither has a widget or oEmbed endpoint that gets around
   * it. So 8 of the 47 local events can show this and the rest cannot; the link
   * chips remain the common path.
   *
   * It loads behind a click rather than with the modal because the embed pulls
   * Luma's whole app and took several seconds to paint in testing — long enough
   * to make every modal feel broken if it were opened eagerly.
   */
  static lumaBlock(e) {
    if (!e.lumaEmbedId) return '';
    return `<h4 class="modal-subhead">Luma</h4>
      <button class="luma-open" type="button" data-luma="${esc(e.lumaEmbedId)}">
        Cargar la página del evento
        <span class="faint mono">luma.com</span>
      </button>`;
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.remove();
    this.modal = null;
    document.body.style.overflow = '';
    if (this.escHandler) document.removeEventListener('keydown', this.escHandler);
  }

  // ── metrics ─────────────────────────────────────────────────────────────

  static metricCard(value, label) {
    return `<div class="metric-card"><div class="metric-number">${esc(value)}</div><div class="metric-label">${esc(label)}</div></div>`;
  }

  static into(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  renderInternationalMetrics(m, containerId = 'metrics-container') {
    EventsUI.into(containerId, `<div class="metrics-grid">
      ${EventsUI.metricCard(m.totalEvents, 'Eventos en el calendario')}
      ${EventsUI.metricCard(m.totalCountries, 'Ciudades y países')}
    </div>`);
  }

  renderLocalMetrics(m, containerId = 'metrics-container') {
    const badges = (obj) => Object.entries(obj || {})
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `<span class="label">${esc(k)} · ${esc(v)}</span>`).join('');
    const chains = Object.entries(m.chainMints || {})
      .map(([c, n]) => `<span class="chip"><img src="${esc(this.eventsService.getChainLogo(c))}" alt="">
        <span class="chain-name">${esc(c)}</span><span class="faint mono">${esc(n)}</span></span>`).join('');

    EventsUI.into(containerId, `
      <div class="metrics-grid">
        ${EventsUI.metricCard(m.totalEvents, 'Eventos')}
        ${EventsUI.metricCard(m.totalAttendees, 'Asistentes')}
      </div>
      <div class="grid grid-3" style="margin-top:12px">
        <div class="card"><h4>Por tipo de contenido</h4><div class="row" style="margin-top:12px">${badges(m.typeContentCounts)}</div></div>
        <div class="card"><h4>Por tipo de evento</h4><div class="row" style="margin-top:12px">${badges(m.typeEventCounts)}</div></div>
        <div class="card"><h4>Mints de NFT por chain</h4><div class="row" style="margin-top:12px">${chains}</div></div>
      </div>`);
  }

  // ── filters ─────────────────────────────────────────────────────────────

  setupMonthFilter(events, render) { this.bind('.month-btn', events, render); }
  setupYearFilter(events, render) { this.bind('.year-btn', events, render); }
  setupFilters(events, render) { this.setupMonthFilter(events, render); this.setupYearFilter(events, render); }

  bind(selector, events, render) {
    const btns = document.querySelectorAll(selector);
    btns.forEach((btn) => btn.addEventListener('click', () => {
      btns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      this.applyFilters(events, render);
    }));
  }

  applyFilters(events, render) {
    const val = (sel, attr) => document.querySelector(sel)?.getAttribute(attr) ?? 'all';
    render(this.eventsService.filterEventsByYearAndMonth(
      events, val('.year-btn.active', 'data-year'), val('.month-btn.active', 'data-month')));
  }

  // ── helpers ─────────────────────────────────────────────────────────────

  formatDateRange(startDate, endDate) {
    if (!has(endDate) || startDate === endDate) return startDate || '';
    return `${startDate} – ${endDate}`;
  }

  ensureHttps(url) {
    if (!url) return '';
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }
}

window.EventsUI = EventsUI;
