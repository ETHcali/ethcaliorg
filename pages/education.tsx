import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section, LinkCard } from '../components/layout/Page';
import { LEARNING_PATH, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';

interface Props {
  locale: Locale;
}

export default function Education({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];

  const lead =
    locale === 'en'
      ? 'What we recommend to get from zero to Web3 developer. All of it is free, or has a free tier.'
      : 'Los recursos que recomendamos para pasar de cero a desarrollador Web3. Todos son gratuitos o tienen una versión gratuita.';

  return (
    <Layout>
      <Seo title={locale === 'en' ? 'Web3 education' : 'Educación Web3'} description={lead} path="/education" />

      <PageHeader
        eyebrow={locale === 'en' ? 'Learn' : 'Aprender'}
        title={locale === 'en' ? 'Web3 education' : 'Educación Web3'}
        lead={lead}
      />

      {LEARNING_PATH.map((step) => (
        <Section
          key={step.step}
          eyebrow={`${locale === 'en' ? 'Step' : 'Paso'} ${step.step}`}
          title={t(step.title)}
          lead={t(step.lead)}
        >
          {/* Step 2 is a reference list of languages, not courses — chips read
              better there than cards, and keep the page from doubling in height. */}
          {step.step === 2 ? (
            <ul className="flex flex-wrap gap-2">
              {step.resources.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-chip border border-line-hairline bg-surface-slab px-3.5 text-sm text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
                  >
                    {r.name}
                    <span className="text-[10px] uppercase tracking-wide text-content-faint">
                      {t(r.detail)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {step.resources.map((r) => (
                <LinkCard
                  key={r.url}
                  title={r.name}
                  detail={t(r.detail)}
                  url={r.url}
                  cta={locale === 'en' ? 'Open' : 'Ver'}
                />
              ))}
            </div>
          )}
        </Section>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
