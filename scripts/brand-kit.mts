/**
 * Builds the two brand-kit ZIPs into `public/brand-kit/`, before dev and build.
 *
 * Generated rather than committed. A ZIP checked into git is a binary snapshot
 * of a folder that keeps changing, and nothing tells you when the two have
 * parted company — someone adds a lockup, the folder has it, the kit does not,
 * and the first person to find out is whoever downloads the kit.
 *
 * The file list comes from `content/brand.ts`, the same array the page renders,
 * so the kit and the page cannot disagree either.
 *
 * The ZIP is written by hand with `zlib` rather than with an archiver package.
 * This is the whole of the format that matters here — local header, data,
 * central directory — and it is worth about eighty lines to avoid adding a
 * dependency to a site whose entire runtime is Next, React and supabase-js.
 * Nothing here needs ZIP64: the largest member is a 1.4 MB PDF.
 */
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LOGOS, SOCIAL_ART, WEB_FONTS, KITS, type BrandFile } from '../content/brand.ts';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(PUBLIC, 'brand-kit');

interface Entry {
  /** Path inside the archive. Always forward slashes — the spec says so, and
   *  Windows Explorer is the one that gets it wrong if you use backslashes. */
  name: string;
  body: Buffer;
}

/**
 * CRC-32, which the ZIP central directory requires per member and Node does not
 * expose. The table is built once; `>>> 0` keeps every intermediate unsigned,
 * without which the shift produces a negative and the checksum is wrong for
 * about half of all inputs.
 */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * A ZIP with every member deflated.
 *
 * Timestamps are pinned to a constant rather than to "now", so two builds of an
 * unchanged folder produce byte-identical archives. Without that, every deploy
 * ships a new ZIP with a new hash and every cache revalidates for nothing.
 */
function zip(entries: readonly Entry[]): Buffer {
  const DOS_TIME = 0x0000; // 00:00:00
  const DOS_DATE = 0x2821; // 2020-01-01
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const deflated = deflateRawSync(entry.body, { level: 9 });
    // A member is only stored deflated if that is actually smaller. For a JPEG
    // or a PNG it is not, and deflating an already-compressed file makes it
    // bigger — method 0 (stored) is the honest answer there.
    const stored = deflated.length >= entry.body.length;
    const body = stored ? entry.body : deflated;
    const method = stored ? 0 : 8;
    const crc = crc32(entry.body);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 filename flag
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(entry.body.length, 22);
    local.writeUInt16LE(name.length, 26);
    locals.push(local, name, body);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4); // version made by
    dir.writeUInt16LE(20, 6); // version needed
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(method, 10);
    dir.writeUInt16LE(DOS_TIME, 12);
    dir.writeUInt16LE(DOS_DATE, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(body.length, 20);
    dir.writeUInt32LE(entry.body.length, 24);
    dir.writeUInt16LE(name.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, name);

    offset += local.length + name.length + body.length;
  }

  const dirBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(dirBuf.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, dirBuf, end]);
}

/** Reads a site-relative path out of `public/`, loudly if it is not there. */
function read(sitePath: string): Buffer {
  const file = join(PUBLIC, sitePath.replace(/^\//, ''));
  try {
    return readFileSync(file);
  } catch {
    // A missing asset is a broken download button on a public page. Failing the
    // build is the cheap moment to find out; a 404 on click is the expensive one.
    throw new Error(`brand-kit: ${sitePath} is listed in content/brand.ts but not in public/`);
  }
}

const README = `ETH Cali — brand kit
====================

Everything in this archive is at https://www.ethcali.org/brand-guidelines, with
the rules that go with it. The short version:

  Clear space   X = the height of the diamond, on all four sides.
  Minimum size  32px tall on screen, 10mm in print. Below that, glyph only.
  Line colour   Ultramarine #2B23EF or white. Nothing else.

  Never  recolour the line · stretch, condense, rotate or arc it ·
         place it on a busy photo or a gradient · add glow, bevel or shadow

Typefaces
---------
Sarun Pro is a commercial typeface licensed from its foundry. The weights here
are published for ETH Cali work and that of its partner communities; for any
other use, licence it yourself. JetBrains Mono is Apache 2.0 and is not included
— take it from https://www.jetbrains.com/lp/mono/

Questions: hola@ethcali.org
`;

/** Every desktop weight in the family, walked rather than listed. */
function ttfEntries(): Entry[] {
  const dir = join(PUBLIC, 'branding/fonts');
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.ttf'))
    .sort()
    .map((f) => ({ name: `ethcali-sarun-pro/${f}`, body: readFileSync(join(dir, f)) }));
}

/** The kit most people want: marks, social art and the web weights. */
function brandEntries(): Entry[] {
  const seen = new Set<string>();
  const entries: Entry[] = [{ name: 'ethcali-brand-kit/README.txt', body: Buffer.from(README, 'utf8') }];

  const add = (group: string, file: BrandFile) => {
    const name = `ethcali-brand-kit/${group}/${file.download}`;
    // Two assets can legitimately list the same file; the same path twice in an
    // archive is what makes an unzip ask about overwriting.
    if (seen.has(name)) return;
    seen.add(name);
    entries.push({ name, body: read(file.path) });
  };

  for (const asset of LOGOS) for (const file of asset.files) add('logos', file);
  for (const asset of SOCIAL_ART) for (const file of asset.files) add('social', file);
  for (const file of WEB_FONTS) add('fonts-web', file);

  return entries;
}

function write(target: string, entries: readonly Entry[]) {
  const buf = zip(entries);
  const file = join(PUBLIC, target.replace(/^\//, ''));
  writeFileSync(file, buf);
  const kb = Math.round(statSync(file).size / 1024);
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 12);
  console.log(`brand-kit: ${target} — ${entries.length} files, ${kb} KB, sha256:${hash}`);
}

mkdirSync(OUT, { recursive: true });
write(KITS.brand.file, brandEntries());
write(KITS.fonts.file, ttfEntries());
