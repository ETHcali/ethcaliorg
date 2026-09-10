import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import QuestForm from '../components/quest/QuestForm';
import { QUEST, QUEST_CITIES, QUEST_COPY, QUEST_STEPS } from '../content/quest';
import { SHANHAIWOO, type Bilingual } from '../content/builders-tour';
import { asLocale, type Locale } from '../lib/i18n';

interface Props {
  locale: Locale;
}

export default function Quest({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  return (
    <Layout>
      <Seo
        title={t(QUEST_COPY.title)}
        description={t(QUEST_COPY.lead)}
        path="/quest"
        image={SHANHAIWOO.poster}
        type="article"
      />

      <PageHeader
        eyebrow={t(QUEST_COPY.eyebrow)}
        title={t(QUEST_COPY.title)}
        lead={t(QUEST_COPY.lead)}
      />

      {/* The artwork carries the idea faster than any paragraph: this is a real
          month in three real cities, not an abstraction. */}
      <Section>
        <div className="overflow-hidden rounded-card border border-line-brand">
          <a
            href={SHANHAIWOO.site}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <Image
              src={SHANHAIWOO.poster}
              alt={`${SHANHAIWOO.name} 2026`}
              width={1200}
              height={675}
              sizes="(min-width: 1024px) 1000px, 92vw"
              className="h-auto w-full"
              priority
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4"
              style={{ background: 'linear-gradient(to top, rgb(6 6 11 / 0.85), transparent)' }}
            >
              <p className="mono text-sm font-bold text-content-primary">{t(QUEST.window)}</p>
              <span className="text-xs font-semibold text-eth-blue-text opacity-0 transition-opacity group-hover:opacity-100">
                shanhaiwoo.com →
              </span>
            </div>
          </a>
        </div>
      </Section>

      <Section title={t(QUEST_COPY.howTitle)}>
        <ol className="grid gap-4 sm:grid-cols-3">
          {QUEST_STEPS.map((s) => (
            <li key={s.n} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <p className="mono text-2xl font-bold text-eth-blue-text">{s.n}</p>
              <h3 className="mt-3 text-base font-bold text-content-primary">{t(s.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(s.detail)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title={t(QUEST_COPY.citiesTitle)}
        lead={
          en
            ? 'Three cities, one window. Pick the one your mission belongs to, or say you are not sure.'
            : 'Tres ciudades, una sola ventana. Elige la que corresponde a tu misión, o dinos que no estás seguro.'
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {QUEST_CITIES.map((city) => (
            <div
              key={city.id}
              className="flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab"
            >
              {/* A card without artwork keeps the same shape, so the row does not
                  go ragged while the remaining city images are sourced. */}
              <div className="relative aspect-[16/9] bg-surface-inset">
                {city.image ? (
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 92vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse at 30% 20%, var(--eth-blue-wash), transparent 65%)',
                    }}
                    aria-hidden
                  />
                )}
                <div
                  className="absolute inset-x-0 bottom-0 p-4"
                  style={{ background: 'linear-gradient(to top, rgb(6 6 11 / 0.85), transparent)' }}
                >
                  <h3 className="text-lg font-bold text-content-primary">{city.name}</h3>
                  <p className="mono text-xs text-content-muted">{t(city.dates)}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm leading-relaxed text-content-secondary">{t(city.known)}</p>
                <ul className="mt-4 space-y-2">
                  {city.examples.map((ex) => (
                    <li key={ex.es} className="flex gap-2.5 text-sm text-content-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-eth-blue-text" aria-hidden />
                      <span className="leading-relaxed">{t(ex)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={t(QUEST_COPY.eyebrow)}
        title={t(QUEST_COPY.formTitle)}
        lead={t(QUEST_COPY.formLead)}
      >
        <QuestForm locale={locale} />
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
