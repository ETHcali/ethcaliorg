import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import { getTeam } from '../lib/content';
import type { TeamMemberRecord } from '../types/content';
import { MISSION, type Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';

interface Props {
  team: TeamMemberRecord[];
  locale: Locale;
}

/** Grouped in the order people joined the project, not alphabetically. */
const GROUPS: readonly { key: string; label: Bilingual }[] = [
  { key: 'Founder', label: { es: 'Fundadores', en: 'Founders' } },
  { key: 'Core', label: { es: 'Core', en: 'Core' } },
  { key: 'Contributor', label: { es: 'Contributors', en: 'Contributors' } },
  { key: 'Volunteer', label: { es: 'Voluntarios', en: 'Volunteers' } },
  { key: 'Former Core', label: { es: 'Antiguos core', en: 'Former core' } },
];

export default function About({ team, locale }: Props) {
  const t = (b: Bilingual) => b[locale];

  const lead =
    locale === 'en'
      ? 'Founders, core, contributors and volunteers. Every one of them started as someone who turned up to a meetup.'
      : 'Fundadores, core, contributors y voluntarios. Todos empezaron como asistentes a un meetup.';

  return (
    <Layout>
      <Seo title={locale === 'en' ? 'About' : 'Nosotros'} description={lead} path="/about" />

      <PageHeader
        eyebrow={locale === 'en' ? 'Who we are' : 'Quiénes somos'}
        title={locale === 'en' ? 'The builders of the garden' : 'Los builders del jardín'}
        lead={lead}
      />

      <Section title={locale === 'en' ? 'The team' : 'Nuestro equipo'}>
        {GROUPS.map((group) => {
          const members = team.filter((m) => m.status === group.key);
          if (!members.length) return null;

          return (
            <div key={group.key} className="mb-10 last:mb-0">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-content-faint">
                {t(group.label)} <span className="mono ml-1 font-normal">{members.length}</span>
              </h3>

              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {members.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-card border border-line-hairline bg-surface-slab p-4"
                  >
                    {m.image_path && (
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-chip bg-surface-inset">
                        <Image
                          src={m.image_path}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm font-bold leading-snug text-content-primary">{m.name}</p>
                    {(locale === 'en' ? m.role_en ?? m.role_es : m.role_es) && (
                      <p className="mt-1 text-xs leading-relaxed text-content-muted">
                        {locale === 'en' ? m.role_en ?? m.role_es : m.role_es}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {([
                        ['in', m.linkedin_url],
                        ['x', m.twitter_url],
                        ['gh', m.github_url],
                      ] as const)
                        .filter(([, url]) => Boolean(url))
                        .map(([label, url]) => (
                          <a
                            key={label}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-chip border border-line-hairline px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-content-muted transition-colors hover:border-line-brand hover:text-content-primary"
                          >
                            {label}
                          </a>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Section>

      <Section
        eyebrow={locale === 'en' ? 'What drives us' : 'Qué nos mueve'}
        title={locale === 'en' ? 'Our mission' : 'Nuestra misión'}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {MISSION.map((m) => (
            <div key={m.title.es} className="rounded-card border border-line-hairline bg-surface-slab p-5">
              <h3 className="text-base font-bold text-content-primary">{t(m.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{t(m.detail)}</p>
            </div>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: { team: await getTeam(), locale: asLocale(locale) },
  revalidate: 60,
});
