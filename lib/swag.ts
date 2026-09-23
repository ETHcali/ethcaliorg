/**
 * The store's two doors, spelled once.
 *
 * A product is bought from two surfaces — its own page at `/swag/<sku>` and its
 * card in the grid — and from either one the same two links come out: the
 * Shopify cart permalink for a card payment, and the app for USDC. Both pages
 * and the sitemap read these helpers so a SKU, a variant id or a UTM parameter
 * cannot be spelled differently in two places.
 */
import type { ParsedUrlQuery } from 'querystring';
import { APP_ORIGIN } from './links';
import type { SwagProduct, SwagShopifyVariant } from '../types/content';

/**
 * The Shopify storefront. `/cart/<variantId>:1` 302s straight into checkout —
 * no Shopify product page, no second storefront in the middle of the flow.
 */
export const STORE_ORIGIN = 'https://store.ethcali.org';

/** The discount for paying in USDC, agreed 2026-09-23. Copy reads it from here. */
export const USDC_DISCOUNT_PCT = 10;

/**
 * The route of a product page. SKUs are stored uppercase and the URL keeps
 * them that way; a lowercase URL typed into an ad 308s here (see
 * `pages/swag/[sku].tsx`), so this is the only spelling a canonical or a
 * sitemap ever carries.
 */
export function swagRoute(sku: string): string {
  return `/swag/${sku.toUpperCase()}`;
}

/** Numeric in Postgres, a number or a string over PostgREST; null when unusable. */
function money(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** The list (card) price in USD. */
export function usdPrice(product: Pick<SwagProduct, 'price_usd'>): number | null {
  return money(product.price_usd);
}

/**
 * The USDC price. `price_usdc` is what the sync script wrote to chain; when the
 * column is empty the discount is applied here so the site never shows a card
 * price where a USDC price should be.
 */
export function usdcPrice(product: Pick<SwagProduct, 'price_usd' | 'price_usdc'>): number | null {
  const stored = money(product.price_usdc);
  if (stored !== null) return stored;
  const list = money(product.price_usd);
  return list === null ? null : Math.round(list * (100 - USDC_DISCOUNT_PCT)) / 100;
}

/** `gid://shopify/ProductVariant/46749006364858` → `46749006364858`. */
export function variantNumericId(gid: string | null | undefined): string | null {
  if (!gid) return null;
  const tail = gid.trim().split('/').pop() ?? '';
  return /^\d+$/.test(tail) ? tail : null;
}

/** The Shopify row for a size — or the single row when the product is unsized. */
export function variantForSize(
  product: Pick<SwagProduct, 'sized' | 'swag_shopify_variants'>,
  size: string | null
): SwagShopifyVariant | null {
  const rows = product.swag_shopify_variants ?? [];
  if (!product.sized) return rows[0] ?? null;
  if (!size) return null;
  return rows.find((v) => (v.size ?? '').toUpperCase() === size.toUpperCase()) ?? null;
}

/**
 * Only the `utm_*` keys, as strings. Anything else in the page's query is not
 * the ad network's business, and an array value (a repeated key) keeps its
 * first occurrence.
 */
export function utmParams(query: ParsedUrlQuery): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (!key.startsWith('utm_')) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (typeof v === 'string' && v) out[key] = v;
  }
  return out;
}

/**
 * Straight into checkout for one unit of a variant, carrying the campaign
 * parameters the visitor arrived with so Shopify attributes the order.
 */
export function cartPermalink(variantGid: string, utm: Record<string, string> = {}): string | null {
  const id = variantNumericId(variantGid);
  if (!id) return null;
  const url = new URL(`/cart/${id}:1`, STORE_ORIGIN);
  for (const [k, v] of Object.entries(utm)) url.searchParams.set(k, v);
  return url.toString();
}

/**
 * The product in the app with the USDC checkout already open. A wallet is
 * needed for that path, which is why it lives there and not here.
 */
export function appUsdcUrl(sku: string, size: string | null = null): string {
  const url = new URL(`/swag/${sku.toUpperCase()}`, APP_ORIGIN);
  url.searchParams.set('pay', 'usdc');
  if (size) url.searchParams.set('size', size);
  return url.toString();
}
