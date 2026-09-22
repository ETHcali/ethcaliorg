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
  /** Proof of personhood — a ZK passport proof, not a document upload. */
  identity: `${APP_ORIGIN}/sybil`,
  profile: `${APP_ORIGIN}/profile`,
  /** The CMS behind this site. Admin-gated by ADMIN_ROLE on chain. */
  adminContent: `${APP_ORIGIN}/admin/content`,
} as const;

/**
 * A destination the app will actually honour.
 *
 * The app validates `?next=` against an allowlist (`wallet_ethcali/lib/returnTo.ts`)
 * and silently falls back to `/wallet` for anything it does not recognise — so a
 * typo here is not an error, it is a link that quietly goes somewhere else. This
 * union is the site's half of that contract. Keep the two in step.
 */
export type AppRoute = '/wallet' | '/faucet' | '/sybil' | '/swag' | '/donations' | '/profile';

/**
 * The front door, carrying where you were headed.
 *
 * `/wallet`, `/faucet` and `/sybil` need a session. Linking straight at one
 * while signed out bounces you to the app's landing page and *forgets the
 * destination* — you sign in and arrive somewhere you did not ask for. This
 * lands on the same landing page with the destination attached, and the app
 * carries you there once you are in.
 *
 * `/donations` and `/swag` read fine signed out, so they stay deep links: a
 * login wall in front of public content is a click for nothing.
 */
export const appEntry = (next?: AppRoute) =>
  next ? `${APP_ORIGIN}/?next=${encodeURIComponent(next)}` : APP_ORIGIN;
