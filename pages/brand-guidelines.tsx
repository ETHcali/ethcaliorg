import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { asLocale, type Locale } from '../lib/i18n';

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

export default function BrandGuidelines({ locale }: Props) {
  const en = locale === 'en';

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
