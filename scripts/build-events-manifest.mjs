/**
 * Writes events/manifest.json — the list of poster files that actually exist.
 *
 * js/events-service.js used to carry this list hardcoded, and it drifted: two
 * entries named files that were no longer there, and one file in the folder was
 * missing from the list, so its event fell back to the logo. A manifest that is
 * generated from the folder cannot drift.
 *
 * Run by `npm run build` (and `npm run vercel-build`) before the copy step, so
 * the committed copy is only a convenience for `npm run dev`, which serves the
 * repo root with no build.
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'events';
const IMAGE = /\.(png|jpe?g|avif|webp|gif)$/i;

const files = readdirSync(DIR).filter((f) => IMAGE.test(f)).sort();

writeFileSync(
  join(DIR, 'manifest.json'),
  JSON.stringify(files, null, 2) + '\n',
);

console.log(`events/manifest.json — ${files.length} posters`);
