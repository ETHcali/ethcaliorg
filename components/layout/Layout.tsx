import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { asLocale, translator } from '../../lib/i18n';
import NavEntry, { type NavItem } from './Nav';

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
    href: '/events',
    key: 'nav.events',
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

const FOOTER_NAV = [
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
  const current = router.asPath;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line-hairline bg-surface-void/85 backdrop-blur">
        <div className="mx-auto flex h-nav max-w-page items-center gap-4 px-gutter">
          <Link href="/" className="shrink-0 text-sm font-black tracking-tight text-content-primary">
            ETH<span className="text-eth-blue-text">Cali</span>
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

          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Secundaria">
            {FOOTER_NAV.map(([href, key]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-content-muted transition-colors hover:text-content-primary"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <p className="mt-6 text-xs text-content-faint">© {new Date().getFullYear()} ETH Cali</p>
        </div>
      </footer>
    </div>
  );
}
