import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { asLocale, translator } from '../lib/i18n';
import { FRONTIER } from '../content/quest';

/**
 * The 404.
 *
 * There wasn't one, so a mistyped or retired URL got Next's built-in page: white
 * background, system font, no navigation, and no way back other than the browser
 * button. On a site whose campaign URLs go out in Facebook ads and WhatsApp
 * forwards, that is the page a real fraction of visitors see.
 *
 * `noindex` is the SEO half. A 404 that renders a full page of chrome can be
 * read as a soft 404 and indexed as a thin page; saying so outright removes the
 * ambiguity. The links below are the other half — a dead end that offers the
 * three places people were most likely heading is a recovered visit rather than
 * a bounce.
 */

const COPY = {
  code: { es: '404', en: '404' },
  title: { es: 'Esta página no existe', en: 'This page does not exist' },
  lead: {
    es: 'El enlace puede estar viejo o mal escrito. Estos son los sitios a donde suele ir la gente.',
    en: 'The link may be old or mistyped. These are the places people are usually looking for.',
  },
  home: { es: 'Volver al inicio', en: 'Back to the home page' },
};

export default function NotFound() {
  const router = useRouter();
  const locale = asLocale(router.locale);
  const t = translator(locale);
  const c = (k: keyof typeof COPY) => COPY[k][locale];

  const destinations = [
    { href: '/builders-tour', label: t('nav.tour') },
    { href: FRONTIER.path, label: t('nav.frontier') },
    { href: '/events/local', label: t('nav.events') },
    { href: '/hackathons', label: t('nav.hackathons') },
    { href: '/about', label: t('nav.about') },
  ];

  return (
    <Layout>
      <Head>
        <title>{`${c('title')} | ETH Cali`}</title>
        {/* Not a page anyone should land on from a search result. */}
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="mx-auto max-w-page px-gutter py-20 sm:py-28">
        <p className="mono text-sm font-bold text-eth-blue-text">{c('code')}</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">{c('title')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">{c('lead')}</p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {destinations.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="inline-flex min-h-tap items-center rounded-chip border border-line-hairline px-4 text-sm font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
              >
                {d.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-tap items-center text-sm font-semibold text-eth-blue-text hover:underline"
        >
          {c('home')} →
        </Link>
      </div>
    </Layout>
  );
}
