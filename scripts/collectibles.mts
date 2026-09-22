/**
 * Reads the artwork behind /collectibles from POAP and from Unlock Protocol.
 *
 * The page used to link each POAP to poap.gallery. POAP has since retired that
 * site along with drops.poap.xyz and collectors.poap.xyz — all three 301 to the
 * poap.xyz homepage, so nineteen "Ver onchain" links landed on a marketing page
 * that said nothing about the drop. There is no public per-drop page left to
 * point at.
 *
 * So the card carries the proof instead of linking to it: the badge POAP
 * serves, and the real number of people who collected it. That is better than
 * the link was even when the link worked. The Unlock locks get the same
 * treatment for the same reason — a block explorer proves a contract exists,
 * it does not show you the thing.
 *
 * Needs POAP_API_KEY, and it must NOT be NEXT_PUBLIC_: this runs at build time,
 * and a NEXT_PUBLIC_ value is inlined into the client bundle for every visitor
 * to read. Unlock's metadata endpoint needs no key at all. Without the POAP key
 * this exits quietly and leaves the committed file alone, same contract as
 * scripts/dune.mts.
 *
 * Run: npm run collectibles     (npm run build does it too)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'content/collectibles.generated.ts');
const SRC = join(ROOT, 'content/collectibles.ts');
const ART = join(ROOT, 'public/collectibles');

/**
 * The artwork is downloaded and resized here rather than hotlinked, and that is
 * not a preference.
 *
 * Most of these are animated GIFs at full print resolution — one Unlock badge
 * is 18 MB and the set comes to about 100 MB. `next/image` does not optimise
 * animated formats, it passes them through, so pointing at the originals would
 * have shipped all of it to anyone who opened the page. Resized to 160px webp
 * (the cards render at 64) the whole set is a few hundred kilobytes.
 *
 * It also removes three runtime dependencies: POAP's CDN 403s some requests,
 * one of its images 500s through the optimiser, and one Unlock lock keeps its
 * art on a private IPFS gateway that would have needed its own allowlist entry.
 * A file in public/ has none of those failure modes.
 */
const EDGE = 160;

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

const key = env('POAP_API_KEY');
if (!key) {
  console.log('collectibles: no POAP_API_KEY — keeping the committed artwork.');
  process.exit(0);
}

/** Chain names as content/collectibles.ts spells them → Unlock's network ids. */
const UNLOCK_NETWORK: Record<string, number> = { base: 8453, optimism: 10, polygon: 137 };

const source = readFileSync(SRC, 'utf8');

/**
 * Drop ids, read out of the registry rather than listed twice.
 *
 * Both URL shapes it carries end in the id — poap.gallery/drops/NNN and
 * console.poap.xyz/drops/NNN — so one pattern finds them all, and adding a POAP
 * to content/collectibles.ts is enough to pull it in here.
 */
