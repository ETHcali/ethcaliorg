import Image from 'next/image';
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
    <header className="mx-auto max-w-page px-gutter pb-2 pt-10 sm:pt-14">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-eth-blue-text">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      {lead && <p className="mt-4 max-w-prose text-base text-content-secondary">{lead}</p>}
    </header>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  /** Set it when something links here — a hero fact, or a CTA that scrolls. */
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line-hairline py-9 first:border-t-0 sm:py-12">
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

/**
 * A titled card with an outbound link. Used across DAO, education, swag and /app.
 *
 * `image` is optional and only /app passes it: the rendered objects shared with
 * the app's landing page. Decorative (the title says what the card is), so the
 * alt text is empty, and the edges fade out with an alpha mask so the image's own
 * near-black background never draws a rectangle on the card.
 */
export function LinkCard({
  title,
  detail,
  url,
  cta,
  image,
}: {
  title: string;
  detail: string;
  url: string;
  cta?: string;
  image?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-card border border-line-hairline bg-surface-slab transition-colors hover:border-line-brand"
    >
      {image && (
        <span className="relative block aspect-[16/10]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-contain opacity-90 transition-opacity [mask-image:radial-gradient(ellipse_closest-side_at_center,black_60%,transparent_100%)] group-hover:opacity-100 motion-reduce:transition-none"
          />
        </span>
      )}
      <span className={`flex flex-1 flex-col p-5 ${image ? 'pt-1' : ''}`}>
        <h3 className="text-base font-bold text-content-primary">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{detail}</p>
        <span className="mt-4 text-sm font-semibold text-eth-blue-text">{cta ?? 'Ver'} →</span>
      </span>
    </a>
  );
}
