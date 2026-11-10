/**
 * GET /api/eth-price — ETH/USD for the header ticker.
 *
 * CoinGecko first (it has the 24h change), Coinbase spot if it fails.
 * Edge-cached 15 minutes, so the whole site's traffic is one upstream call
 * per window. 503 when neither answers: the ticker then shows a dash, never
 * a guessed price.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { EthPriceQuote as EthPrice } from '../../lib/ethPrice';


const TIMEOUT_MS = 5000;
const valid = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

async function fromCoinGecko(): Promise<EthPrice> {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true', {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const q = ((await res.json()) as { ethereum?: { usd?: number; usd_24h_change?: number } }).ethereum;
  if (!q || !valid(q.usd)) throw new Error('CoinGecko returned no price');
  return { usd: q.usd, change24h: typeof q.usd_24h_change === 'number' ? q.usd_24h_change : null, source: 'coingecko', fetchedAt: new Date().toISOString() };
}

async function fromCoinbase(): Promise<EthPrice> {
  const res = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot', { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Coinbase ${res.status}`);
  const usd = Number(((await res.json()) as { data?: { amount?: string } }).data?.amount);
  if (!valid(usd)) throw new Error('Coinbase returned no price');
  return { usd, change24h: null, source: 'coinbase', fetchedAt: new Date().toISOString() };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<EthPrice | { error: string }>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const price = await fromCoinGecko().catch(fromCoinbase);
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=300');
    return res.status(200).json(price);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'ETH price unavailable' });
  }
}
