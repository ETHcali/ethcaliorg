/**
 * Refreshes the two onchain figures in the Impacto section from Dune.
 *
 * The dashboard's own page renders "Click Run to get results" to a logged-out
 * visitor, so the numbers cannot be read by fetching it. The saved results are
 * real and current though — dune.com/embeds/<query>/<visualization> renders
 * them — and Dune's official API serves the same thing at
 * /api/v1/query/<id>/results without re-running anything.
 *
 * That endpoint needs an API key. Without `DUNE_API_KEY` this exits quietly and
 * leaves the committed numbers in place, which is why they are committed rather
 * than fetched at render: the page must be correct on a machine that has no key,
 * and on a build where Dune is down.
 *
 * Deliberately not the embed iframe. That renders on a cream background with a
 * cookie banner inside it, and pulls in Google Ads, Google Analytics, Stripe and
 * Sentry — putting it on the home page would inject ad tracking into every
 * visitor's session to display one integer.
 *
 * Run: npm run dune     (and `npm run build` does it too)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FILE = join(ROOT, 'content/site.ts');

function env(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const line = readFileSync(join(ROOT, '.env.local'), 'utf8')
      .split('\n')
      .find((l) => l.startsWith(`${key}=`));
    return line?.slice(key.length + 1).trim() || undefined;
  } catch {
    return undefined;
  }
}

const key = env('DUNE_API_KEY');
if (!key) {
  // Exit 0: a contributor without a key should still be able to build the site.
  console.log('dune: no DUNE_API_KEY — keeping the committed figures.');
  process.exit(0);
}

/** The counters, as they appear in IMPACT.queries. */
const COUNTERS = [
  { id: 6627839, label: 'users onboarded', marker: 'usersOnboarded' },
  { id: 6633618, label: 'fees paid (usd)', marker: 'feesPaidUsd' },
];

/** Dune returns the row set; a counter query is one row with one numeric column. */
async function latest(queryId: number): Promise<number | null> {
  const res = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results?limit=1`, {
    headers: { 'X-Dune-API-Key': key! },
  });
  if (!res.ok) {
    console.warn(`dune: query ${queryId} returned ${res.status}`);
    return null;
  }
  const body = (await res.json()) as { result?: { rows?: Record<string, unknown>[] } };
  const row = body.result?.rows?.[0];
  if (!row) return null;
  const value = Object.values(row).find((v) => typeof v === 'number');
  return typeof value === 'number' ? value : null;
}

/** Spanish and the site's other locale both group thousands with a period. */
const format = (n: number) => Math.round(n).toLocaleString('es-CO');

let source = readFileSync(FILE, 'utf8');
let changed = 0;

for (const counter of COUNTERS) {
  const n = await latest(counter.id);
  if (n === null) continue;

  const formatted = format(n);
  // Replace the `value` on the metric whose comment names this Dune counter.
  // Anchored on the doc comment rather than on position, so reordering the
  // metrics array cannot make this rewrite the wrong card.
  const marker = counter.marker === 'usersOnboarded' ? 'Users onboarded' : 'Total transaction fees';
  // Anchored on the doc comment that names the Dune counter, then the next
  // `value:` after it. Lazy, so it stops at that card's own value and cannot
  // reach across into the next metric.
  const pattern = new RegExp(`(Dune: "${marker}[\\s\\S]*?value: ')[^']*(')`);
  if (!pattern.test(source)) {
    console.warn(`dune: could not find the card for "${counter.label}" — left alone.`);
    continue;
  }
  source = source.replace(pattern, `$1${formatted}$2`);
  console.log(`dune: ${counter.label} -> ${formatted}`);
  changed += 1;
}

if (changed) {
  writeFileSync(FILE, source, 'utf8');
  console.log(`dune: updated ${changed} figure${changed === 1 ? '' : 's'} in content/site.ts`);
} else {
  console.log('dune: nothing to update.');
}
