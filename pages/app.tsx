import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { LinkCard, PageHeader, Section } from '../components/layout/Page';
import { APP_AREAS, APP_FEATURES, APP_NETWORKS, APP_SIGNIN } from '../content/app';
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
 * This page exists because the app's own landing page is in English and sits
 * behind a different origin with none of this site's navigation around it. A
 * reader who has never used a wallet should be able to find out what it is in
 * Spanish, on ethcali.org, and only then decide to leave.
 */

/** The filled CTA, used at the top of the page and again at the bottom. */
function GoToApp({ label }: { label: string }) {
  return (
    <a
      href={appEntry()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-tap items-center rounded-control bg-eth-blue px-6 text-sm font-bold text-on-brand transition-colors hover:bg-eth-blue-lift"
    >
      {label} →
    </a>
  );
}

export default function AppPage({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  const lead = en
    ? 'A self-custody wallet built for this community: sign in with an email or a passkey, keep your own keys, and let ETH Cali cover the gas. It is where the faucet, the swag store, identity verification and the donation campaigns live.'
    : 'Una wallet de autocustodia hecha para esta comunidad: entras con correo o passkey, las llaves quedan tuyas y ETH Cali paga el gas. Ahí viven el faucet, la tienda de swag, la verificación de identidad y las campañas de donación.';

  const goToApp = en ? 'Go to app' : 'Ir a la app';

  return (
    <Layout>
      <Seo title={en ? 'The ETH Cali app' : 'La app de ETH Cali'} description={lead} path="/app" />

      <PageHeader
        eyebrow="app.ethcali.org"
        title={en ? 'The ETH Cali app' : 'La app de ETH Cali'}
        lead={lead}
      />

      <Section>
        <GoToApp label={goToApp} />

        {/* The question everyone actually has, answered before they click.
            Most people hear "wallet" and assume they have to install something
            and write down twelve words, and that assumption is where they stop. */}
        <div className="mt-8 rounded-card border border-line-hairline bg-surface-slab p-5">
          <h2 className="text-base font-bold text-content-primary">
            {en ? 'You do not need to install anything' : 'No necesitas instalar nada'}
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-content-muted">
            {en
              ? 'It runs in the browser. Sign in with any of these and a wallet is created for you — there are no twelve words to write down, and you can export the keys or connect a wallet you already have at any point.'
              : 'Funciona en el navegador. Entras con cualquiera de estos y la wallet se crea sola — no hay doce palabras que anotar, y en cualquier momento puedes exportar las llaves o conectar una wallet que ya tengas.'}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
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
      </Section>

      {/* One tile per destination. Each links where it says it links: the three
          that need a session go through the app's front door carrying their
          destination, the two that are public deep-link straight in. That
          distinction is made once, in content/app.ts, not here. */}
      <Section
        eyebrow={en ? 'What is inside' : 'Qué hay adentro'}
        title={en ? 'Five places it takes you' : 'Cinco lugares a los que te lleva'}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APP_AREAS.map((area) => (
            <LinkCard
              key={area.title.es}
              title={t(area.title)}
              detail={t(area.detail)}
              url={area.url}
              cta={t(area.cta)}
            />
          ))}
        </div>
      </Section>

      <Section
        eyebrow={en ? 'Why this one' : 'Por qué esta'}
        title={en ? 'What makes it different' : 'Qué la hace distinta'}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {APP_FEATURES.map((f) => (
            <div
              key={f.n}
              className="rounded-card border border-line-hairline bg-surface-slab p-5"
            >
              <p className="mono text-[11px] tracking-widest text-content-faint">/{f.n}</p>
              <h3 className="mt-3 text-base font-bold text-content-primary">{t(f.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(f.detail)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={en ? 'Networks' : 'Redes'}
        title={en ? 'The same address on five chains' : 'La misma dirección en cinco cadenas'}
      >
        <ul className="flex flex-wrap gap-2">
          {APP_NETWORKS.map((n) => (
            <li
              key={n.name}
              className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-content-secondary"
            >
              <span className="mono">{n.name}</span>
              {n.note && <span className="text-content-faint">· {t(n.note)}</span>}
            </li>
          ))}
        </ul>
      </Section>

      {/* Said here rather than discovered on arrival. Sending a reader from a
          Spanish page to an English app without warning is the kind of thing
          that reads as a broken link. */}
      <Section>
        <div className="rounded-card border border-line-brand bg-eth-blue-wash p-6">
          <h2 className="text-lg font-bold text-content-primary">
            {en ? 'One thing to know first' : 'Algo que debes saber antes'}
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-content-secondary">
            {en
              ? 'The app itself is in English for now — this page is the Spanish explanation of it. Translating the app is work in progress.'
              : 'La app todavía está en inglés — esta página es la explicación en español. Traducirla está en la lista.'}
          </p>
          <div className="mt-5">
            <GoToApp label={goToApp} />
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
