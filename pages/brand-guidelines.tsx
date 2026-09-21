import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { asLocale, type Locale } from '../lib/i18n';
import {
  LOGOS,
  SOCIAL_ART,
  WEB_FONTS,
  KITS,
  GUIDE,
  BRAND_COPY,
  type BrandAsset,
  type BrandFile,
} from '../content/brand';
import type { Bilingual } from '../content/builders-tour';

interface Props {
  locale: Locale;
}

/**
 * Every swatch reads its colour from the live token, so this page cannot drift
 * from the system it documents. If a token changes in @ethcali/design-tokens,
 * this page changes with it — a brand page that hardcoded hexes would be wrong
 * the first time anyone edited the palette.
 */
// Class names are written out in full, never interpolated. Tailwind scans the
// source as text: `bg-${token}` is invisible to it, so the utility is never
// generated and every swatch renders transparent. This is the one place where
// spelling each class out is the correct answer rather than repetition.
const SURFACES = [
  ['bg-surface-void', 'surface-void'],
  ['bg-surface-slab', 'surface-slab'],
  ['bg-surface-inset', 'surface-inset'],
  ['bg-surface-ridge', 'surface-ridge'],
] as const;

const BRAND = [
  ['bg-eth-blue', 'eth-blue'],
  ['bg-eth-blue-lift', 'eth-blue-lift'],
  ['bg-eth-blue-deep', 'eth-blue-deep'],
  ['bg-eth-blue-text', 'eth-blue-text'],
] as const;

const SIGNALS = [
  ['bg-signal-confirmed', 'signal-confirmed'],
  ['bg-signal-pending', 'signal-pending'],
  ['bg-signal-reverted', 'signal-reverted'],
] as const;

const TEXT = [
  ['text-content-primary', 'content-primary'],
  ['text-content-secondary', 'content-secondary'],
  ['text-content-muted', 'content-muted'],
  ['text-content-faint', 'content-faint'],
] as const;

function Swatch({ cls, token, note }: { cls: string; token: string; note?: string }) {
  return (
    <div className="rounded-card border border-line-hairline bg-surface-slab p-3">
      <div className={`h-14 w-full rounded-chip border border-line-hairline ${cls}`} />
      <p className="mono mt-2 text-xs text-content-primary">{token}</p>
      {note && <p className="mt-0.5 text-[11px] leading-snug text-content-faint">{note}</p>}
    </div>
  );
}

/**
 * One file, as a download.
 *
 * `download` is the whole reason this is not a plain link: the files on disk
 * keep the names the design studio gave them — `Logo_Nodo_CLO_ETH_CO-02.png` —
 * and renaming them would break anything already pointing at them. The
 * attribute puts a name someone can recognise in the downloads folder without
 * moving the file. It only works same-origin, which these all are.
 */
function FileLink({ file, t }: { file: BrandFile; t: (b: Bilingual) => string }) {
  return (
    <a
      href={file.path}
      download={file.download}
      className="inline-flex min-h-[36px] items-center gap-2 rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {file.format}
      {file.dimensions && <span className="mono font-normal text-content-faint">{file.dimensions}</span>}
      {file.note && <span className="font-normal text-content-faint">{t(file.note)}</span>}
    </a>
  );
}

/**
 * One asset: what it looks like, what it is for, and every format of it.
 *
 * The preview is `object-contain` on a fixed-height box so six cards of wildly
 * different aspect ratios line up as a grid rather than as a ransom note. Light
 * artwork gets `--surface-paper` under it; black lettering on `--surface-slab`
 * is invisible, which is the failure mode this page exists to prevent.
 */
