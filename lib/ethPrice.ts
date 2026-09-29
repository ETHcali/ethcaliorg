/** What /api/eth-price returns and the header ticker reads. */
export interface EthPriceQuote {
  usd: number;
  /** Percent; null from Coinbase, which has no 24h change on its spot endpoint. */
  change24h: number | null;
  source: 'coingecko' | 'coinbase';
  fetchedAt: string;
}
