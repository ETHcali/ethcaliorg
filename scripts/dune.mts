/**
 * Reads the onchain figures off the Dune dashboard into content/dune.generated.ts.
 *
 * The dashboard's own page renders "Click Run to get results" to a logged-out
 * visitor, so the numbers cannot be scraped from it. The saved results are real
 * and current, and Dune's API serves them at /api/v1/query/<id>/results without
 * re-running anything.
 *
 * Needs DUNE_API_KEY. Without it this exits quietly and leaves the committed
 * file alone — the site has to be right on a machine with no key and on a build
 * where Dune is down, which is why the output is committed rather than fetched
 * at render. Same contract as scripts/hackathon-nav.mts.
 *
 * Not the embed iframe: it renders on a cream background with a cookie banner
 * inside it and pulls in Google Ads, Google Analytics, Stripe and Sentry, which
 * is a lot of third-party tracking to display one integer.
 *
 * Run: npm run dune     (npm run build does it too)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'content/dune.generated.ts');

/**
 * Query ids, from the dashboard's own widget links.
 *
 * TX and VOLUME are not on the public dashboard — they were written for this
 * page because nothing on the dashboard answered "how much". They run against
 * the same `dataset_users_onboarded_eth_cali` list as everything else, so the
 * population behind every figure below is identical.
 *
 * FEES_BY_CHAIN carries `HAVING SUM(tx_fee_usd) > 5`, so it sees fewer chains
 * than TX_BY_CHAIN does. The chain count comes from TX_BY_CHAIN for that
 * reason: a chain with one transaction on it is still a chain we reached.
 */
const Q = {
  USERS: 6627839,
  FEES: 6633618,
  FEES_BY_CHAIN: 6634734,
  TX_BY_CHAIN: 8802548,
  VOLUME: 8802566,
} as const;

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
  console.log('dune: no DUNE_API_KEY — keeping the committed figures.');
  process.exit(0);
}

async function rows(queryId: number): Promise<Record<string, unknown>[] | null> {
  // 200: a chain list, not a page of a long table. Every query here aggregates.
  const res = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results?limit=200`, {
    headers: { 'X-Dune-API-Key': key! },
  });
  if (!res.ok) {
    console.warn(`dune: query ${queryId} -> HTTP ${res.status}, skipped`);
    return null;
  }
  const body = (await res.json()) as {
    error?: unknown;
    result?: { rows?: Record<string, unknown>[] };
  };
  if (body.error) {
    console.warn(`dune: query ${queryId} -> ${String(body.error).slice(0, 60)}, skipped`);
    return null;
  }
  return body.result?.rows ?? null;
}

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

const [usersRows, feesRows, feeChainRows, txChainRows, volumeRows] = await Promise.all([
  rows(Q.USERS),
  rows(Q.FEES),
  rows(Q.FEES_BY_CHAIN),
  rows(Q.TX_BY_CHAIN),
  rows(Q.VOLUME),
]);

const usersOnboarded = usersRows?.[0] ? num(usersRows[0].total_count) : null;
const feesUsd = feesRows?.[0] ? num(feesRows[0].total_txn_fee) : null;
const volumeUsd = volumeRows?.[0] ? num(volumeRows[0].volume_usd) : null;

/** Fees keyed by chain, so the transaction rows can pick them up as they merge. */
const feeByChain = new Map<string, number>();
for (const r of feeChainRows ?? []) {
  const name = String(r.blockchain ?? '');
  if (name) feeByChain.set(name, num(r.total_txn_fee) ?? 0);
}

// Sorted by transactions, not by fees. Fees rank Ethereum first because L1 gas
// costs a thousand times what an L2 does — which says where the money went, not
// where the community is. Base leads on transactions by a factor of ten.
const chains = (txChainRows ?? [])
  .map((r) => ({
    name: String(r.blockchain ?? ''),
    txCount: num(r.tx_count) ?? 0,
    feesUsd: feeByChain.get(String(r.blockchain ?? '')) ?? 0,
  }))
  .filter((c) => c.name)
  .sort((a, b) => b.txCount - a.txCount);

const transactions = chains.reduce((sum, c) => sum + c.txCount, 0) || null;

if (usersOnboarded === null && feesUsd === null && volumeUsd === null && !chains.length) {
  console.warn('dune: nothing usable came back — keeping the committed figures.');
  process.exit(0);
}

const existing = (() => {
  try {
    return readFileSync(OUT, 'utf8');
  } catch {
    return '';
  }
})();

/** Keep a previous value rather than writing a hole when one query is down. */
const prev = (field: string): number =>
  Number(new RegExp(`${field}: ([\\d.]+)`).exec(existing)?.[1] ?? '0');

const users = usersOnboarded ?? prev('usersOnboarded');
const fees = feesUsd ?? prev('feesUsd');
const volume = volumeUsd ?? prev('volumeUsd');
const txs = transactions ?? prev('transactions');

const file = `/**
 * Generated by scripts/dune.mts — do not edit.
 *
 * The onchain figures from dune.com/ethcali, read from each query's last saved
 * run. Regenerate with \\\`npm run dune\\\`; \\\`npm run build\\\` does it for you, and
 * skips silently on a machine with no DUNE_API_KEY.
 *
 * Every figure covers the same population: the wallets in the Dune dataset
 * \\\`dataset_users_onboarded_eth_cali\\\`. They do not all cover the same tables,
 * so they are never presented as adding up:
 *
 * - \\\`transactions\\\` and \\\`chains[].txCount\\\` come from \\\`gas.fees\\\` — one row per
 *   transaction, every chain Dune indexes.
 * - \\\`volumeUsd\\\` comes from \\\`tokens.transfers\\\`, which counts token movement
 *   and not the transactions that carried it.
 * - \\\`feesUsd\\\` and the per-chain fees are a separate run from the totals and
 *   differ from their sum by a few dollars.
 */
export interface DuneChain {
  /** As Dune names it — 'avalanche_c', 'zkevm'. content/site.ts maps these for display. */
  name: string;
  txCount: number;
  /** 0 where the dashboard's fee query filtered the chain out for being under $5. */
  feesUsd: number;
}

export const DUNE = {
  /** The day this file was written, not the day the queries ran. */
  fetchedOn: '${new Date().toISOString().slice(0, 10)}',
  usersOnboarded: ${users},
  transactions: ${txs},
  volumeUsd: ${volume},
  feesUsd: ${fees},
  chains: [
${chains
  .map(
    (c) => `    { name: ${JSON.stringify(c.name)}, txCount: ${c.txCount}, feesUsd: ${c.feesUsd} },`
  )
  .join('\n')}
  ] as readonly DuneChain[],
} as const;
`;

writeFileSync(OUT, file, 'utf8');
const usd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
console.log(
  `dune: ${users} users · ${txs.toLocaleString('en-US')} txs · ${usd(volume)} moved · ${usd(fees)} fees · ${chains.length} chains -> content/dune.generated.ts`
);
