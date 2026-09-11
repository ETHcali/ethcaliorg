import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import Seo from '../../components/layout/Seo';
import { Section } from '../../components/layout/Page';
import QuestForm from '../../components/quest/QuestForm';
import { FRONTIER, QUEST, QUEST_CITIES, QUEST_COPY, QUEST_STEPS } from '../../content/quest';
import { SHANHAIWOO, type Bilingual } from '../../content/builders-tour';
import { asLocale, type Locale } from '../../lib/i18n';

interface Props {
  locale: Locale;
}

export default function FrontierCities({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  return (
    <Layout>
      <Seo
        title={t(QUEST_COPY.seoTitle)}
        description={t(QUEST_COPY.lead)}
        path={FRONTIER.path}
        image={SHANHAIWOO.poster}
        type="article"
      />

      {/* ── hero ─────────────────────────────────────────────────────────── */}
      {/* The artwork is not decoration here: three Asian skylines under one mark
          carry the offer faster than the paragraph beside them, so it sits in
          the hero rather than in a section below it. Same radial wash and same
          dt/dd facts as the Builders Tour hero, because a visitor arriving from
          that page's third button should recognise where they landed. */}
      <header className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 0%, var(--eth-blue-wash), transparent 70%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-page px-gutter pb-10 pt-12 sm:pb-12 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
                {t(QUEST_COPY.eyebrow)}
              </p>

              <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">
                {FRONTIER.name}
                <span className="mt-1 block text-eth-blue-text">{t(QUEST_COPY.subtitle)}</span>
              </h1>

              <p className="mt-5 max-w-prose text-lg text-content-secondary">
                {t(QUEST_COPY.lead)}
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                    {t(QUEST_COPY.windowLabel)}
                  </dt>
                  <dd className="mono mt-1 text-base font-bold text-content-primary">
                    {t(QUEST.window)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-content-faint">
                    {t(QUEST_COPY.citiesLabel)}
                  </dt>
                  <dd className="mt-1 text-base font-bold text-content-primary">
                    <a href="#cities" className="hover:text-eth-blue-text">
                      {QUEST_CITIES.map((c) => c.name).join(' · ')}
                    </a>
                  </dd>
                </div>
              </dl>

              {/* One primary action, and it is the form the whole page exists
                  for. It scrolls rather than navigates: the reader has not been
                  told enough yet to fill it in, and everything they need is
                  between here and there. */}
              <a
                href="#propose"
                className="mt-9 inline-flex min-h-tap items-center justify-center rounded-control bg-eth-blue px-6 text-sm font-bold text-on-brand transition-colors hover:bg-eth-blue-lift"
              >
                {t(QUEST_COPY.formTitle)} →
              </a>
            </div>

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
                  sizes="(min-width: 1024px) 560px, 92vw"
                  className="h-auto w-full"
                  priority
                />
                <div
                  className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4"
                  style={{ background: 'linear-gradient(to top, rgb(6 6 11 / 0.85), transparent)' }}
                >
                  {/* The short form, not QUEST.window: the full date range is
                      already stated in the facts above, and at phone width it
                      wraps onto two lines across the artwork. */}
                  <p className="mono text-sm font-bold text-content-primary">
                    {t(SHANHAIWOO.dates)}
                  </p>
                  <span className="text-xs font-semibold text-eth-blue-text opacity-0 transition-opacity group-hover:opacity-100">
                    shanhaiwoo.com →
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

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
        id="cities"
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
        id="propose"
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