const dropIds = [
  ...new Set([...source.matchAll(/poap[^']*\/drops\/(\d+)/g)].map((m) => Number(m[1]))),
].sort((a, b) => a - b);

/**
 * Lock addresses with the chain each sits on.
 *
 * Taken from the `chain:` and `contracts:` of each entry, in file order, so the
 * pairing survives an entry being added or moved. Only the first contract of a
 * multi-lock entry is fetched: Drumcode deployed five for one night and they
 * share the artwork, so four more round trips would buy nothing.
 */
const locks: { chain: string; address: string }[] = [];
for (const m of source.matchAll(/chain: '([a-z]+)',[\s\S]{0,400}?contracts: \[\s*'(0x[0-9a-fA-F]{40})'/g)) {
  const [, chain, address] = m;
  if (UNLOCK_NETWORK[chain]) locks.push({ chain, address });
}

interface Art {
  name: string;
  /** A path under public/, not the issuer's URL. See ART above. */
  imageUrl: string;
  collectors: number | null;
}

mkdirSync(ART, { recursive: true });

/**
 * Fetch, flatten and shrink one badge. Returns the public path, or '' if the
 * image is unreachable — a card without art is fine, a build that dies because
 * POAP had a bad minute is not.
 *
 * sharp reads only the first frame of a GIF unless told otherwise, which is
 * exactly what a 64px badge wants.
 */
async function art(url: string, name: string): Promise<string> {
  if (!url) return '';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(EDGE, EDGE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(ART, `${name}.webp`));
    return `/collectibles/${name}.webp`;
  } catch (err) {
    console.warn(`collectibles: art for ${name} -> ${(err as Error).message}, skipped`);
    return '';
  }
}

async function json(url: string, headers: Record<string, string> = {}) {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json', ...headers } });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const pause = () => new Promise((r) => setTimeout(r, 120));

// ——— POAP ———
const drops = new Map<number, Art>();
let missedDrops = 0;

for (const id of dropIds) {
  const [event, tokens] = await Promise.all([
    json(`https://api.poap.tech/events/id/${id}`, { 'X-API-Key': key }),
    json(`https://api.poap.tech/event/${id}/poaps?limit=1`, { 'X-API-Key': key }),
  ]);

  if (!event) {
    // Said out loud. A drop deleted upstream is news, not a blank card.
    console.warn(`collectibles: poap drop ${id} -> not found, skipped`);
    missedDrops++;
  } else {
    drops.set(id, {
      name: str(event.name),
      imageUrl: await art(str(event.image_url), `poap-${id}`),
      collectors: typeof tokens?.total === 'number' ? tokens.total : null,
    });
  }
  await pause();
}

// ——— Unlock ———
const unlock = new Map<string, Art>();
let missedLocks = 0;

for (const { chain, address } of locks) {
  const meta = await json(
    `https://locksmith.unlock-protocol.com/v2/api/metadata/${UNLOCK_NETWORK[chain]}/locks/${address}`
  );
  if (!meta || !str(meta.image)) {
    console.warn(`collectibles: unlock ${chain}/${address.slice(0, 10)}… -> no metadata, skipped`);
    missedLocks++;
  } else {
    // Keyed lowercase: the registry spells some of these checksummed and some
    // not, and the page looks them up by whatever it has.
    unlock.set(address.toLowerCase(), {
      name: str(meta.name),
      imageUrl: await art(str(meta.image), `unlock-${address.toLowerCase()}`),
      collectors: null,
    });
  }
  await pause();
}

if (!drops.size && !unlock.size) {
  console.warn('collectibles: nothing came back — keeping the committed artwork.');
  process.exit(0);
}

const entry = (k: string, a: Art) =>
  `  ${k}: { name: ${JSON.stringify(a.name)}, imageUrl: ${JSON.stringify(a.imageUrl)}, collectors: ${a.collectors} },`;

const file = `/**
 * Generated by scripts/collectibles.mts — do not edit.
 *
 * The artwork and the real collector counts behind every entry in
 * content/collectibles.ts, from POAP's API and Unlock Protocol's.
 *
 * \\\`imageUrl\\\` is a path under public/, not the issuer's URL: the originals
 * are full-resolution animated GIFs totalling about 100 MB, and next/image
 * passes animated formats through without optimising them. They are fetched,
 * flattened to their first frame and resized to 160px webp at build time.
 *
 * This exists because POAP retired every public drop page — poap.gallery,
 * drops.poap.xyz and collectors.poap.xyz all redirect to their homepage — so
 * there was nothing left to link to. The page shows the thing instead.
 *
 * \\\`name\\\` is what the issuer calls it, which is not always what the registry
 * calls it; the page keeps the registry's name as the heading and this is here
 * so the two can be compared. \\\`collectors\\\` is POAP's own count and beats the
 * one the organisers wrote down. Unlock does not publish a holder count, so
 * those stay null and the registry's figure stands.
 *
 * Regenerate with \\\`npm run collectibles\\\`; \\\`npm run build\\\` does it, and skips
 * on a machine with no POAP_API_KEY.
 */
export interface CollectibleArt {
  name: string;
  imageUrl: string;
  collectors: number | null;
}

/** Keyed by POAP drop id. */
export const POAP_DROPS: Readonly<Record<number, CollectibleArt>> = {
${[...drops.entries()].map(([id, a]) => entry(String(id), a)).join('\n')}
};

/** Keyed by lock address, lowercase. */
export const UNLOCK_LOCKS: Readonly<Record<string, CollectibleArt>> = {
${[...unlock.entries()].map(([addr, a]) => entry(JSON.stringify(addr), a)).join('\n')}
};
`;

writeFileSync(OUT, file, 'utf8');
const counted = [...drops.values()].filter((d) => d.collectors != null).length;
console.log(
  `collectibles: ${drops.size}/${dropIds.length} poaps (${counted} counted) · ` +
    `${unlock.size}/${locks.length} unlock locks` +
    `${missedDrops + missedLocks ? ` · ${missedDrops + missedLocks} missing` : ''} -> content/collectibles.generated.ts`
);
