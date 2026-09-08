import type { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { INFRA } from '../content/infra';
import { asLocale, type Locale } from '../lib/i18n';

interface Props {
  locale: Locale;
}

export default function TechnicalInfra({ locale }: Props) {
  const en = locale === 'en';

  const lead = en
    ? 'Hardware available free for events, workshops and hackathons. You do not have to be part of ETH Cali to borrow it.'
    : 'Hardware disponible gratis para eventos, talleres y hackathons. No hace falta ser de ETH Cali para pedirlo prestado.';

  const groups = [
    { kind: 'media' as const, label: en ? 'Media' : 'Equipos de media' },
    { kind: 'tech' as const, label: en ? 'Technical' : 'Equipos técnicos' },
  ];

  return (
    <Layout>
      <Seo
        title={en ? 'Community hardware' : 'Equipos para la comunidad'}
        description={lead}
        path="/technical-infra"
      />

      <PageHeader
        eyebrow={en ? 'Infrastructure' : 'Infraestructura'}
        title={en ? 'Hardware for the community' : 'Equipos para la comunidad'}
        lead={lead}
      />

      <Section
        eyebrow={en ? 'Why' : 'Por qué'}
        title={en ? 'The idea' : 'La idea'}
        lead={
          en
            ? 'Buy professional equipment and lend it out, so the cost of hardware does not decide who gets to run an event.'
            : 'Comprar equipos profesionales y prestarlos, para que el costo del hardware no decida quién puede organizar un evento.'
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [en ? 'Access' : 'Democratización', en
              ? 'Remove the economic barrier to decent equipment at community events.'
              : 'Eliminar la barrera económica para acceder a tecnología de calidad en eventos de la comunidad.'],
            [en ? 'Education' : 'Educación', en
              ? 'Make workshops possible with equipment that actually works.'
              : 'Facilitar talleres y workshops con equipos profesionales.'],
            [en ? 'Collaboration' : 'Colaboración', en
              ? 'Other organisers and communities can use our kit at their own events.'
              : 'Que otros organizadores y comunidades puedan usar nuestros recursos en sus eventos.'],
            [en ? 'Growth' : 'Crecimiento', en
              ? 'Expand the inventory as the ecosystem grows.'
              : 'Ampliar el inventario a medida que crece el ecosistema.'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <h3 className="text-base font-bold text-content-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow={en ? 'Inventory' : 'Inventario'} title={en ? 'What we have' : 'Lo que tenemos'}>
        {groups.map((g) => {
          const items = INFRA.filter((i) => i.kind === g.kind);
          return (
            <div key={g.kind} className="mb-8 last:mb-0">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-content-faint">
                {g.label} <span className="mono ml-1 font-normal">{items.length}</span>
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((i) => (
                  <li
                    key={i.name}
                    className="rounded-chip border border-line-hairline bg-surface-slab px-4 py-3"
                  >
                    <p className="text-sm leading-snug text-content-secondary">{i.name}</p>
                    {i.brand && (
                      <p className="mono mt-1 text-[11px] text-content-faint">{i.brand}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { locale: asLocale(locale) },
});
