import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { COLLECTIBLES, COLLECTIBLES_COPY, type Collectible } from '../content/collectibles';
import { chainLabel, type Bilingual } from '../content/site';
import { asLocale, formatDate, type Locale } from '../lib/i18n';
import { httpUrl } from '../lib/url';

interface Props {
  locale: Locale;
}

/**
 * Everything ETH Cali has issued onchain.
 *
 * The impact section says 441 wallets were onboarded and that they hold our
 * POAPs. This is the other half of that sentence: the things themselves, with a
 * link to each one on the chain, so the claim is checkable rather than asserted.
 *
 * Grouped by year and newest first, because the question a reader has is "are
 * they still doing this" and a list that opens in 2022 answers it last.
 */
function Card({ item, locale }: { item: Collectible; locale: Locale }) {
  const t = (b: Bilingual) => b[locale];
  const L = COLLECTIBLES_COPY.labels;
  const protocol = COLLECTIBLES_COPY.protocols[item.protocol];
  const href = httpUrl(item.url);
  const post = httpUrl(item.post);

  return (
    <li className="flex flex-col rounded-card border border-line-hairline bg-surface-slab p-5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-chip bg-eth-blue-wash px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-eth-blue-text"
          title={t(protocol.detail)}
        >
          {protocol.name}
        </span>
        <span className="rounded-chip border border-line-hairline px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-content-muted">
          {chainLabel(item.chain)}
        </span>
        {/* Only worth saying when it is more than one — a single lock is the
            normal case and a "1 contratos" chip is noise. */}
        {item.contracts && item.contracts.length > 1 && (
          <span className="rounded-chip border border-line-hairline px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-content-muted">
            {t(L.contracts).replace('{n}', String(item.contracts.length))}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-bold leading-snug text-content-primary">{item.name}</h3>

      <p className="mono mt-1 text-xs text-content-faint">
        {formatDate(item.date, locale, { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>

      {item.alsoUsedFor && (
        <p className="mt-2 text-xs leading-relaxed text-content-muted">
          {t(L.alsoUsedFor)}: {item.alsoUsedFor.join(' · ')}
        </p>
      )}

      {/* `!= null` and not a truthiness check: several of these were minted by
          nobody, and 0 collectors is a fact about the drop worth printing. */}
      {item.holders != null && (
        <p className="mt-3 text-sm text-content-secondary">
          <span className="mono font-bold text-content-primary">{item.holders}</span>{' '}
          {t(L.holders)}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-4 pt-1">
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-eth-blue-text hover:underline"
          >
            {t(L.view)} →
          </a>
        )}
        {post && (
          <a
            href={post}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-content-muted hover:text-content-primary hover:underline"
          >
            {t(L.post)} →
          </a>
        )}
      </div>
    </li>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-card border border-line-hairline bg-surface-slab p-4">
      <p className="mono text-2xl font-bold text-content-primary">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-content-faint">
        {label}
      </p>
    </div>
  );
}

export default function Collectibles({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const C = COLLECTIBLES_COPY;

  const sorted = [...COLLECTIBLES].sort((a, b) => b.date.localeCompare(a.date));
  const years = [...new Set(sorted.map((c) => c.date.slice(0, 4)))];

  const poaps = COLLECTIBLES.filter((c) => c.protocol === 'poap').length;
  const chains = new Set(COLLECTIBLES.map((c) => c.chain)).size;

  return (
    <Layout>
      <Seo title={t(C.title)} description={t(C.lead)} path="/collectibles" />

      <PageHeader eyebrow={t(C.eyebrow)} title={t(C.title)} lead={t(C.lead)} />

      <Section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={String(COLLECTIBLES.length)} label={t(C.stats.total)} />
          <Stat value={String(poaps)} label={t(C.stats.poaps)} />
          <Stat value={String(COLLECTIBLES.length - poaps)} label={t(C.stats.unlocks)} />
          <Stat value={String(chains)} label={t(C.stats.chains)} />
        </div>

        {/* What the two chips on every card mean, said once. */}
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {(['poap', 'unlock'] as const).map((k) => (
            <div key={k} className="border-l-2 border-line-brand pl-4">
              <dt className="text-sm font-bold text-eth-blue-text">{C.protocols[k].name}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-content-muted">
                {t(C.protocols[k].detail)}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {years.map((year) => (
        <Section key={year} title={year}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted
              .filter((c) => c.date.startsWith(year))
              .map((c) => (
                <Card key={`${c.protocol}-${c.url}-${c.date}`} item={c} locale={locale} />
              ))}
          </ul>
        </Section>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
