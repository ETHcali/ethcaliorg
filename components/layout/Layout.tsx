import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { asLocale, translator } from '../../lib/i18n';
import NavEntry, { type NavItem } from './Nav';
import SocialIcon, { type SocialName } from './SocialIcon';
import { FRONTIER } from '../../content/quest';
import { RESULTS } from '../../content/results';

/**
 * Top-level entries carry their own page; the dropdown children are the ways of
 * slicing it. `/events` and `/hackathons` stay real pages, because a nav item
 * that only opens a menu is a dead end for anyone who expected it to be one.
 */
const NAV: readonly NavItem[] = [
  // The campaign entry. Paid traffic lands on /builders-tour directly, but
  // organic visitors have to be able to find it too, so it still leads the nav.
  //
  // No longer `live`. That dot is `signal-confirmed`, and BRAND.md is explicit
  // that a signal colour means something happened rather than that something is
  // worth looking at — the weekend of 19–20 September is over, so a green dot
  // beside it now says something untrue. The results took its place as the
  // reason to click, and they are the first child.
  {
    href: '/builders-tour',
    key: 'nav.tour',
    matchPrefix: '/builders-tour',
    children: [
      { href: RESULTS.path, key: 'nav.winners' },
      { href: '/builders-tour', key: 'nav.tour' },
      { href: FRONTIER.path, key: 'nav.frontier' },
    ],
  },
  {
    // Points at the local list, not a hub. /events used to be a page whose only
    // content was two cards linking to these same two pages — the dropdown does
    // that job, and a page that just repeats the menu is a click for nothing.
    href: '/events/local',
    key: 'nav.events',
    matchPrefix: '/events',
    children: [
      { href: '/events/local', key: 'nav.eventsLocal' },
      { href: '/events/international', key: 'nav.eventsIntl' },
    ],
  },
  {
    href: '/hackathons',
    key: 'nav.hackathons',
    children: [
      { href: '/hackathons', key: 'nav.hackathonsAll' },
      { href: '/hacker-houses', key: 'nav.hackerHouses' },
    ],
  },
  // Who we are, how we are governed, where we meet and what we own. Four pages
  // that answer one question between them, so they are one entry rather than
  // four — /venues and /technical-infra had no place in the bar at all and were
  // reachable only from the footer.
  {
    href: '/about',
    key: 'nav.about',
    children: [
      { href: '/about', key: 'nav.about' },
      { href: '/dao', key: 'nav.dao' },
      { href: '/venues', key: 'nav.venues' },
      { href: '/technical-infra', key: 'nav.infra' },
    ],
  },
  // The things a reader can take away: learn something, wear something, use our
  // mark. The parent points at /education because it is the one most people
  // want; a nav entry that only opens a menu is a dead end.
  {
    href: '/education',
    key: 'nav.resources',
    children: [
      { href: '/education', key: 'nav.education' },
      { href: '/swag', key: 'nav.swag' },
      { href: '/brand-guidelines', key: 'nav.brand' },
    ],
  },
];

const CONTACT_EMAIL = 'hola@ethcali.org';

/**
 * Where to reach ETH Cali — all of it, on every page.
 *
 * The footer used to carry three of these, and two of them were wrong for the
 * job: the Telegram link was the Builders Tour campaign group rather than the
 * community channel, and Instagram, LinkedIn and Discord were not on the site
 * at all despite being where most of the room actually is.
 *
 * `label` is the account, not the network. A reader checking they are about to
 * follow the right ETH Cali is better served by `@ethcali.eth` than by
 * "Instagram", and the icon already says which network it is.
 *
 * Keep this in step with `SAME_AS` in `lib/seo.ts`: that is the same list told
 * to search engines, and a profile in one but not the other is a profile we are
 * claiming in exactly one of the two places it matters.
 */
