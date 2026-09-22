/**
 * Cuts the individual lockups out of the vector sheet, as SVG.
 *
 * `public/branding` shipped every lockup as PNG and the vector only as a sheet
 * of all six at once, so anyone wanting the horizontal mark at billboard size,
 * or in a vector tool, had to open the sheet and cut it themselves. This does
 * that cut once, reproducibly, and commits the result.
 *
 * The sheet is a Figma export: one flat group of 122 paths with no per-lockup
 * grouping, so the split is spatial. Every path's bounding box is computed and
 * boxes that touch are unioned, which lands exactly on the three light-ground
 * lockups — their extents match the hand-exported PNGs to within a pixel, which
 * is the check that the clustering found the right thing rather than a
 * plausible thing.
 *
 * The reversed versions are not cut from the sheet's own dark block: there the
 * lockups sit on full-width background rectangles that merge every cluster into
 * one. They are derived instead by swapping black for white, which is what the
 * reversed artwork already is — the filigree stays #2B23EF, per BRAND.md, which
 * allows the line to be ultramarine or white and nothing else.
 *
 * Run: npm run logos
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIR = join(ROOT, 'public/branding');
const SRC = join(DIR, 'Logo_Nodo_CLO_ETH_CO-sheet.svg');

type Box = [number, number, number, number];

/**
 * A path's extent.
 *
 * The sheet uses absolute commands only — checked, not assumed — so every
 * number is a coordinate rather than a delta. H carries an x and V carries a y,
 * so reading the stream as alternating x,y pairs would misplace both. Bézier
 * control points are included, which makes the box a superset of the true
 * outline: generous by a hair, and generous is the safe direction for a crop.
 */
function bbox(d: string): Box | null {
  const toks = d.match(/[MLCHVZmlchvz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const xs: number[] = [];
  const ys: number[] = [];
  let cx = 0;
  let cy = 0;
  let cmd = '';
  let i = 0;
  while (i < toks.length) {
    const t = toks[i];
    if (/[A-Za-z]/.test(t)) {
      cmd = t;
      i += 1;
      continue;
    }
    const n = (k: number) => Number(toks[i + k]);
    if (cmd === 'M' || cmd === 'L') {
      cx = n(0); cy = n(1); xs.push(cx); ys.push(cy); i += 2;
    } else if (cmd === 'C') {
      for (const k of [0, 2, 4]) { xs.push(n(k)); ys.push(n(k + 1)); }
      cx = n(4); cy = n(5); i += 6;
    } else if (cmd === 'H') {
      cx = n(0); xs.push(cx); ys.push(cy); i += 1;
    } else if (cmd === 'V') {
      cy = n(0); ys.push(cy); xs.push(cx); i += 1;
    } else {
      i += 1;
    }
  }
  return xs.length ? [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] : null;
}

const sheet = readFileSync(SRC, 'utf8');
const items = (sheet.match(/<path\b[^>]*\/>/g) ?? [])
  .map((svg) => {
    const d = /\sd="([^"]+)"/.exec(svg)?.[1] ?? '';
    return { svg, bb: bbox(d) };
  })
  .filter((p): p is { svg: string; bb: Box } => p.bb !== null);

// Union-find over boxes that touch within a hair's breadth.
const parent = items.map((_, i) => i);
const find = (a: number): number => (parent[a] === a ? a : (parent[a] = find(parent[a])));
const union = (a: number, b: number) => {
  const [ra, rb] = [find(a), find(b)];
  if (ra !== rb) parent[rb] = ra;
};
const PAD = 30;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = items[i].bb;
    const b = items[j].bb;
    if (a[0] - PAD < b[2] && b[0] - PAD < a[2] && a[1] - PAD < b[3] && b[1] - PAD < a[3]) union(i, j);
  }
}

const clusters = new Map<number, { svg: string; bb: Box }[]>();
items.forEach((it, i) => {
  const k = find(i);
  clusters.set(k, [...(clusters.get(k) ?? []), it]);
});

/**
 * The three we want, keyed by the size they come out at. The dark block at the
 * foot of the sheet is one merged cluster 1500 wide and is skipped.
 */
const WANTED: Record<string, string> = {
  '393x266': 'ethcali-horizontal',
  '208x364': 'ethcali-vertical',
  '385x186': 'ethcali-horizontal-simple',
};

const MARGIN = 12;
let written = 0;

for (const group of clusters.values()) {
  const x0 = Math.min(...group.map((g) => g.bb[0]));
  const y0 = Math.min(...group.map((g) => g.bb[1]));
  const x1 = Math.max(...group.map((g) => g.bb[2]));
  const y1 = Math.max(...group.map((g) => g.bb[3]));
  const key = `${Math.round(x1 - x0)}x${Math.round(y1 - y0)}`;
  const name = WANTED[key];
  if (!name) continue;

  const w = x1 - x0 + MARGIN * 2;
  const h = y1 - y0 + MARGIN * 2;
  const body = group.map((g) => `  ${g.svg}`).join('\n');
  const doc = (inner: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(2)} ${h.toFixed(2)}" width="${Math.round(w)}" height="${Math.round(h)}" fill="none">\n` +
    `<g transform="translate(${(MARGIN - x0).toFixed(2)} ${(MARGIN - y0).toFixed(2)})">\n${inner}\n</g>\n</svg>\n`;

  writeFileSync(join(DIR, `${name}-on-light.svg`), doc(body));
  // Reversed: the wordmark and the octahedron go white, the filigree stays
  // ultramarine. Matching on the whole attribute so a colour that merely
  // contains the word cannot be caught by it.
  writeFileSync(join(DIR, `${name}-on-dark.svg`), doc(body.replace(/fill="black"/g, 'fill="white"')));
  written += 2;
  console.log(`logos: ${name}-on-{light,dark}.svg — ${group.length} paths, ${Math.round(w)}×${Math.round(h)}`);
}

if (written !== Object.keys(WANTED).length * 2) {
  throw new Error(`split-logo-sheet: expected ${Object.keys(WANTED).length * 2} files, wrote ${written}. The sheet's geometry changed — re-check the keys in WANTED against a dry run.`);
}
