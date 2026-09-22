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
      {/* Four of the six carry one. The three activity totals all disclaim the
          same thing and could have said it once, above the grid — but these
          cards get screenshotted one at a time, and a caveat that lives in a
          caption the screenshot cropped out is a caveat that does not exist. */}
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

  /**
   * Compact, for the bar rows. US$11,9M and US$641K sit in the same narrow
   * column; the full figure would wrap and the column would have to be twice
   * as wide to hold a number nobody reads digit by digit.
   *
   * `US$` rather than `$`: the stat cards say "USD" in their label, but these
   * rows have no label of their own and the site's first audience counts in
   * pesos, where `$` is the peso sign. The header names the currency too; the
   * figure repeats it because rows get read one at a time.
   */
  const usdShort = (v: number) =>
    v >= 1_000_000
      ? `US$${(v / 1_000_000).toLocaleString(tag, { maximumFractionDigits: 1 })}M`
      : v >= 1_000
        ? `US$${Math.round(v / 1_000).toLocaleString(tag)}K`
        : `US$${n(v)}`;

  const top = DUNE.chains.slice(0, IMPACT.topChains);
  const rest = DUNE.chains.length - top.length;
  // Bars scale against the biggest chain, not against the total: Ethereum is
  // more than half the value moved, so a share-of-total scale renders the other
  // seven as slivers and says nothing.
  const max = top[0]?.volumeUsd ?? 1;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat value={n(DUNE.usersOnboarded)} label={t(IMPACT.labels.users)} />
        <Stat
          value={n(DUNE.transactions)}
          label={t(IMPACT.labels.transactions)}
          foot={t(IMPACT.feet.transactions)}
        />
        <Stat value={usd(DUNE.volumeUsd)} label={t(IMPACT.labels.volume)} foot={t(IMPACT.feet.volume)} />
        <Stat value={usd(DUNE.feesUsd)} label={t(IMPACT.labels.fees)} foot={t(IMPACT.feet.fees)} />
        <Stat value={n(DUNE.chains.length)} label={t(IMPACT.labels.chains)} />
        <Stat
          value={IMPACT.handCounted.value}
          label={t(IMPACT.handCounted.label)}
          foot={t(IMPACT.handCounted.foot)}
        />
      </div>

      {/* The breakdown is the point of the chains number: 59 is abstract until
          you see the spread behind it. Ranked by value moved, which is the
          figure a reader came for. It tells a different story from the
          transaction count and both are true — Base carries ten times
          Ethereum's transactions, Ethereum carries six times Base's value. */}
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
                    style={{ width: `${Math.max(2, (c.volumeUsd / max) * 100)}%` }}
                  />
                </span>
                <span className="mono w-[4.5rem] shrink-0 text-right text-xs text-content-muted sm:w-24">
                  {usdShort(c.volumeUsd)}
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
