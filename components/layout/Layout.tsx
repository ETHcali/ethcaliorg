import Link from 'next/link';
import { useRouter } from 'next/router';
import { asLocale, translator } from '../../lib/i18n';

const NAV = [
  // Time-boxed campaign entry. Paid traffic lands on /builders-tour directly,
  // but organic visitors have to be able to find it too, so it leads the nav
  // and is styled as the one live thing until 20 September.
  { href: '/builders-tour', key: 'nav.tour', live: true },
  { href: '/events', key: 'nav.events' },
  { href: '/hackathons', key: 'nav.hackathons' },
  { href: '/venues', key: 'nav.venues' },
] as const;

/**
 * The site chrome.
 *
 * The old site fetched navbar.html and footer.html at runtime into empty divs,
 * which meant the nav was invisible to crawlers and the page reflowed once it
 * landed. Here it is part of the render.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = asLocale(router.locale);
  const t = translator(locale);

  const other = locale === 'es' ? 'en' : 'es';
  const current = router.asPath;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line-hairline bg-surface-void/85 backdrop-blur">
        <div className="mx-auto flex h-nav max-w-page items-center gap-6 px-gutter">
          <Link href="/" className="text-sm font-black tracking-tight text-content-primary">
            ETH<span className="text-eth-blue-text">Cali</span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Principal">
            {NAV.map((item) => {
              const active = current.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-chip px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'text-eth-blue-text'
                      : 'live' in item && item.live
                        ? 'font-semibold text-content-primary'
                        : 'text-content-muted hover:text-content-primary'
                  }`}
                >
                  {'live' in item && item.live && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-signal-confirmed"
                      aria-hidden
                    />
                  )}
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Keeps you on the page you are reading rather than dumping you home. */}
          <Link
            href={current}
            locale={other}
            className="ml-auto rounded-chip border border-line-hairline px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-content-muted transition-colors hover:border-line-strong hover:text-content-primary"
          >
            {other}
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-line-hairline">
        <div className="mx-auto max-w-page px-gutter py-10">
          <p className="text-sm font-bold text-content-primary">ETH Cali</p>
          <p className="mt-1 max-w-prose text-sm text-content-muted">
            Fundación Innovación del Pacífico · Cali, Colombia
          </p>
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Secundaria">
            {[
              ['/education', 'nav.education'],
              ['/swag', 'nav.swag'],
              ['/technical-infra', 'nav.infra'],
              ['/brand-guidelines', 'nav.brand'],
            ].map(([href, key]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-content-muted transition-colors hover:text-content-primary"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <p className="mt-6 text-xs text-content-faint">
            © {new Date().getFullYear()} ETH Cali
          </p>
        </div>
      </footer>
    </div>
  );
}
