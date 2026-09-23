import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { SWAG_GROUPS, SWAG_WAYS, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { APP } from '../lib/links';
import { GRID_SIZES } from '../lib/images';

interface Props {
  locale: Locale;
}

export default function Swag({ locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  const lead = en
    ? 'Designed from the official Ethereum ecosystem assets and our own identity. Free at our events; anything else is sold, in pesos or in crypto.'
    : 'Diseñado con los assets oficiales del ecosistema Ethereum y nuestra propia identidad. Gratis en nuestros eventos; el resto se vende, en pesos o en cripto.';

  return (
    <Layout>
      <Seo title={en ? 'Official swag' : 'Swag oficial'} description={lead} path="/swag" />

      <PageHeader eyebrow="Merch" title={en ? 'Official swag' : 'Swag oficial'} lead={lead} />

      {/* One section per kind. The catalogue used to be a single grid of seven
          in no order, so you could not tell at a glance that there are caps at
          all — you had to read every caption to find out what exists. */}
      {SWAG_GROUPS.map((group) => (
        <Section key={group.id} eyebrow={en ? 'Catalogue' : 'Catálogo'} title={t(group.name)}>
          {group.items.length === 0 ? (
            // An empty group is still information: it says a t-shirt is coming,
            // where leaving the group out entirely says we do not make them.
            <p className="rounded-card border border-dashed border-line-hairline bg-surface-slab p-5 text-sm text-content-muted">
              {group.pending ? t(group.pending) : ''}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <li
                  key={item.name.es}
                  className="flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab"
                >
                  {item.image && (
                    // `object-contain`, not cover. These come in three shapes —
                    // 9:16 cap shots, square mugs, landscape pairs showing a
                    // front and a back — and cropping them all to a square cut
                    // the crown off every cap and half the artwork off every
                    // hoodie.
                    <div className="relative aspect-[4/3] bg-surface-inset">
                      <Image
                        src={item.image}
                        alt={t(item.name)}
                        fill
                        sizes={GRID_SIZES}
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-base font-bold leading-snug text-content-primary">
                      {t(item.name)}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-content-muted">
                      {t(item.detail)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag.es}
                          className="rounded-chip bg-eth-blue-wash px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-eth-blue-text"
                        >
                          {t(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      ))}

      <Section
        eyebrow={en ? 'How to get it' : 'Cómo conseguirlo'}
        title={en ? 'Free at events, sold the rest of the time' : 'Gratis en eventos, a la venta el resto del tiempo'}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SWAG_WAYS.map((w) => (
            <div key={w.title.es} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <h3 className="text-base font-bold text-content-primary">{t(w.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(w.detail)}</p>
            </div>
          ))}
        </div>

        <a
          href={APP.swag}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-tap items-center rounded-control bg-eth-blue px-5 text-sm font-bold text-on-brand transition-colors hover:bg-eth-blue-lift"
        >
          {en ? 'See your collectibles' : 'Ver tus coleccionables'} →
        </a>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
