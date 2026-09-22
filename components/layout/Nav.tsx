import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface NavChild {
  href: string;
  /** Translation key. Ignored when `label` is set. */
  key: string;
  /**
   * A literal, already-localized label — for entries that are data rather than
   * chrome. A hackathon's name comes out of the CMS and has no translation key
   * to look up.
   */
  label?: string;
}

export interface NavItem {
  href: string;
  key: string;
  /** Highlight on this prefix when it differs from href (e.g. /events/local under /events). */
  matchPrefix?: string;
  /** Renders as a dropdown. The parent href stays a real, clickable page. */
  children?: readonly NavChild[];
  /** Time-boxed campaign entry — dot and heavier weight. */
  live?: boolean;
}

/**
 * One nav entry, with an optional dropdown.
 *
 * Opens on hover for pointers and on click for touch, and the parent stays a
 * link either way — a top-level item that only opens a menu is a dead end for
 * anyone who expected `/events` to be a page, and it is.
 *
 * Closes on Escape, on outside click, and on route change. The last one matters:
 * without it the menu stays open over the page you just navigated to.
 */
export default function NavEntry({
  item,
  t,
  onNavigate,
}: {
  item: NavItem;
  t: (key: string) => string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>();

  // Derived from the href rather than useId(): it has to be identical on the
  // server and the client, and it is the one string on this component that is
  // already unique per entry.
  const panelId = `nav-${item.href.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`;

  // A group can gather pages that share no path prefix — Nosotros holds /about,
  // /dao, /venues and /technical-infra, and Hackathons holds the Builders Tour
  // campaign — so the parent also lights up when the current route is any of
  // its descendants. Prefix matching alone left the bar showing nothing
  // selected on a third of the site.
  const path = router.asPath.split('?')[0].split('#')[0];
  const active =
    path.startsWith(item.matchPrefix ?? item.href) ||
    (item.children?.some((c) => path === c.href) ?? false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeComplete', close);
    return () => router.events.off('routeChangeComplete', close);
  }, [router.events]);

  // Clear on unmount so a pending close cannot fire against a gone component.
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const linkClass = `flex items-center gap-1.5 whitespace-nowrap rounded-chip px-3 py-2 text-sm transition-colors ${
    active
      ? 'text-eth-blue-text'
      : item.live
        ? 'font-semibold text-content-primary'
        : 'text-content-muted hover:text-content-primary'
  }`;

  if (!item.children) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={linkClass}
      >
        {item.live && <span className="h-1.5 w-1.5 rounded-full bg-signal-confirmed" aria-hidden />}
        {t(item.key)}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      // `h-full`, not the 36px the row wants. The bar is 60px tall and this box
      // used to be 36, so there was a 12px dead strip above and below every
      // entry: run the cursor along the bar and the menu opens only if you
      // happen to be in the middle band. The whole height of the bar over this
      // entry now opens it, which is what "on hover" is supposed to mean.
      className="relative flex h-full items-center"
      onMouseEnter={() => {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        // A short grace period, or the menu vanishes while the pointer is
        // crossing the gap between the trigger and the panel.
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
      // Tabbing past the last child used to leave the panel hanging open behind
      // the cursor. relatedTarget is where focus went; inside the group it is
      // still ours, and null (window blur) is not a reason to close.
      onBlur={(e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={linkClass}
        >
          {t(item.key)}
        </Link>
        {/* `aria-haspopup="menu"` and the role="menu"/"menuitem" pair that used
            to go with it promise an application menu: a screen reader announces
            one and its user reaches for the arrow keys, which do nothing here.
            This is a list of links. `aria-expanded` and `aria-controls` are the
            whole of what it needs to say. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${t(item.key)} — submenú`}
          className="-ml-1.5 flex h-8 w-6 shrink-0 items-center justify-center text-content-faint transition-colors hover:text-content-primary"
        >
          <svg
            viewBox="0 0 12 12"
            className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Always in the DOM, hidden with the `hidden` attribute rather than
          unmounted.

          Mounting this only when `open` meant the children existed nowhere in
          the server-rendered HTML — a crawler never hovers. When the loose
          pages moved out of the footer and into these menus, /dao, /venues,
          /technical-infra, /swag, /brand-guidelines and the winners page lost
          every internal link on the site in one commit and were left findable
          only through the sitemap. `hidden` keeps the anchors in the markup and
          out of the accessibility tree and the tab order, which is what we
          wanted from the conditional in the first place. */}
      <ul
        id={panelId}
        hidden={!open}
        // `w-max` so the panel sizes to the longest entry. These are hackathon
        // names out of the CMS, not chrome labels of a known length, and at a
        // fixed 190px "Hacksession Base Batch LATAM: Zonamerica Colombia" set
        // itself over three ragged lines. Capped so one very long name cannot
        // run the menu off a laptop screen; it wraps at that point instead.
        className="absolute left-0 top-full z-50 w-max min-w-[200px] max-w-[min(24rem,80vw)] overflow-hidden rounded-card border border-line-hairline bg-surface-slab py-1 shadow-lg shadow-black/40"
      >
        {item.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              aria-current={path === child.href ? 'page' : undefined}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                path === child.href
                  ? 'bg-eth-blue-wash text-eth-blue-text'
                  : 'text-content-secondary hover:bg-surface-inset hover:text-content-primary'
              }`}
            >
              {child.label ?? t(child.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
