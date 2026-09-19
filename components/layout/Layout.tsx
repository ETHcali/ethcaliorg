import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { asLocale, translator } from '../../lib/i18n';
import NavEntry, { type NavItem } from './Nav';
import { FRONTIER } from '../../content/quest';

/**
 * Top-level entries carry their own page; the dropdown children are the ways of
 * slicing it. `/events` and `/hackathons` stay real pages, because a nav item
 * that only opens a menu is a dead end for anyone who expected it to be one.
 */
const NAV: readonly NavItem[] = [
  // Time-boxed campaign entry. Paid traffic lands on /builders-tour directly,
  // but organic visitors have to be able to find it too, so it leads the nav
  // and is the one thing marked live until 20 September.
  { href: '/builders-tour', key: 'nav.tour', live: true },
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
  { href: '/venues', key: 'nav.venues' },
  { href: '/about', key: 'nav.about' },
  { href: '/dao', key: 'nav.dao' },
];

/**
 * Where to reach ETH Cali. The X handle and the Telegram group both existed
 * already, inside `content/builders-tour.ts`, which meant they appeared on
 * exactly one page of the site.
 */
const SOCIAL = [
  { url: 'https://x.com/ethcali_org', label: '@ethcali_org' },
  { url: 'https://t.me/+QfakRR2_LwxkNzM1', label: 'Telegram' },
  { url: 'https://github.com/ETHcali', label: 'GitHub' },
] as const;

const CONTACT_EMAIL = 'hola@ethcali.org';

const FOOTER_NAV = [
  [FRONTIER.path, 'nav.frontier'],
  ['/education', 'nav.education'],
  ['/swag', 'nav.swag'],
  ['/technical-infra', 'nav.infra'],
  ['/brand-guidelines', 'nav.brand'],
] as const;

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

        {menuOpen && (
          <nav
            className="border-t border-line-hairline bg-surface-void px-gutter py-3 lg:hidden"
            aria-label="Principal"
          >
            {NAV.map((item) => (
              <div key={item.href} className="border-b border-line-hairline/60 py-1 last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-content-primary"
                >
                  {t(item.key)}
                </Link>
                {item.children && (
                  <div className="mb-1 ml-3 flex flex-col">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setMenuOpen(false)}
                        className="py-1.5 text-sm text-content-muted"
                      >
                        {t(c.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line-hairline pt-3">
              {FOOTER_NAV.map(([href, key]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-1 text-sm text-content-muted"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-line-hairline">
        <div className="mx-auto max-w-page px-gutter py-10">
          <p className="text-sm font-bold text-content-primary">ETH Cali</p>
          <p className="mt-1 max-w-prose text-sm text-content-muted">
            Fundación Innovación del Pacífico · Cali, Colombia
          </p>

          {/* Both halves of the site, not just the secondary half.
              The footer used to carry five links and the nav the other six, so
              /education, /swag and /brand-guidelines were reachable from one
              place on the whole site and every crawl path to them ran through
              a single link. */}
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Secundaria">
            {[...NAV.map((i) => [i.href, i.key] as const), ...FOOTER_NAV].map(([href, key]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-content-muted transition-colors hover:text-content-primary"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Where to actually reach us. Both of these existed only inside the
              Builders Tour content file, so they appeared on one page. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {SOCIAL.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="me noopener noreferrer"
                className="text-sm text-content-muted transition-colors hover:text-content-primary"
              >
                {s.label}
              </a>
            ))}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-content-muted transition-colors hover:text-content-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <p className="mt-6 text-xs text-content-faint">© {new Date().getFullYear()} ETH Cali</p>
        </div>
      </footer>
    </div>
  );
}
