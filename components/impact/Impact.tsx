import { DUNE } from '../../content/dune.generated';
import { IMPACT, chainLabel, type Bilingual } from '../../content/site';
import type { Locale } from '../../lib/i18n';

/**
 * The impact figures, on the home page and on /about.
 *
 * One component because both pages showed the same numbers and the same caveat,
 * written twice — which is two places to update and one chance to forget. Five
 * of the six come from `content/dune.generated.ts`, written from the Dune
 * dashboard on every build.
 */
function Stat({ value, label, foot }: { value: string; label: string; foot?: string }) {
  return (
    <div className="rounded-card border border-line-hairline bg-surface-slab p-5">
      <p className="mono text-2xl font-bold text-content-primary sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm leading-snug text-content-secondary">{label}</p>
      {/* Only the hand-counted figure carries one, so a figure with no footnote
          is a figure straight off the chain. */}
      {foot && (
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-content-faint">
          {foot}
        </p>
      )}
    </div>
  );
}

export default function Impact({ locale }: { locale: Locale }) {
  const t = (b: Bilingual) => b[locale];
  const tag = locale === 'en' ? 'en-US' : 'es-CO';
  const n = (v: number) => Math.round(v).toLocaleString(tag);

  /**
   * $21.7M does not fit in a stat card at 320px, and `21.749.900` read as a
   * date to two people who saw it. Millions get a suffix; everything below
   * stays exact, because rounding $38,888 to "$39K" loses a real figure to save
   * three characters.
   */
  const usd = (v: number) =>
    v >= 1_000_000
      ? `$${(v / 1_000_000).toLocaleString(tag, { maximumFractionDigits: 1 })}M`
      : `$${n(v)}`;

  const top = DUNE.chains.slice(0, IMPACT.topChains);
  const rest = DUNE.chains.length - top.length;
  // Bars scale against the busiest chain, not against the total: Base is nearly
  // a third of everything, so a share-of-total scale renders the other seven as
  // slivers and says nothing.
  const max = top[0]?.txCount ?? 1;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat value={n(DUNE.usersOnboarded)} label={t(IMPACT.labels.users)} />
        <Stat value={n(DUNE.transactions)} label={t(IMPACT.labels.transactions)} />
        <Stat value={usd(DUNE.volumeUsd)} label={t(IMPACT.labels.volume)} />
        <Stat value={usd(DUNE.feesUsd)} label={t(IMPACT.labels.fees)} />
        <Stat value={n(DUNE.chains.length)} label={t(IMPACT.labels.chains)} />
        <Stat
          value={IMPACT.handCounted.value}
          label={t(IMPACT.handCounted.label)}
          foot={t(IMPACT.handCounted.foot)}
        />
      </div>

      {/* The breakdown is the point of the chains number: 59 is abstract until
          you see that it runs from Base to Unichain. Ranked by transactions
          rather than by fees — fees put Ethereum first because L1 gas costs a
          thousand times what an L2 does, which says where the money went and
          not where the community is. */}
      {top.length > 0 && (
        <div className="mt-6 rounded-card border border-line-hairline bg-surface-slab p-5 sm:p-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-content-faint">
            {t(IMPACT.labels.byChain)} · {t(IMPACT.labels.byChainUnit)}
          </h3>

          <ul className="mt-4 space-y-2.5">
            {top.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className="w-20 shrink-0 truncate text-sm text-content-secondary sm:w-28">
                  {chainLabel(c.name)}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-inset">
                  <span
                    className="block h-full rounded-full bg-eth-blue"
                    style={{ width: `${Math.max(2, (c.txCount / max) * 100)}%` }}
                  />
                </span>
                <span className="mono w-16 shrink-0 text-right text-xs text-content-muted sm:w-20">
                  {n(c.txCount)}
                </span>
              </li>
            ))}
          </ul>

          {rest > 0 && (
            <p className="mt-4 text-xs text-content-muted">
              {t(IMPACT.labels.others).replace('{n}', String(rest))}
            </p>
          )}
        </div>
      )}

      {/* Where the list came from. The figures are only as good as the wallets
          behind them, and "441" means nothing until a reader knows it is the
          people who showed up to an event and took the POAP. */}
      <p className="mt-5 max-w-prose text-xs leading-relaxed text-content-muted">
        {t(IMPACT.source).replace('{n}', n(DUNE.usersOnboarded))}
      </p>

      <a
        href={IMPACT.dashboardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-tap items-center rounded-control border border-line-strong px-5 text-sm font-semibold text-content-primary transition-colors hover:border-eth-blue hover:bg-eth-blue-wash"
      >
        {t(IMPACT.cta)} →
      </a>
    </>
  );
}
