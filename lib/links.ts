/**
 * Outbound links to the other ETH Cali property.
 *
 * The wallet/dApp is a separate deployment, so every link to it is absolute.
 * Kept in one constant because the host is moving from `wallet.ethcali.org` to
 * `app.ethcali.org` — one edit here rather than a grep across pages.
 *
 * Both hosts point at the same Vercel project while DNS propagates, so links
 * built from this constant keep working through the change.
 */
export const APP_ORIGIN = 'https://app.ethcali.org';

export const APP = {
  home: APP_ORIGIN,
  donations: `${APP_ORIGIN}/donations`,
  swag: `${APP_ORIGIN}/swag`,
  faucet: `${APP_ORIGIN}/faucet`,
  wallet: `${APP_ORIGIN}/wallet`,
  /** The CMS behind this site. Admin-gated by ADMIN_ROLE on chain. */
  adminContent: `${APP_ORIGIN}/admin/content`,
} as const;
