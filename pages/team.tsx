import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Seo from '../components/layout/Seo';
import { PageHeader, Section } from '../components/layout/Page';
import SocialIcon from '../components/layout/SocialIcon';
import { getTeam } from '../lib/content';
import type { TeamMemberRecord } from '../types/content';
import type { Bilingual } from '../content/site';
import { asLocale, type Locale } from '../lib/i18n';
import { httpUrl } from '../lib/url';

interface Props {
  team: TeamMemberRecord[];
  locale: Locale;
}

/**
 * Grouped by standing, in the order people arrive at it.
 *
 * `key` is the `status` string as it is stored, and `Elite` was `Contributor`
 * until the people in it asked for a name that meant something. The label is
 * uppercased in the markup rather than in the data, so the word in Supabase
 * stays a word.
 */
const GROUPS: readonly { key: string; label: Bilingual }[] = [
  { key: 'Founder', label: { es: 'Fundadores', en: 'Founders' } },
  { key: 'Core', label: { es: 'Core', en: 'Core' } },
  { key: 'Elite', label: { es: 'Elite', en: 'Elite' } },
  { key: 'Volunteer', label: { es: 'Voluntarios', en: 'Volunteers' } },
  { key: 'Former Core', label: { es: 'Antiguos core', en: 'Former core' } },
];

/**
 * One person.
 *
 * Compact on purpose: twenty of these used to run four to a row as tall cards
 * with a square portrait, a name, a role and three text chips reading "in", "x"
 * and "gh" — the page was most of a screen per five people. The portrait is a
 * circle beside the text now rather than a block above it, which halves the
 * height and lets six sit in a row.
 *
 * The social links are the real marks from `SocialIcon`, the same component the
 * footer uses. They were two-letter chips at 48px square, which took more room
 * than the name.
 */
function Member({ m, locale }: { m: TeamMemberRecord; locale: Locale }) {
  const role = locale === 'en' ? m.role_en ?? m.role_es : m.role_es;

  const links = (
    [
      ['linkedin', m.linkedin_url],
      ['x', m.twitter_url],
      ['github', m.github_url],
    ] as const
  )
    .map(([name, url]) => [name, httpUrl(url)] as const)
    .filter((l): l is readonly ['linkedin' | 'x' | 'github', string] => l[1] !== null);

  return (
    <li className="flex items-center gap-3 rounded-card border border-line-hairline bg-surface-slab p-3">
      {m.image_path ? (
        <Image
          src={m.image_path}
          alt=""
          width={96}
          height={96}
          sizes="48px"
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        // A missing portrait leaves a marked circle rather than a ragged row.
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-inset text-sm font-bold text-content-muted"
          aria-hidden
        >
          {m.name.charAt(0)}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-content-primary">{m.name}</p>
        {role && <p className="truncate text-xs text-content-muted">{role}</p>}
      </div>

      {links.length > 0 && (
        <div className="flex shrink-0 items-center">
          {links.map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              // 36px each rather than the 48px the old chips took: three of
              // these sit inside a 72px-tall row, and at 48 they were wider
              // than the name beside them. Still comfortably past the 24px
              // WCAG 2.5.8 minimum, with the row itself as the generous target.
              aria-label={`${m.name} — ${name}`}
              className="flex h-9 w-9 items-center justify-center rounded-chip text-content-faint transition-colors hover:text-content-primary"
            >
              <SocialIcon name={name} className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

/**
 * The people.
 *
 * Split out of /about, which was named for one thing and was entirely another:
 * a page called "Nosotros" that opened on twenty portraits and never said what
 * ETH Cali had done. /about answers that now; this answers who.
 */
export default function Team({ team, locale }: Props) {
  const t = (b: Bilingual) => b[locale];
  const en = locale === 'en';

  const lead = en
    ? 'Founders, core, elite, volunteers and the people who built this before us. Every one of them started as someone who turned up to a meetup.'
    : 'Fundadores, core, elite, voluntarios y quienes construyeron esto antes que nosotros. Todos empezaron como alguien que llegó a un meetup.';

  return (
    <Layout>
      <Seo title={en ? 'Team' : 'Equipo'} description={lead} path="/team" />

      <PageHeader
        eyebrow={en ? 'Who we are' : 'Quiénes somos'}
        title={en ? 'The builders of the garden' : 'Los builders del jardín'}
        lead={lead}
      />

      {/* One section, five headings — not five sections. A `Section` carries a
          rule and 48px of padding top and bottom, so a group of two people was
          costing most of a screen. Twenty people now fit in about two. */}
      <Section title={en ? 'The team' : 'El equipo'}>
        {GROUPS.map((group) => {
          const members = team.filter((m) => m.status === group.key);
          if (!members.length) return null;

          return (
            <div key={group.key} className="mb-8 last:mb-0">
              <h3 className="mb-3 flex items-baseline gap-2 text-xs font-bold uppercase tracking-widest text-content-faint">
                {t(group.label)}
                <span className="mono font-normal">{members.length}</span>
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((m) => (
                  <Member key={m.id} m={m} locale={locale} />
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
  props: { team: await getTeam(), locale: asLocale(locale) },
  revalidate: 60,
});
