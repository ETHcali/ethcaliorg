import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NavItem } from './Nav';

/**
 * The phone menu: a full-screen sheet under the bar, one accordion per group.
 *
 * It replaced a flat list of every link on the site (about twenty rows) that
 * also printed hackathon slugs instead of their names: the old sheet rendered
 * `t(row.key)` and ignored `row.label`, which is where a CMS name lives.
 *
 * - Rendered outside <header>. The header has `backdrop-blur`, and a
 *   backdrop-filter makes it the containing block for fixed descendants, so a
 *   fixed sheet inside it is sized to the 60px bar, not the screen.
 * - Always mounted, hidden with `invisible` when closed: the exit can animate,
 *   closed links leave the tab order and the accessibility tree, and every page
 *   stays linked in the HTML a crawler receives.
 * - The group holding the current page starts open, so the menu opens where
 *   you are. One group open at a time keeps the sheet short on a small phone.
 * - Locks page scroll while open; Escape closes.
 * - Motion: the sheet fades and drops 8px, groups stagger 35ms. Transform and
 *   opacity only; reduced motion keeps the fade and drops the movement.
 */
export default function MobileNav({
  items,
  t,
  current,
  open,
  onClose,
  goToApp,
}: {
  items: readonly NavItem[];
  t: (key: string) => string;
  /** The current path without query or hash. */
  current: string;
  open: boolean;
  onClose: () => void;
  /** The app CTA: its href and its label. */
  goToApp: { href: string; label: string };
}) {
  const groupOf = (path: string) =>
    items.find((i) => i.children?.some((c) => c.href === path) || path.startsWith(i.matchPrefix ?? i.href))?.href ?? null;

  const [expanded, setExpanded] = useState<string | null>(() => groupOf(current));

  // Reopen on the current page's group each time the sheet opens. Adjusted
  // during render when `open` flips (React's pattern for state derived from a
  // prop change), not in an effect, so there is no extra render with the
  // previous group showing.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setExpanded(groupOf(current));
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const ease = 'ease-[cubic-bezier(0.23,1,0.32,1)]';

  return (
    <nav
      id="mobile-nav"
      aria-label="Principal, móvil"
      className={`fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-30 overflow-y-auto overscroll-contain bg-surface-void transition-[opacity,transform,visibility] duration-200 ${ease} motion-reduce:transform-none lg:hidden ${
        open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
      }`}
    >
      <div className="mx-auto flex min-h-full max-w-page flex-col px-gutter pb-10 pt-4">
        <a
          href={goToApp.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex min-h-[52px] items-center justify-center rounded-control bg-eth-blue px-4 text-base font-bold text-on-brand transition-[background-color,transform] duration-150 ease-out hover:bg-eth-blue-lift active:scale-[0.98]"
        >
          {goToApp.label} →
        </a>

        <ul className="mt-4">
          {items.map((item, i) => {
            const stagger = {
              transitionDelay: open ? `${60 + i * 35}ms` : '0ms',
            };
            const rowMotion = `transition-[opacity,transform] duration-300 ${ease} motion-reduce:transform-none ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`;

            if (!item.children) {
              const here = current === item.href;
              return (
                <li key={item.href} style={stagger} className={`border-b border-line-hairline ${rowMotion}`}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={here ? 'page' : undefined}
                    className={`flex min-h-[60px] items-center text-xl font-semibold ${here ? 'text-eth-blue-text' : 'text-content-primary'}`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            }

            const isOpen = expanded === item.href;
            const panelId = `m-${item.href.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`;
            const holdsCurrent = groupOf(current) === item.href;

            return (
              <li key={item.href} style={stagger} className={`border-b border-line-hairline ${rowMotion}`}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.href)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-[60px] w-full items-center justify-between text-left"
                >
                  <span className={`flex items-center gap-2 text-xl font-semibold ${holdsCurrent ? 'text-eth-blue-text' : 'text-content-primary'}`}>
                    {t(item.key)}
                    {item.live && <span className="h-1.5 w-1.5 rounded-full bg-signal-confirmed" aria-hidden />}
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-line-hairline text-content-muted transition-transform duration-200 ${ease} ${isOpen ? 'rotate-45' : ''}`}
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path d="M6 1.5v9M1.5 6h9" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                {/* Height via grid rows (0fr → 1fr): no measuring, and the
                    collapsed links are `invisible`, so they leave the tab order. */}
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-200 ${ease} motion-reduce:transition-none ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <ul className={`min-h-0 overflow-hidden ${isOpen ? 'visible pb-3' : 'invisible'}`}>
                    {item.children.map((child) => {
                      const here = current === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            tabIndex={isOpen ? undefined : -1}
                            aria-current={here ? 'page' : undefined}
                            className={`ml-1 flex min-h-tap items-center gap-3 border-l py-2 pl-4 text-base transition-colors ${
                              here
                                ? 'border-eth-blue text-eth-blue-text'
                                : 'border-line-hairline text-content-secondary hover:text-content-primary'
                            }`}
                          >
                            {child.label ?? t(child.key)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
