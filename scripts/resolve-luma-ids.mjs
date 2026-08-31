/**
 * Refreshes databases/luma-embeds.json — the lu.ma slug → Luma api_id map.
 *
 * Only `https://luma.com/embed/event/<api_id>/simple` is frameable; the plain
 * event page sends X-Frame-Options: sameorigin. The api_id is not derivable
 * from the slug, so it has to be read off the event page — which needs network
 * and is blocked by CORS at runtime. Hence: resolve here, commit the result.
 *
 * Meetup is deliberately absent. Its pages send CSP `frame-ancestors 'self'`
 * and X-Frame-Options: sameorigin, so they cannot be embedded at all, and there
 * is no widget or oEmbed endpoint that gets around it.
 *
 * Usage: npm run luma-ids
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CSV = 'databases/Eventos historicos ethcali - historic.csv';
const OUT = 'databases/luma-embeds.json';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

const slugs = [...new Set(
  [...readFileSync(CSV, 'utf8').matchAll(/https?:\/\/(?:www\.)?lu\.ma\/([A-Za-z0-9]+)/g)].map((m) => m[1]),
)];

const existing = JSON.parse(readFileSync(OUT, 'utf8'));
const out = { _comment: existing._comment };
let resolved = 0;

for (const slug of slugs) {
  const html = await fetch(`https://luma.com/${slug}`, { headers: { 'user-agent': UA } }).then((r) => r.text());
  const id = html.match(/"api_id":"(evt-[A-Za-z0-9]+)"/)?.[1];
  if (id) { out[slug] = id; resolved += 1; }
  else console.warn(`  ! ${slug} — no api_id found, keeping ${existing[slug] ?? 'nothing'}`);
  if (!id && existing[slug]) out[slug] = existing[slug];
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`${OUT} — ${resolved}/${slugs.length} slugs resolved`);