function AssetCard({ asset, t }: { asset: BrandAsset; t: (b: Bilingual) => string }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab">
      <div
        className={`flex h-40 items-center justify-center p-6 ${
          asset.plate ? 'bg-surface-paper' : 'bg-surface-inset'
        }`}
      >
        <Image
          src={asset.preview}
          alt=""
          width={asset.previewWidth}
          height={asset.previewHeight}
          sizes="(min-width: 1024px) 380px, 92vw"
          className="max-h-full w-auto object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-content-primary">{t(asset.name)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{t(asset.detail)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {asset.files.map((file) => (
            <FileLink key={file.path} file={file} t={t} />
          ))}
        </div>
      </div>
    </article>
  );
}

/** The big one. A ZIP is a download, not navigation — it never opens a tab. */
function KitCard({
  kit,
  t,
}: {
  kit: { file: string; download: string; name: Bilingual; detail: Bilingual };
  t: (b: Bilingual) => string;
}) {
  return (
    <a
      href={kit.file}
      download={kit.download}
      className="flex flex-col rounded-card border border-line-strong bg-surface-slab p-5 transition-colors hover:border-eth-blue hover:bg-eth-blue-wash"
    >
      <p className="flex items-center gap-2 text-base font-bold text-content-primary">
        <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t(kit.name)}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{t(kit.detail)}</p>
      <span className="mono mt-4 text-xs text-eth-blue-text">ZIP →</span>
    </a>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-line-hairline bg-surface-slab p-5">
      <h3 className="text-sm font-bold text-content-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-content-muted">{body}</p>
    </div>
  );
}

