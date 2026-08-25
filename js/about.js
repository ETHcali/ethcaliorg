/**
 * Team grid on about.html.
 *
 * Reads databases/teamaboutus.csv at runtime. The previous version carried the
 * same twenty people hardcoded in this file as well, so the CSV and the page had
 * already drifted (roles and a name differed between them). The CSV is the
 * source; edit it, not this file.
 */

const TEAM_CSV = 'databases/teamaboutus.csv';

/** Order the sections are rendered in. Anything unrecognised falls to the end. */
const GROUPS = ['Founder', 'Core', 'Contributor', 'Volunteer', 'Former Core'];
const GROUP_LABELS = {
  Founder: 'Fundadores',
  Core: 'Core',
  Contributor: 'Contributors',
  Volunteer: 'Voluntarios',
  'Former Core': 'Antiguo core',
};

/**
 * Minimal RFC-4180 parse: the only structure this file uses is quoted fields
 * containing commas ("Founder, Economist, Project Manager"). Splitting on ","
 * shifted every column after the role for a third of the rows.
 */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') { quoted = true; }
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') { field += c; }
  }
  if (field || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** The CSV writes an absent link as an empty cell or the literal "No tiene". */
const link = (v) => (v && v.toLowerCase() !== 'no tiene' ? v.trim() : '');

/** dd/mm/yyyy → "mmm yyyy" in Spanish. Falls back to the raw string. */
function sinceLabel(raw) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (!m) return raw;
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${months[Number(m[2]) - 1]} ${m[3]}`;
}

const ICONS = {
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M3 9h4v12H3zm7 0h3.8v1.65h.05A4.17 4.17 0 0 1 17.6 8.7c4 0 4.75 2.64 4.75 6.07V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.57.69.48A10 10 0 0 0 12 2"/></svg>',
};

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function memberCard(m) {
  const name = escape(m.name);
  const socials = ['linkedin', 'twitter', 'github']
    .filter((k) => link(m[k]))
    .map((k) => `<a href="${escape(link(m[k]))}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k]}</a>`)
    .join('');

  return `
    <article class="team-card">
      <div class="team-avatar">
        <img src="${escape(m.image)}" alt="" loading="lazy"
             onerror="this.remove()">
        <span class="team-initial" aria-hidden="true">${escape(m.name.charAt(0))}</span>
      </div>
      <h3>${name}</h3>
      <p class="team-role">${escape(m['Profesional Profile'])}</p>
      <p class="team-since">Desde ${escape(sinceLabel(m.Since))}</p>
      ${socials ? `<div class="team-socials">${socials}</div>` : ''}
    </article>`;
}

async function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  let members;
  try {
    const res = await fetch(TEAM_CSV);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    members = parseCsv(await res.text());
  } catch (err) {
    console.error(`Could not load ${TEAM_CSV}:`, err);
    grid.innerHTML = `<div class="empty-state"><strong>No pudimos cargar el equipo.</strong>
      Recarga la página o escríbenos por Telegram.</div>`;
    return;
  }

  const seen = new Set();
  const order = [...GROUPS, ...members.map((m) => m.status).filter((s) => !GROUPS.includes(s))];

  grid.innerHTML = order
    .filter((g) => !seen.has(g) && seen.add(g))
    .map((group) => {
      const people = members.filter((m) => m.status === group);
      if (!people.length) return '';
      return `
        <div class="team-group">
          <h3 class="eyebrow">${escape(GROUP_LABELS[group] ?? group)} · ${people.length}</h3>
          <div class="team-grid-inner">${people.map(memberCard).join('')}</div>
        </div>`;
    })
    .join('');

  // The hero counters read from the same data, so they can never disagree with
  // the grid the way the hardcoded numbers did.
  const count = (g) => members.filter((m) => m.status === g).length;
  const stats = {
    'stat-core': count('Founder') + count('Core'),
    'stat-contributors': count('Contributor'),
    'stat-volunteers': count('Volunteer'),
  };
  Object.entries(stats).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  });
}

document.addEventListener('DOMContentLoaded', renderTeam);
