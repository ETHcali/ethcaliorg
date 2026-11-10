import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { APP_AREAS, APP_TOOLS } from '../content/app';
import type { Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { appEntry } from '../lib/links';

interface Props {
  locale: Locale;
}

/**
 * /app — app.ethcali.org's landing page, on this site and in both languages.
 *
 * `pages/app.tsx` is an ordinary route. `pages/_app.tsx` is the reserved one and
 * is a different file; Next only treats the underscore names specially.
 *
 * Laid out like the app's own signed-out page (wallet_ethcali/pages/index.tsx)
 * so the two read as one product: the same headline, the same six cells with
 * the same images, the same order. Two additions the app does not need: the
 * network and the integrations in one band under the hero (the strip moves),
 * and, in Spanish, a line saying the app itself is in English.
 */

const ETH_LOGO = '/chains/ethereum.png';

function GoToApp({ label }: { label: string }) {
  return (
    <a
      href={appEntry()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[56px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control bg-eth-blue px-7 text-base font-bold text-on-brand transition-[background-color,transform] duration-150 ease-out hover:bg-eth-blue-lift active:scale-[0.97] motion-reduce:active:scale-100"
    >
      {label} →
    </a>
  );
}

function ToolLink({ name, logo, url, hidden }: { name: string; logo: string; url: string; hidden?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      // The second copy exists only to close the loop; keep it out of the
      // tab order and away from screen readers.
      {...(hidden ? { tabIndex: -1, 'aria-hidden': true } : {})}
      className="flex min-h-tap shrink-0 items-center gap-3 rounded-full border border-line-hairline bg-surface-slab px-5 text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
    >
      <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
      <span className="mono text-sm">{name}</span>
    </a>
  );
}

export default function AppPage({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  const lead = en
    ? 'A self-custody wallet that feels like a fintech app. Sign in with email or a passkey, keep your own keys, and let the ETH Cali community cover the gas.'
    : 'Una wallet de autocustodia que se siente como una app fintech. Entras con correo o passkey, las llaves son tuyas y la comunidad de ETH Cali paga el gas.';
  const goToApp = en ? 'Open the app' : 'Abrir la app';

  return (
    <Layout>
      <Seo title={en ? 'The ETH Cali app' : 'La app de ETH Cali'} description={lead} path="/app" />

      {/* ── Hero: the app's own headline ── */}
      <section className="relative overflow-hidden">
        {/* The only gradient the brand allows: ultramarine to transparent, ≤16%. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 55% at 78% 18%, rgb(var(--eth-blue-rgb) / 0.16), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-page px-gutter pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-24">
          <p className="mono mb-4 text-[11px] uppercase tracking-[0.16em] text-eth-blue-text">
            {en ? 'Wallet · Cali, Colombia' : 'Wallet · Cali, Colombia'}
          </p>
          <h1 className="max-w-3xl text-[44px] font-black leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            {en ? (
              <>Your keys.<br /> Our gas.</>
            ) : (
              <>Tus llaves.<br /> Nuestro gas.</>
            )}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-content-secondary sm:mt-6 sm:text-lg">{lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <GoToApp label={goToApp} />
            <p className="mono text-xs text-content-faint">
              gas 0.00 <span className="text-signal-confirmed">· {en ? 'sponsored' : 'patrocinado'}</span>{' '}
              {en ? 'on Ethereum' : 'en Ethereum'}
            </p>
          </div>
          {!en && (
            <p className="mt-4 text-sm text-content-faint">La app está en inglés por ahora; esta página es la guía en español.</p>
          )}
        </div>
      </section>

      {/* ── Network + built on: one band straight under the hero ──
          The chain on the left, what the app is built on moving beside it, so
          both read before the six areas instead of after them. Stacks on a
          phone: the network row, then the strip at full width. */}
      <section aria-label={en ? 'Network and integrations' : 'Red e integraciones'} className="border-y border-line-hairline bg-surface-slab">
        <div className="mx-auto flex max-w-page flex-col gap-5 py-6 lg:flex-row lg:items-center lg:gap-8 lg:px-gutter">
          <div className="flex shrink-0 items-center gap-4 px-gutter lg:border-r lg:border-line-hairline lg:px-0 lg:pr-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-paper">
              <Image src={ETH_LOGO} alt="Ethereum" width={20} height={30} className="h-7 w-auto" />
            </span>
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.16em] text-content-faint">{en ? 'Network' : 'Red'}</p>
              <p className="text-base font-bold">Ethereum mainnet</p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p id="tools-heading" className="mono mb-3 px-gutter text-[11px] uppercase tracking-[0.16em] text-content-faint lg:px-0">
              {en ? 'Built on' : 'Construida con'}
            </p>
            <div
              aria-labelledby="tools-heading"
              className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:[mask-image:none]"
            >
              <div className="marquee-track flex w-max gap-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:px-gutter lg:motion-reduce:px-0">
                <div className="flex shrink-0 gap-3 motion-reduce:flex-wrap">
                  {APP_TOOLS.map((tool) => (
                    <ToolLink key={tool.name} {...tool} />
                  ))}
                </div>
                <div className="flex shrink-0 gap-3 motion-reduce:hidden" aria-hidden>
                  {APP_TOOLS.map((tool) => (
                    <ToolLink key={tool.name} {...tool} hidden />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The six areas, as on the app ── */}
      <section aria-labelledby="areas-heading" className="mx-auto max-w-page px-gutter pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-24 lg:pt-16">
        <h2 id="areas-heading" className="mono mb-6 text-[11px] font-normal uppercase tracking-[0.16em] text-content-faint">
          {en ? 'What you can do here' : 'Lo que puedes hacer'}
        </h2>
        {/* The 1px gap over a hairline background draws the grid lines. */}
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line-hairline bg-line-hairline sm:grid-cols-2 lg:grid-cols-3">
          {APP_AREAS.map((area, i) => (
            <li key={area.url} className="flex">
              <a
                href={area.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full w-full flex-col bg-surface-void text-left"
              >
                <span className="relative block aspect-[16/10] overflow-hidden">
                  {/* Decorative: the title says what the cell is. */}
                  <Image
                    src={area.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-contain opacity-90 transition-opacity duration-200 [mask-image:radial-gradient(ellipse_closest-side_at_center,black_60%,transparent_100%)] group-hover:opacity-100 motion-reduce:transition-none"
                  />
                </span>
                <span className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
                  <span className="mono mb-3 text-[11px] tracking-[0.16em] text-content-faint">
                    /{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mb-2 block text-lg font-bold leading-snug text-content-primary sm:text-xl">{t(area.title)}</span>
                  <span className="mb-5 block flex-1 text-sm leading-relaxed text-content-muted">{t(area.detail)}</span>
                  <span className="inline-flex min-h-tap items-center gap-2 text-sm font-semibold text-eth-blue-text group-hover:text-content-primary">
                    {t(area.cta)} →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
