import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import Reveal from '../components/layout/Reveal';
import { APP_AREAS, APP_SIGNIN } from '../content/app';
import type { Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { appEntry } from '../lib/links';

interface Props {
  locale: Locale;
}

/**
 * /app — what app.ethcali.org is, before you open it.
 *
 * `pages/app.tsx` is an ordinary route. `pages/_app.tsx` is the reserved one and
 * is a different file; Next only treats the underscore names specially.
 *
 * A scroll story, not a document: one sentence up top, then one panel per area
 * of the app — image, headline, one line, a way in — revealed as you reach it.
 * The images are the same set the app's own landing page uses, so the two read
 * as one product. The app is in English and on another origin; this page is the
 * Spanish explanation, and says so once, at the end, next to the last button.
 */

/** The filled CTA, used in the hero and again at the end. */
function GoToApp({ label }: { label: string }) {
  return (
    <a
      href={appEntry()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-tap items-center rounded-control bg-eth-blue px-6 text-sm font-bold text-on-brand transition-[background-color,transform] duration-150 ease-out hover:bg-eth-blue-lift active:scale-[0.97] motion-reduce:active:scale-100"
    >
      {label} →
    </a>
  );
}

export default function AppPage({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  const tagline = en ? 'One wallet. The community pays the gas.' : 'Una wallet. El gas lo pone la comunidad.';
  const description = en
    ? 'A self-custody wallet for the ETH Cali community: sign in with email or a passkey, keep your keys, and let ETH Cali pay the gas.'
    : 'Una wallet de autocustodia para la comunidad de ETH Cali: entras con correo o passkey, las llaves son tuyas y ETH Cali paga el gas.';
  const goToApp = en ? 'Go to app' : 'Ir a la app';

  return (
    <Layout>
      <Seo title={en ? 'The ETH Cali app' : 'La app de ETH Cali'} description={description} path="/app" />

      {/* ── Hero: one sentence, one button, how you get in ── */}
      <section className="relative overflow-hidden">
        {/* The one gradient the brand allows: ultramarine to transparent, ≤16%. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(55% 60% at 80% 20%, rgb(var(--eth-blue-rgb) / 0.16), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-page px-gutter pb-16 pt-14 sm:pb-24 sm:pt-20">
          <p className="mono text-[11px] uppercase tracking-widest text-eth-blue-text">app.ethcali.org</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            {en ? 'The ETH Cali app' : 'La app de ETH Cali'}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-content-secondary sm:text-xl">{tagline}</p>
          <div className="mt-8">
            <GoToApp label={goToApp} />
          </div>
          <div className="mt-10">
            <p className="text-sm text-content-faint">
              {en ? 'Nothing to install. Sign in with:' : 'Sin instalar nada. Entras con:'}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {APP_SIGNIN.map((method) => (
                <li
                  key={method.es}
                  className="inline-flex min-h-[36px] items-center rounded-full border border-line-strong px-4 text-sm text-content-secondary"
                >
                  {t(method)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── One panel per area, image and text alternating sides ── */}
      <div className="border-t border-line-hairline">
        {APP_AREAS.map((area, i) => {
          const flip = i % 2 === 1;
          return (
            <section
              key={area.title.es}
              aria-labelledby={`area-${i}`}
              className="border-b border-line-hairline"
            >
              <div className="mx-auto grid max-w-page items-center gap-6 px-gutter py-12 sm:py-16 md:min-h-[70vh] md:grid-cols-2 md:gap-12 md:py-20">
                <Reveal className={flip ? 'md:order-2' : ''}>
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px]">
                    {/* Decorative: the headline says what the area is. */}
                    <Image
                      src={area.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 520px, 92vw"
                      className="object-contain [mask-image:radial-gradient(ellipse_closest-side_at_center,black_60%,transparent_100%)]"
                    />
                  </div>
                </Reveal>
                <Reveal delay={90}>
                  <p className="mono text-[11px] uppercase tracking-widest text-content-faint">
                    /{String(i + 1).padStart(2, '0')} · {t(area.title)}
                  </p>
                  <h2 id={`area-${i}`} className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                    {t(area.headline)}
                  </h2>
                  <p className="mt-4 max-w-md text-base text-content-secondary sm:text-lg">{t(area.detail)}</p>
                  <a
                    href={area.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-tap items-center text-sm font-semibold text-eth-blue-text transition-colors hover:text-content-primary"
                  >
                    {t(area.cta)} →
                  </a>
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Close: the one chain, the language caveat, the button again ── */}
      <section className="mx-auto max-w-page px-gutter py-16 sm:py-24">
        <Reveal>
          <div className="rounded-card border border-line-brand bg-eth-blue-wash p-6 sm:p-10">
            <p className="mono text-[11px] uppercase tracking-widest text-eth-blue-text">Ethereum mainnet</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
              {en ? 'Everything happens on Ethereum.' : 'Todo pasa en Ethereum.'}
            </h2>
            <p className="mt-3 max-w-prose text-content-secondary">
              {en
                ? 'The app is in English for now; this page is the Spanish guide to it.'
                : 'La app está en inglés por ahora; esta página es la guía en español.'}
            </p>
            <div className="mt-6">
              <GoToApp label={goToApp} />
            </div>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
