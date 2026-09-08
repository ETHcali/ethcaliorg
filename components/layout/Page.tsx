import { useState } from 'react';

/** The heading block every non-event page opens with. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mx-auto max-w-page px-gutter pb-2 pt-14">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-4xl">{title}</h1>
      {lead && <p className="mt-4 max-w-prose text-base text-content-secondary">{lead}</p>}
    </header>
  );
}

export function Section({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line-hairline py-12 first:border-t-0">
      <div className="mx-auto max-w-page px-gutter">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
            {eyebrow}
          </p>
        )}
        {title && <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>}
        {lead && <p className="mt-3 max-w-prose text-base text-content-secondary">{lead}</p>}
        <div className={title || eyebrow ? 'mt-8' : ''}>{children}</div>
      </div>
    </section>
  );
}

const EXPLORER = 'https://etherscan.io/address/';

/**
 * An on-chain address, never as a bare string.
 *
 * Truncated with a real ellipsis, monospaced because a chain produced it,
 * copyable, and linked to a block explorer. The explorer link is the point on a
 * governance page: a treasury address the reader cannot verify for themselves is
 * just a claim.
 */
export function Address({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const short = `${value.slice(0, 6)}…${value.slice(-4)}`;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <a
        href={`${EXPLORER}${value}`}
        target="_blank"
        rel="noopener noreferrer"
        title={value}
        className="mono text-sm text-eth-blue-text hover:underline"
      >
        {label ? `${label} ` : ''}
        {short}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          } catch {
            // Clipboard is blocked in some contexts. The address is in the title
            // attribute and the explorer link, so there is still a way to get it.
          }
        }}
        aria-label={`Copiar ${value}`}
        className="rounded-chip border border-line-hairline px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-content-muted transition-colors hover:border-line-strong hover:text-content-primary"
      >
        {copied ? '✓' : 'copy'}
      </button>
    </span>
  );
}

/** A titled card with an outbound link. Used across DAO, education and swag. */
export function LinkCard({
  title,
  detail,
  url,
  cta,
}: {
  title: string;
  detail: string;
  url: string;
  cta?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-card border border-line-hairline bg-surface-slab p-5 transition-colors hover:border-line-brand"
    >
      <h3 className="text-base font-bold text-content-primary">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{detail}</p>
      <span className="mt-4 text-sm font-semibold text-eth-blue-text">{cta ?? 'Ver'} →</span>
    </a>
  );
}
