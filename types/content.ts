/**
 * Site content types — the CMS layer behind ethcali.org.
 *
 * These mirror the tables in supabase/migrations/20260903120000_site_content.sql.
 * They describe editorial content only: no balances, no authorization state.
 */

export const EVENT_KINDS = [
  'meetup',
  'workshop',
  'hackathon',
  'conference',
  'hacker_house',
  'volunteering',
  'other',
] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/** What ETH Cali did at the event, not what the event was. */
export const EVENT_ROLES = ['host', 'cohost', 'colab', 'participant', 'volunteering'] as const;
export type EventRole = (typeof EVENT_ROLES)[number];

/** `international` means we were there, not that it exists somewhere. */
export const EVENT_SCOPES = ['local', 'international'] as const;
export type EventScope = (typeof EVENT_SCOPES)[number];

export const VENUE_STATUSES = ['active', 'inactive', 'closed'] as const;
export type VenueStatus = (typeof VENUE_STATUSES)[number];

export const PARTNER_KINDS = [
  'host',
  'university',
  'supporter',
  'sponsor',
  'venue_partner',
] as const;
export type PartnerKind = (typeof PARTNER_KINDS)[number];

export interface EventRecord {
  id: number;
  /** Permanent public identifier. This is the URL — never regenerate it. */
  slug: string;
  kind: EventKind;
  role: EventRole;
  scope: EventScope;
  starts_on: string;
  ends_on: string | null;
  city: string | null;
  country: string | null;
  venue_id: number | null;
  location_url: string | null;
  name_es: string;
  name_en: string | null;
  summary_es: string | null;
  summary_en: string | null;
  body_es: string | null;
  body_en: string | null;
  poster_path: string | null;
  luma_slug: string | null;
  registration_url: string | null;
  rsvp_count: number | null;
  social_url: string | null;
  recap_url: string | null;
  photos_url: string | null;
  drive_folder_url: string | null;
  youtube_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueRecord {
  id: number;
  slug: string;
  name: string;
  kind: string | null;
  status: VenueStatus;
  maps_url: string | null;
  lat: string | null;
  lng: string | null;
  is_published: boolean;
}

export interface TeamMemberRecord {
  id: number;
  slug: string;
  name: string;
  role_es: string | null;
  role_en: string | null;
  status: string | null;
  since: string | null;
  image_path: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface PartnerRecord {
  id: number;
  slug: string;
  name: string;
  kind: PartnerKind;
  logo_path: string | null;
  url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface EventPoap {
  id: number;
  event_id: number;
  poap_url: string;
  chain: string | null;
  collectors: number | null;
}

export interface EventNft {
  id: number;
  event_id: number;
  protocol: string | null;
  nft_url: string | null;
  chain: string | null;
  mints: number | null;
}

export interface HackathonDetails {
  event_id: number;
  edition: string | null;
  participant_count: number | null;
  project_count: number | null;
  prize_pool: string | null;
  tracks: string[];
  sponsors: string[];
  winners: string[];
  /** The organisation we ran it with — ekinoxis.xyz for the hacker houses. */
  partner_org: string | null;
  partner_url: string | null;
  external_url: string | null;
}

/** An event plus everything its page needs. */
export interface EventDetail extends EventRecord {
  venue: Pick<VenueRecord, 'slug' | 'name' | 'maps_url' | 'lat' | 'lng'> | null;
  poaps: EventPoap[];
  nfts: EventNft[];
  hackathon: HackathonDetails | null;
}

/**
 * Spanish is required, English optional. Falling back to Spanish is deliberate:
 * a half-translated event should read as Spanish, never as a blank page.
 */
export function localized<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: string
): string | null {
  const preferred = row[`${field}_${locale}`];
  if (typeof preferred === 'string' && preferred.trim()) return preferred;
  const fallback = row[`${field}_es`];
  return typeof fallback === 'string' && fallback.trim() ? fallback : null;
}

// ── swag ────────────────────────────────────────────────────────────────────

/** The four kinds the store sells. Also the order the catalogue is shown in. */
export const SWAG_CATEGORIES = ['Cap', 'Mug', 'Hoodie', 'T-shirt'] as const;
export type SwagCategory = (typeof SWAG_CATEGORIES)[number];

/** One Shopify variant — a size of a product, or the product itself when unsized. */
export interface SwagShopifyVariant {
  shopify_variant_id: string;
  sku: string;
  size: string | null;
  /** The peso price Shopify charges. Numeric in Postgres; a number or a string over PostgREST. */
  price_cop: number | string | null;
}

/** The onchain twin of a product: one ERC-1155 token id per SKU on the collection. */
export interface SwagOnchainVariant {
  chain_id: number;
  collection_address: string | null;
  token_id: number;
  status: string;
}

/**
 * A row of `swag_products` with both its sale channels embedded. RLS limits
 * anon to active products and live variants, so nothing here filters on
 * either — an inactive product does not exist as far as this site can see.
 */
export interface SwagProduct {
  id: number;
  sku: string;
  category: SwagCategory | string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  /** Relative to this site's /public, without the leading slash: `swags/cap-pepe.png`. */
  image_path: string | null;
  image_cid: string | null;
  /** Numeric in Postgres. PostgREST sends a number, but a string is possible; parse it. */
  price_usd: number | string;
  sized: boolean;
  sizes: string[];
  shopify_handle: string | null;
  sort_order: number;
  swag_shopify_variants: SwagShopifyVariant[];
  swag_variants: SwagOnchainVariant[];
}
