import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section, Address, LinkCard } from '../components/layout/Page';
import { ENS_NAMES, GOVERNANCE, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { APP } from '../lib/links';

interface Props {
  locale: Locale;
}

export default function Dao({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];

  const lead =
    locale === 'en'
      ? 'How decisions get made and where the treasury lives. Verifiable on chain: every address on this page links to a block explorer.'
      : 'Cómo se toman las decisiones y dónde vive la tesorería. Todo verificable en cadena: cada dirección de esta página enlaza a su explorador.';

  return (
    <Layout>
      <Seo title="ETH Cali DAO" description={lead} path="/dao" />

      <PageHeader
        eyebrow={locale === 'en' ? 'Governance' : 'Gobernanza'}
        title="ETH Cali DAO"
        lead={lead}
      />

      <Section
        eyebrow={locale === 'en' ? 'Identity' : 'Identidad'}
        title={locale === 'en' ? 'Our names on ENS' : 'Nuestros nombres en ENS'}
        lead={
          locale === 'en'
            ? "The organisation's identity in the Ethereum Name Service."
            : 'La identidad de la organización en Ethereum Name Service.'
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {ENS_NAMES.map((n) => (
            <div key={n.name} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="mono text-base font-bold text-content-primary">{n.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    n.status.en === 'Current'
                      ? 'bg-signal-confirmed/15 text-signal-confirmed'
                      : 'bg-surface-ridge text-content-muted'
                  }`}
                >
                  {t(n.status)}
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(n.detail)}</p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                {locale === 'en' ? 'Resolves to' : 'Resuelve a'}
              </p>
              <div className="mt-1">
                <Address value={n.address} />
              </div>

              {n.chains && (
                <p className="mt-3 text-xs text-content-faint">
                  {n.chains.join(' · ')}
                </p>
              )}

              <a
                href={`https://app.ens.domains/${n.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-eth-blue-text hover:underline"
              >
                {locale === 'en' ? 'View on ENS' : 'Ver en ENS'} →
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-prose text-sm text-content-faint">
          {locale === 'en'
            ? 'ethcali.eth has no reverse record, so the name resolves forward only — an explorer will show the address, not the name.'
            : 'ethcali.eth no tiene registro inverso, así que el nombre resuelve solo hacia adelante — un explorador mostrará la dirección, no el nombre.'}
        </p>
      </Section>

      <Section
        eyebrow={locale === 'en' ? 'How we decide' : 'Cómo decidimos'}
        title={locale === 'en' ? 'Governance structure' : 'Estructura de gobernanza'}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {GOVERNANCE.map((g) => (
            <LinkCard key={g.title} title={g.title} detail={t(g.detail)} url={g.url} cta={t(g.cta)} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow={locale === 'en' ? 'Treasury' : 'Tesorería'}
        title={locale === 'en' ? 'Where the funds are' : 'Dónde están los fondos'}
        lead={
          locale === 'en'
            ? 'A Safe multisig, 3 of 5. The same address on Ethereum, Base, Optimism, Unichain and Celo.'
            : 'Una multifirma Safe, 3 de 5. La misma dirección en Ethereum, Base, Optimism, Unichain y Celo.'
        }
      >
        <div className="rounded-card border border-line-hairline bg-surface-slab p-5">
          <Address value="0xB6BDe4fB6dFBad5488Fa31Edf0F3730D9D86da64" />
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href="https://app.safe.global/home?safe=eth:0xB6BDe4fB6dFBad5488Fa31Edf0F3730D9D86da64"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-eth-blue-text hover:underline"
            >
              {locale === 'en' ? 'Open in Safe' : 'Abrir en Safe'} →
            </a>
            <a
              href={APP.donations}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-eth-blue-text hover:underline"
            >
              {locale === 'en' ? 'Donate' : 'Donar'} →
            </a>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