export default function BrandGuidelines({ locale }: Props) {
  const en = locale === 'en';
  const t = (b: Bilingual) => b[locale];

  const lead = en
    ? 'The living design system. Every swatch below reads the same token the site and the app render with, so this page cannot drift from what ships.'
    : 'El sistema de diseño vivo. Cada muestra lee el mismo token con el que renderizan el sitio y la app, así que esta página no puede desalinearse de lo que se publica.';

  return (
    <Layout>
      <Seo
        title={en ? 'Brand guidelines' : 'Guía de marca'}
        description={lead}
        path="/brand-guidelines"
      />

      <PageHeader
        eyebrow={en ? 'Design system' : 'Sistema de diseño'}
        title={en ? 'Brand guidelines' : 'Guía de marca'}
        lead={lead}
      />

      {/* Downloads first.
          The page opened on the colour palette, which is the right answer for a
          developer reading the token names and the wrong one for everybody else
          who lands here — a sponsor putting our mark on a banner, a university
          making a poster, a partner community building a deck. They want the
          logo, and they were scrolling past four grids of swatches to not find
          it, because it was not on the page at all. */}
      <Section id="downloads" title={t(BRAND_COPY.downloadsTitle)} lead={t(BRAND_COPY.downloadsLead)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <KitCard kit={KITS.brand} t={t} />
          <KitCard kit={KITS.fonts} t={t} />
        </div>

        <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-widest text-content-faint">
          {t(BRAND_COPY.logosTitle)}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOGOS.map((asset) => (
            <AssetCard key={asset.id} asset={asset} t={t} />
          ))}
        </div>

        <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-widest text-content-faint">
          {t(BRAND_COPY.socialTitle)}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIAL_ART.map((asset) => (
            <AssetCard key={asset.id} asset={asset} t={t} />
          ))}
        </div>
      </Section>

      {/* The rules, straight after the download button and before the palette.
          Whoever just took the logo is the person these are addressed to, and
          they are reading this page for exactly one more scroll. */}
      <Section id="usage" title={t(BRAND_COPY.rulesTitle)} lead={t(BRAND_COPY.rulesLead)}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Rule title={t(GUIDE.clearSpace.title)} body={t(GUIDE.clearSpace.body)} />
          <Rule title={t(GUIDE.minimum.title)} body={t(GUIDE.minimum.body)} />
          <Rule title={t(GUIDE.colour.title)} body={t(GUIDE.colour.body)} />
        </div>

        <div className="mt-3 rounded-card border border-line-hairline bg-surface-slab p-5">
          <h3 className="text-sm font-bold text-signal-reverted">{t(GUIDE.never.title)}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {GUIDE.never.items.map((item) => (
              <li key={item.en} className="flex gap-2 text-sm text-content-muted">
                <span className="text-signal-reverted" aria-hidden>
                  ×
                </span>
                {t(item)}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title={en ? 'Brand' : 'Marca'}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BRAND.map(([cls, token]) => (
            <Swatch
              key={token}
              cls={cls}
              token={token}
              note={
                token === 'eth-blue-text'
                  ? en ? 'Links and data on dark' : 'Enlaces y datos sobre oscuro'
                  : undefined
              }
            />
          ))}
        </div>
      </Section>

      <Section title={en ? 'Surfaces' : 'Superficies'}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SURFACES.map(([cls, token]) => (
            <Swatch key={token} cls={cls} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title={en ? 'Signals' : 'Señales'}
        lead={
          en
            ? 'Never decorative. Green means something succeeded on chain — if a thing is merely pleasant, it is a brand colour, not a signal.'
            : 'Nunca decorativos. El verde significa que algo se confirmó en cadena — si algo simplemente se ve bien, es un color de marca, no una señal.'
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SIGNALS.map(([cls, token]) => (
            <Swatch key={token} cls={cls} token={token} />
          ))}
        </div>
      </Section>

      <Section title={en ? 'Text' : 'Texto'}>
        <div className="rounded-card border border-line-hairline bg-surface-slab p-5">
          {TEXT.map(([cls, token]) => (
            <p key={token} className={`${cls} mb-2 text-base last:mb-0`}>
              <span className="mono mr-3 text-xs text-content-faint">{token}</span>
              {en ? 'The quick brown fox jumps over the lazy dog' : 'El veloz murciélago hindú comía feliz cardillo'}
            </p>
          ))}
        </div>
      </Section>

      <Section
        title={en ? 'Type' : 'Tipografía'}
        lead={
          en
            ? 'Sarun Pro for anything a human wrote, JetBrains Mono for anything a chain produced: addresses, hashes, amounts, dates.'
            : 'Sarun Pro para lo que escribió una persona, JetBrains Mono para lo que produjo una cadena: direcciones, hashes, montos, fechas.'
        }
      >
        <div className="space-y-4 rounded-card border border-line-hairline bg-surface-slab p-6">
          <p className="text-4xl font-black">Sarun Pro Black 900</p>
          <p className="text-2xl font-bold">Sarun Pro Bold 700</p>
          <p className="text-xl font-medium">Sarun Pro Medium 500</p>
          <p className="text-lg">Sarun Pro Regular 400</p>
          <p className="mono text-base">JetBrains Mono · 0xB6BDe4fB…6da64</p>
          <p className="border-t border-line-hairline pt-4 text-sm text-content-faint">
            {en
              ? 'Sarun Pro has no 600. It steps Medium 500 to Bold 700, so font-semibold is mapped to 700 rather than synthesised.'
              : 'Sarun Pro no tiene 600. Salta de Medium 500 a Bold 700, así que font-semibold se mapea a 700 en vez de sintetizarse.'}
          </p>
        </div>


        <div className="mt-6 rounded-card border border-line-hairline bg-surface-slab p-5">
          <h3 className="text-sm font-bold text-content-primary">{t(BRAND_COPY.webFontsTitle)}</h3>
          <p className="mt-1 text-sm text-content-muted">{t(BRAND_COPY.webFontsLead)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {WEB_FONTS.map((file) => (
              <a
                key={file.path}
                href={file.path}
                download={file.download}
                className="inline-flex min-h-[36px] items-center rounded-chip border border-line-hairline px-3 text-xs font-semibold text-content-secondary transition-colors hover:border-line-brand hover:text-content-primary"
              >
                {file.download.replace('SarunPro-', '').replace('.woff2', '')}
              </a>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-line-hairline pt-5">
            <a
              href={KITS.fonts.file}
              download={KITS.fonts.download}
              className="inline-flex min-h-tap items-center rounded-control border border-line-strong px-5 text-sm font-semibold text-content-primary transition-colors hover:border-eth-blue hover:bg-eth-blue-wash"
            >
              {t(KITS.fonts.name)} · ZIP →
            </a>
            <a
              href="https://www.jetbrains.com/lp/mono/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-tap items-center rounded-control border border-line-hairline px-5 text-sm font-semibold text-content-secondary transition-colors hover:border-line-strong hover:text-content-primary"
            >
              JetBrains Mono →
            </a>
          </div>
        </div>

        {/* Said once, plainly. Sarun Pro is not ours to hand out without
            qualification, and someone downloading 60 fonts should know which
            of the two typefaces on this page carries a condition. */}
        <p className="mt-4 max-w-prose text-xs leading-relaxed text-content-faint">
          {t(BRAND_COPY.licenceNote)} {t(BRAND_COPY.monoNote)}
        </p>
      </Section>

      <Section title={en ? 'Where it lives' : 'Dónde vive'}>
        <a
          href="https://github.com/ETHcali/design-tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-tap items-center rounded-control border border-line-strong px-5 text-sm font-semibold text-content-primary transition-colors hover:border-eth-blue hover:bg-eth-blue-wash"
        >
          github.com/ETHcali/design-tokens →
        </a>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
