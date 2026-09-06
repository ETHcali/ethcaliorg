import type { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import { getEvents } from '../../lib/content';
import { asLocale, translator, type Locale } from '../../lib/i18n';

interface Props {
  locale: Locale;
  counts: { local: number; international: number };
}

export default function EventsHub({ locale, counts }: Props) {
  const t = translator(locale);

  const cards = [
    { href: '/events/local', title: t('events.local'), lead: t('events.localLead'), count: counts.local },
    {
      href: '/events/international',
      title: t('events.international'),
      lead: t('events.internationalLead'),
      count: counts.international,
    },
  ];

  return (
    <Layout>
      <Seo title={t('events.title')} description={t('events.lead')} path="/events" />

      <div className="mx-auto max-w-page px-gutter py-12">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
          {t('events.title')}
        </p>
        <h1 className="mt-2 text-4xl">{t('events.heading')}</h1>
        <p className="mt-4 max-w-prose text-base text-content-secondary">{t('events.lead')}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-card border border-line-hairline bg-surface-slab p-6 transition-colors hover:border-line-brand"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg">{c.title}</h2>
                <span className="mono text-sm text-content-faint">{c.count}</span>
              </div>
              <p className="mt-2 text-sm text-content-muted">{c.lead}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const [local, international] = await Promise.all([
    getEvents('local'),
    getEvents('international'),
  ]);

  return {
    props: {
      locale: asLocale(locale),
      counts: { local: local.length, international: international.length },
    },
    revalidate: 60,
  };
};
