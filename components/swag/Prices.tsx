import type { Locale } from '../../lib/i18n';
import { usdToCopRounded, type Trm } from '../../lib/fx';
import { usdPrice, usdcPrice, USDC_DISCOUNT_PCT } from '../../lib/swag';
import type { SwagProduct } from '../../types/content';

/**
 * The two prices of a product, the same on its page and on its card.
 *
 * The card price leads, with its peso line from the day's TRM; the USDC price
 * follows, labelled with the discount so the reader knows why it is lower.
 * Both always come from the row — never one from the row and the other from a
 * multiplication in JSX, which is how two surfaces drift apart by a cent.
 */
export default function Prices({
  product,
  trm,
  locale,
  size = 'md',
}: {
  product: Pick<SwagProduct, 'price_usd' | 'price_usdc'>;
  trm: Trm | null;
  locale: Locale;
  size?: 'md' | 'lg';
}) {
  const en = locale === 'en';
  const tag = en ? 'en-US' : 'es-CO';
  // Whole dollars stay whole (US$15); a discounted price shows both cents
  // (US$13.50), never a dangling "13,5".
  const usd = (v: number) =>
    `US$${v.toLocaleString(tag, { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })}`;

  const list = usdPrice(product);
  const usdc = usdcPrice(product);
  const cop = list !== null && trm ? usdToCopRounded(list, trm.rate) : null;

  return (
    <div>
      <p className={`${size === 'lg' ? 'text-3xl' : 'text-lg'} font-bold text-content-primary`}>
        {list !== null ? usd(list) : '—'}
      </p>
      {cop !== null && (
        <p className="text-xs text-content-muted">
          {en ? `≈ COP ${cop.toLocaleString(tag)} at today's rate` : `≈ COP ${cop.toLocaleString(tag)} al cambio de hoy`}
        </p>
      )}
      {usdc !== null && (
        <p className={`${size === 'lg' ? 'mt-2 text-lg' : 'mt-1 text-sm'} font-semibold text-eth-blue-text`}>
          {usd(usdc)}{' '}
          <span className="text-xs font-semibold text-content-muted">
            {en ? `· ${USDC_DISCOUNT_PCT} % off with USDC` : `· −${USDC_DISCOUNT_PCT} % con USDC`}
          </span>
        </p>
      )}
    </div>
  );
}
