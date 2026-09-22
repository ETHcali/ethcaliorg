/**
 * The app, described from the site.
 *
 * app.ethcali.org is a separate deployment with its own landing page, and that
 * page is in English only. This site's default locale is Spanish, so the pitch
 * is written again here rather than linked to — a Colombian donor deciding
 * whether to open a wallet should be able to read what it is first, in Spanish,
 * on a page that keeps the site's own navigation around it.
 *
 * That means the pitch exists twice: here, and in
 * `wallet_ethcali/pages/index.tsx`. Deliberate, but it drifts if nobody
 * remembers — change one and check the other.
 *
 * Every `href` is built from `lib/links.ts`. Nothing here hardcodes the app's
 * origin, so the host can move in one edit as it did from wallet.ethcali.org.
 */
import { APP, appEntry } from '../lib/links';
import type { Bilingual } from './site';

/**
 * The five places the app can take you.
 *
 * `entry` says how to link there, and it is not cosmetic. The first three need
 * a session: linked to directly while signed out, the app bounces you to its
 * landing page and forgets where you were going. `appEntry` carries the
 * destination through the sign-in so you arrive where you clicked. The last two
 * read fine signed out — a login wall in front of a donor wall is a click for
 * nothing — so they are plain deep links.
 */
export const APP_AREAS: readonly {
  title: Bilingual;
  detail: Bilingual;
  url: string;
  cta: Bilingual;
}[] = [
  {
    title: { es: 'Wallet', en: 'Wallet' },
    detail: {
      es: 'Tu billetera de autocustodia. Entras con correo, passkey o Google y las llaves quedan tuyas — nadie de ETH Cali puede mover tus fondos.',
      en: 'Your self-custody wallet. Sign in with email, a passkey or Google and the keys stay yours — nobody at ETH Cali can move your funds.',
    },
    url: appEntry('/wallet'),
    cta: { es: 'Abrir mi wallet', en: 'Open my wallet' },
  },
  {
    title: { es: 'Faucet', en: 'Faucet' },
    detail: {
      es: 'ETH de prueba desde las bóvedas de la comunidad, sin pedirle permiso a nadie. Primero verificas que eres una persona.',
      en: 'Test ETH from the community vaults, without asking anyone. You verify you are a person first.',
    },
    url: appEntry('/faucet'),
    cta: { es: 'Ir al faucet', en: 'Go to the faucet' },
  },
  {
    title: { es: 'Identidad', en: 'Identity' },
    detail: {
      es: 'Demuestras que eres una sola persona con una prueba de conocimiento cero sobre tu pasaporte. Guardamos un nullifier, nunca un nombre ni una foto.',
      en: 'Prove you are one person with a zero-knowledge proof over your passport. We store a nullifier, never a name and never a photo.',
    },
    url: appEntry('/sybil'),
    cta: { es: 'Verificarme', en: 'Verify myself' },
  },
  {
    title: { es: 'Swag', en: 'Swag' },
    detail: {
      es: 'La tienda de merch, pagada en USDC. Se puede mirar sin entrar; para comprar necesitas wallet.',
      en: 'The merch store, paid in USDC. Browsable without signing in; buying needs a wallet.',
    },
    url: APP.swag,
    cta: { es: 'Ver la tienda', en: 'See the store' },
  },
  {
    title: { es: 'Donaciones', en: 'Donations' },
    detail: {
      es: 'Campañas abiertas en ETH, USDC y COPm. El muro de donantes y los totales son públicos y se leen de la cadena, entres o no.',
      en: 'Open campaigns in ETH, USDC and COPm. The donor wall and the totals are public and read from the chain, signed in or not.',
    },
    url: APP.donations,
    cta: { es: 'Ver las campañas', en: 'See the campaigns' },
  },
];

/** What makes it different from any other wallet. Four, same as the app says. */
export const APP_FEATURES: readonly { n: string; title: Bilingual; detail: Bilingual }[] = [
  {
    n: '01',
    title: { es: 'El gas lo paga la comunidad', en: 'Gas paid by the community' },
    detail: {
      es: 'Cada transacción va patrocinada. No necesitas comprar ETH antes de poder hacer nada — que es exactamente donde se atasca casi todo el mundo la primera vez.',
      en: 'Every transaction is sponsored. You never buy ETH just to be able to do anything — which is exactly where almost everyone gets stuck the first time.',
    },
  },
  {
    n: '02',
    title: { es: 'Identidad sin vigilancia', en: 'Identity without surveillance' },
    detail: {
      es: 'La prueba de personhood es criptográfica, no un formulario. Se verifica contra tu pasaporte en tu propio dispositivo y lo único que llega a la cadena es un identificador que no se puede revertir a ti.',
      en: 'The personhood proof is cryptographic, not a form. It is checked against your passport on your own device, and the only thing that reaches the chain is an identifier that cannot be turned back into you.',
    },
  },
  {
    n: '03',
    title: { es: 'Las llaves son tuyas', en: 'The keys are yours' },
    detail: {
      es: 'Autocustodia de verdad: la wallet se crea en tu sesión y puedes exportarla o conectar la que ya tengas. ETH Cali no custodia fondos de nadie.',
      en: 'Real self-custody: the wallet is created in your session and you can export it, or connect one you already have. ETH Cali holds nobody’s funds.',
    },
  },
  {
    n: '04',
    title: { es: 'Todo queda en la cadena', en: 'Everything settles onchain' },
    detail: {
      es: 'Compras y donaciones dejan recibo — un token que te quedas — y los totales de cada campaña se pueden verificar contra el contrato sin creernos nada.',
      en: 'Purchases and donations leave a receipt — a token you keep — and every campaign total can be checked against the contract without taking our word for it.',
    },
  },
];

/**
 * The networks the app itself supports.
 *
 * Not `CHAINS` from `content/site.ts`: that one is "where ETH Cali deploys" and
 * includes Polygon and Gnosis, where the wallet does not run. This is the list
 * in the app's own chain switcher, and Celo is on it because COPm lives there.
 */
export const APP_NETWORKS: readonly { name: string; note: Bilingual | null }[] = [
  { name: 'Base', note: null },
  { name: 'Ethereum', note: null },
  { name: 'Optimism', note: null },
  { name: 'Unichain', note: null },
  {
    name: 'Celo',
    note: { es: 'donde vive COPm', en: 'where COPm lives' },
  },
];

/**
 * How you get in.
 *
 * Neither property answers this anywhere today, and it is the first question a
 * first-time donor has — most people assume "wallet" means installing something.
 */
export const APP_SIGNIN: readonly Bilingual[] = [
  { es: 'Correo electrónico', en: 'Email' },
  { es: 'Passkey (Face ID o huella)', en: 'Passkey (Face ID or fingerprint)' },
  { es: 'Google', en: 'Google' },
  { es: 'Una wallet que ya tengas', en: 'A wallet you already have' },
];
