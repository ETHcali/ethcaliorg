import { useState } from 'react';
import { useRouter } from 'next/router';
import type { Locale } from '../../lib/i18n';
import { appUsdcUrl, cartPermalink, utmParams, variantForSize, USDC_DISCOUNT_PCT } from '../../lib/swag';
import type { SwagProduct } from '../../types/content';

/**
 * One purchase module, two surfaces.
 *
 * The product page and the grid card render this same component, so buying
 * from either is the same three steps: size (when the product has sizes), then
 * one of two doors — **card**, which is the Shopify cart permalink and lands in
 * checkout directly, or **USDC**, which is the app with that product's USDC
 * checkout already open. Neither button is live until a size is chosen: a
 * cart link with no variant is a link to nothing, and sending a sizeless
 * hoodie order to the app just moves the question one hop later.
 *
 * `compact` is the card. Same behaviour, tighter spacing, no lead-in.
 *
 * These are links, not transactions — the wallet lives in the app — so there
 * is no pending state to own here. The one piece of state is the chosen size.
 */
export default function PurchaseModule({
  product,
  locale,
  compact = false,
}: {
  product: SwagProduct;
  locale: Locale;
  compact?: boolean;
}) {
  const en = locale === 'en';
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);

  const needsSize = product.sized && product.sizes.length > 0;
  const chosen = needsSize ? size : null;
  const ready = !needsSize || chosen !== null;

  // `router.query` is empty in the prerendered HTML and fills in on
  // hydration, so the permalink carries the UTMs from the first click on.
  const utm = utmParams(router.query);
  const variant = variantForSize(product, chosen);
  const cardHref = ready && variant ? cartPermalink(variant.shopify_variant_id, utm) : null;
  const usdcHref = ready ? appUsdcUrl(product.sku, chosen) : null;

  const btn =
    'inline-flex min-h-tap w-full items-center justify-center rounded-control px-4 text-sm font-bold transition-colors';
  const primary = `${btn} bg-eth-blue text-on-brand hover:bg-eth-blue-lift`;
  const secondary = `${btn} border border-line-brand text-eth-blue-text hover:bg-eth-blue-wash`;
  const disabled = 'cursor-not-allowed opacity-50 hover:bg-eth-blue';

  const cardLabel = en ? 'Pay with card' : 'Pagar con tarjeta';
  const usdcLabel = en ? `Pay with USDC −${USDC_DISCOUNT_PCT} %` : `Pagar con USDC −${USDC_DISCOUNT_PCT} %`;
  const sizeHint = en ? 'Choose a size first' : 'Elige una talla primero';

  return (
    <div className={compact ? 'mt-2 flex flex-col gap-2' : 'flex flex-col gap-3'}>
      {needsSize && (
        <div>
          {!compact && (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-content-faint">
              {en ? 'Size' : 'Talla'}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={en ? 'Size' : 'Talla'}>
            {product.sizes.map((s) => {
              const active = chosen === s;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSize(s)}
                  className={`min-h-[36px] min-w-[44px] rounded-chip border px-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? 'border-line-brand bg-eth-blue-wash text-eth-blue-text'
                      : 'border-line-hairline text-content-secondary hover:border-line-strong hover:text-content-primary'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={compact ? 'flex flex-col gap-2' : 'grid gap-3 sm:grid-cols-2'}>
        {cardHref ? (
          <a href={cardHref} target="_blank" rel="noopener noreferrer" className={primary}>
            {cardLabel}
          </a>
        ) : (
          <button type="button" disabled aria-disabled title={ready ? undefined : sizeHint} className={`${primary} ${disabled}`}>
            {cardLabel}
          </button>
        )}
        {usdcHref ? (
          <a href={usdcHref} target="_blank" rel="noopener noreferrer" className={secondary}>
            {usdcLabel}
          </a>
        ) : (
          <button type="button" disabled aria-disabled title={sizeHint} className={`${secondary} cursor-not-allowed opacity-50 hover:bg-transparent`}>
            {usdcLabel}
          </button>
        )}
      </div>

      {needsSize && !ready && (
        <p className="text-xs text-content-muted" aria-live="polite">
          {sizeHint}
        </p>
      )}
      {ready && !variant && (
        // The size exists on the product but has no Shopify row: card checkout
        // cannot happen for it. Say so rather than show a button that goes nowhere.
        <p className="text-xs text-content-muted" aria-live="polite">
          {en ? 'Card checkout is not available for this size yet.' : 'El pago con tarjeta aún no está disponible para esta talla.'}
        </p>
      )}

      <p className={`text-content-faint ${compact ? 'text-[11px] leading-snug' : 'text-xs'}`}>
        {en
          ? 'Shipping handled by the store · card payments by Stripe'
          : 'Envíos gestionados por la tienda · pago con tarjeta procesado por Stripe'}
      </p>
    </div>
  );
}
