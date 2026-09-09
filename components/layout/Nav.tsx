import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface NavChild {
  href: string;
  key: string;
}

export interface NavItem {
  href: string;
  key: string;
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

  const active = router.asPath.split('?')[0].startsWith(item.href);

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
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        // A short grace period, or the menu vanishes while the pointer is
        // crossing the gap between the trigger and the panel.
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
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
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`${t(item.key)} — submenú`}
          className="-ml-1.5 flex h-8 w-6 items-center justify-center text-content-faint transition-colors hover:text-content-primary"
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

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 min-w-[190px] overflow-hidden rounded-card border border-line-hairline bg-surface-slab py-1 shadow-lg shadow-black/40"
        >
          {item.children.map((child) => {
            const childActive = router.asPath.split('?')[0] === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  childActive
                    ? 'bg-eth-blue-wash text-eth-blue-text'
                    : 'text-content-secondary hover:bg-surface-inset hover:text-content-primary'
                }`}
              >
                {t(child.key)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
