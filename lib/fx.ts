/**
 * TRM — Tasa Representativa del Mercado, the official COP/USD rate.
 *
 * The store prices in USD and a Colombian visitor thinks in pesos, so every
 * card carries a peso line. It is computed at build time from the rate the
 * Superintendencia Financiera publishes, never from a number typed into this
 * repo: a hardcoded rate is right on the day it is written and quietly wrong
 * every day after, and the wallet app already learned that lesson (its
 * `/api/fx/trm` fell back to 4000 while the real rate was ~3063).
 *
 * Same dataset and query as `wallet_ethcali/pages/api/fx/trm.ts`. Kept
 * deliberately smaller: this site only ever needs the rate in force now.
 */

const DATASET = 'https://www.datos.gov.co/resource/32sa-8pi3.json';

export interface Trm {
  /** How many COP one USD buys. */
  rate: number;
  /** Inclusive first day this rate is in force, ISO date. */
  validFrom: string;
}

interface TrmRow {
  valor: string;
  vigenciadesde: string;
}

/**
 * The TRM in force today, or null.
 *
 * Null, not a throw and not a fallback: the catalogue page must still build
 * when datos.gov.co is down, and it does so by dropping the peso line rather
 * than showing a peso figure nobody can stand behind.
 */
export async function getTrm(): Promise<Trm | null> {
  try {
    const res = await fetch(`${DATASET}?$limit=1&$order=vigenciadesde%20DESC`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error(`datos.gov.co responded ${res.status}`);

    const rows = (await res.json()) as TrmRow[];
    const row = rows[0];
    if (!row) throw new Error('no TRM rows returned');

    const rate = Number(row.valor);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error(`unusable TRM value "${row.valor}"`);

    return { rate, validFrom: row.vigenciadesde.slice(0, 10) };
  } catch (e) {
    console.warn(`[fx] TRM unavailable, building without COP prices: ${(e as Error).message}`);
    return null;
  }
}

/** A USD amount in pesos at the given rate, rounded to the nearest thousand. */
export function usdToCopRounded(usd: number, rate: number): number {
  return Math.round((usd * rate) / 1_000) * 1_000;
}
