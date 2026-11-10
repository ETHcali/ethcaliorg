import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { EthPriceQuote as Quote } from '../../lib/ethPrice';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * ETH/USD in the header: Ethereum's logo, the price, the 24h move (from md up).
 * Fetched after mount and every 15 minutes, never at build — a price baked
 * into a static page would be wrong by the time anyone read it. The move is
 * ▲/▼ in neutral text: the signal colours are for on-chain state only.
 */
export function EthPrice({ locale }: { locale: 'es' | 'en' }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch('/api/eth-price');
        if (!res.ok) throw new Error(String(res.status));
        const q = (await res.json()) as Quote;
        if (alive) {
          setQuote(q);
          setFailed(false);
        }
      } catch {
        // Keep the last good quote on screen; only a first failure shows a dash.
        if (alive) setFailed(true);
      }
    };
    void load();
    const id = window.setInterval(load, FIFTEEN_MINUTES);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  const es = locale === 'es';
  const title = quote
    ? `ETH ${usd(quote.usd)} · ${quote.source === 'coingecko' ? 'CoinGecko' : 'Coinbase'} · ${es ? 'actualizado' : 'updated'} ${new Date(
        quote.fetchedAt
      ).toLocaleTimeString(es ? 'es-CO' : 'en-US', { hour: '2-digit', minute: '2-digit' })} · ${es ? 'cada 15 min' : 'every 15 min'}`
    : failed
      ? es
        ? 'Precio de ETH no disponible'
        : 'ETH price unavailable'
      : es
        ? 'Cargando precio de ETH'
        : 'Loading ETH price';

  return (
    <span
      className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-chip border border-line-hairline px-2.5 font-mono text-[11px] tabular-nums text-content-secondary"
      title={title}
      aria-label={title}
    >
      {/* ethereum.org's own glyph (public/chains/ethereum.png), not a drawn
          diamond: the price is of Ether, so it wears Ether's mark. */}
      <Image src="/chains/ethereum.png" alt="" width={11} height={16} className="h-4 w-auto" aria-hidden />
      <span className="text-content-primary">{quote ? usd(quote.usd) : failed ? '—' : '…'}</span>
      {quote?.change24h != null && (
        <span className="hidden text-content-muted md:inline">
          {quote.change24h >= 0 ? '▲' : '▼'} {Math.abs(quote.change24h).toFixed(2)}%
        </span>
      )}
    </span>
  );
}