const SOCIAL: readonly { name: SocialName; url: string; label: string }[] = [
  { name: 'x', url: 'https://x.com/ethcali_org', label: '@ethcali_org' },
  { name: 'instagram', url: 'https://www.instagram.com/ethcali.eth/', label: '@ethcali.eth' },
  // The company page as the public sees it. Two things were wrong with the URL
  // we were given: it was the /admin/dashboard view, which only an
  // administrator can open, and the numeric company id behind it (93608244)
  // also 302s a logged-out visitor to a login wall. The vanity slug is the one
  // spelling that serves the page to someone who is not signed in — checked,
  // not assumed.
  { name: 'linkedin', url: 'https://www.linkedin.com/company/eth-cali/', label: 'LinkedIn' },
  { name: 'discord', url: 'https://discord.gg/269Qpf3rb2', label: 'Discord' },
  // The community channel. The Builders Tour group stays on the tour page,
  // where it is scoped to that campaign.
  { name: 'telegram', url: 'https://t.me/ethcali', label: 'Telegram' },
  { name: 'github', url: 'https://github.com/ETHcali', label: 'GitHub' },
  { name: 'email', url: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
];

/**
 * The site chrome.
 *
 * The old site fetched navbar.html and footer.html at runtime into empty divs,
 * so the nav was invisible to crawlers and the page reflowed once it landed.
 * Here it is part of the render.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = asLocale(router.locale);
  const t = translator(locale);
  const [menuOpen, setMenuOpen] = useState(false);

  const other = locale === 'es' ? 'en' : 'es';
  // Without the hash stripped this is a hydration mismatch: the server renders
  // asPath without the fragment and the client renders it with, so landing on
  // /builders-tour#venue logs a "Prop href did not match" error and React
  // discards the server-rendered header. The fragment is a position on the page
  // we are already on, and carries nothing across a language switch anyway.
  const current = router.asPath.split('#')[0];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line-hairline bg-surface-void/85 backdrop-blur">
        <div className="mx-auto flex h-nav max-w-page items-center gap-4 px-gutter">
          {/* The mark, not a styled string.
              The header carried the letters "ETHCali" set in Sarun Black, which
              is not any of the three lockups BRAND.md defines. At a 60px nav the
              horizontal lockup would put its ETH·CO CALI wordmark at about 8px
              a line, under the 32px minimum the guide sets — and the guide's own
              answer to that is the diamond glyph alone. So: the glyph.

              A plain <img> rather than next/image. next/image cannot optimise an
              SVG and will only serve one behind `dangerouslyAllowSVG`; a vector
              needs neither. Width and height are set so the header does not
              shift while it loads. */}
          {/* The glyph is 25px wide, which is not a tap target. The padding
              takes the hit area to the token's 48px minimum and the negative
              margin pulls it back so the mark still sits optically on the
              gutter rather than indented by its own padding. */}
          <Link
            href="/"
            aria-label="ETH Cali"
            className="-ml-3 flex min-h-tap shrink-0 items-center rounded-chip px-3 focus-visible:outline-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element --
                the rule is about raster LCP cost. This is a 12KB SVG that
                next/image cannot optimise and will only serve behind
                dangerouslyAllowSVG; the reasoning is on the Link above. */}
            <img
              src="/branding/favicon.svg"
              alt=""
              width={25}
              height={40}
              // 40 rather than the 32px floor. The filigree is fine ironwork and
              // at 32 the frame and the octahedron inside it silt up into one
              // blue smudge; at 40 both read. The 60px bar has the room.
              className="h-10 w-auto"
              aria-hidden
            />
          </Link>

          {/* Desktop. The nav has outgrown a phone header, so below lg it moves
              into a sheet rather than scrolling sideways off the screen. */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
            {/* Hidden below lg rather than unmounted, so its links — which is
                every page on the site — stay in the HTML a crawler receives
                whatever width it claims to be. */}
            {NAV.map((item) => (
              <NavEntry key={item.href} item={item} t={t} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Keeps you on the page you are reading rather than dumping you home. */}
            <Link
              href={current}
              locale={other}
              className="rounded-chip border border-line-hairline px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-content-muted transition-colors hover:border-line-strong hover:text-content-primary"
            >
              {other}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Menú"
              className="flex h-9 w-9 items-center justify-center rounded-chip border border-line-hairline text-content-muted transition-colors hover:text-content-primary lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                {menuOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* The phone sheet.
            Scrollable and capped at the viewport below the bar: five groups is
            seventeen rows, and on a short phone in landscape the last of them
            used to sit below the fold with no way to reach it.

            Every group renders as a heading plus its children, and the heading
            is NOT a link. Each group's parent href is also one of its children
            — that is the invariant NAV keeps — so linking the heading too put
            "Nosotros" directly above "Nosotros" and "Hackathons" above
            "Hackathons". On a pointer the parent is still a real link; here the
            child list already contains it. */}
        {menuOpen && (
          <nav
            className="max-h-[calc(100vh-var(--nav-h))] overflow-y-auto overscroll-contain border-t border-line-hairline bg-surface-void px-gutter py-3 lg:hidden"
            aria-label="Principal, móvil"
          >
            {NAV.map((item) => {
              const rows = item.children ?? [{ href: item.href, key: item.key }];
              return (
                <div key={item.href} className="border-b border-line-hairline/60 py-2 last:border-b-0">
                  {item.children ? (
                    <p className="px-1 py-1 text-[11px] font-semibold uppercase tracking-widest text-content-faint">
                      {t(item.key)}
                    </p>
                  ) : null}

                  <ul className="flex flex-col">
                    {rows.map((row) => {
                      const rowActive = current === row.href;
                      return (
                        <li key={row.href}>
                          <Link
                            href={row.href}
                            aria-current={rowActive ? 'page' : undefined}
                            onClick={() => setMenuOpen(false)}
                            className={`flex min-h-tap items-center rounded-chip px-1 text-sm transition-colors ${
                              rowActive
                                ? 'font-semibold text-eth-blue-text'
                                : item.children
                                  ? 'text-content-secondary'
                                  : 'font-semibold text-content-primary'
                            }`}
                          >
                            {t(row.key)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-line-hairline">
        <div className="mx-auto max-w-page px-gutter py-10">
          {/* The mark, where the header could not use it.
              The header sets the glyph alone because at a 60px bar the lockup's
              ETH·CO CALI wordmark would fall under the 32px minimum BRAND.md
              sets. The footer has the room, so it carries the full horizontal
              lockup — the reversed artwork, drawn white for exactly this ground.

              The whole site used to say its own name here in bold body text,
              which is a styled string standing in for a logo we ship in
              public/branding. */}
          <Link href="/" aria-label="ETH Cali" className="inline-flex">
            <Image
              src="/branding/ethcali-horizontal-light.png"
              alt="ETH Cali"
              width={334}
              height={227}
              // 80px, not the 32px floor. BRAND.md's minimum is about the
              // lockup as a whole, and this artwork spends most of its height
              // on the glyph — at 56px the ETH·CO CALI wordmark beside it was
              // setting two lines in about 8px each and reading as texture
              // rather than as words.
              className="h-16 w-auto sm:h-20"
            />
          </Link>

          <p className="mt-3 max-w-prose text-sm text-content-muted">
            Fundación Innovación del Pacífico · Cali, Colombia
          </p>

          {/* No link list. Every page it carried is now in the nav — /venues,
              /technical-infra, /education, /swag and /brand-guidelines were the
              five that had no entry in the bar, and they are grouped under
              Nosotros and Recursos rather than exiled down here. A footer that
              repeats the whole nav is the nav twice. */}

          {/* Where to actually reach us.
              `rel="me"` on the profiles and not on the mailto: it is the link
              type that says "this account is the same entity as this site", and
              it means nothing on an email address. mailto also never opens in a
              new tab — target="_blank" on one leaves a blank tab behind. */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1">
            {SOCIAL.map((s) => {
              const mail = s.name === 'email';
              return (
                <li key={s.url}>
                  <a
                    href={s.url}
                    {...(mail ? {} : { target: '_blank', rel: 'me noopener noreferrer' })}
                    className="flex min-h-tap items-center gap-2 rounded-chip text-sm text-content-muted transition-colors hover:text-content-primary"
                  >
                    <SocialIcon name={s.name} className="h-4 w-4 shrink-0" />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-xs text-content-faint">© {new Date().getFullYear()} ETH Cali</p>
        </div>
      </footer>
    </div>
  );
}
