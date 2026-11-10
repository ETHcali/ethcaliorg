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
 * The six places the app can take you.
 *
 * `entry` says how to link there, and it is not cosmetic. The first four need
 * a session: linked to directly while signed out, the app bounces you to its
 * landing page and forgets where you were going. `appEntry` carries the
 * destination through the sign-in so you arrive where you clicked. The last two
 * read fine signed out — a login wall in front of a donor wall is a click for
 * nothing — so they are plain deep links.
 */
export const APP_AREAS: readonly {
  title: Bilingual;
  /** The panel's big line on /app; `title` is the small label above it. */
  headline: Bilingual;
  detail: Bilingual;
  url: string;
  cta: Bilingual;
  /** The same rendered object the app's own landing page uses for this area. */
  image: string;
}[] = [
  {
    title: { es: 'Wallet', en: 'Wallet' },
    headline: { es: 'Tu wallet. Nuestro gas.', en: 'Your wallet. Our gas.' },
    detail: {
      es: 'Entras con correo o passkey. Las llaves son tuyas y el gas lo paga ETH Cali.',
      en: 'Sign in with email or a passkey. The keys are yours; ETH Cali pays the gas.',
    },
    url: appEntry('/wallet'),
    cta: { es: 'Abrir mi wallet', en: 'Open my wallet' },
    image: '/images/app/wallet.webp',
  },
  {
    title: { es: 'Faucet', en: 'Faucet' },
    headline: { es: 'ETH para arrancar.', en: 'ETH to get started.' },
    detail: {
      es: 'Un poco de ETH para gas cuando abrimos una bóveda para un evento o una hackathon.',
      en: 'A little ETH for gas when we open a vault for an event or a hackathon.',
    },
    url: appEntry('/faucet'),
    cta: { es: 'Ir al faucet', en: 'Go to the faucet' },
    image: '/images/app/faucet.webp',
  },
  {
    title: { es: 'Identidad', en: 'Identity' },
    headline: { es: 'Una persona, cero datos.', en: 'One person, zero data.' },
    detail: {
      es: 'Pruebas con tu pasaporte que eres una persona. A la cadena solo llega un código anónimo.',
      en: 'Prove with your passport that you are one person. Only an anonymous code reaches the chain.',
    },
    url: appEntry('/sybil'),
    cta: { es: 'Verificarme', en: 'Verify myself' },
    image: '/images/app/identity.webp',
  },
  {
    title: { es: 'Certificados', en: 'Certificates' },
    headline: { es: 'Lo que construiste, en la cadena.', en: 'What you built, onchain.' },
    detail: {
      es: '¿Construiste u organizaste con nosotros? Tu certificado vive en Ethereum, con PDF y LinkedIn.',
      en: 'Built or organised with us? Your certificate lives on Ethereum, with a PDF and LinkedIn.',
    },
    url: appEntry('/certificate'),
    cta: { es: 'Ver mis certificados', en: 'See my certificates' },
    image: '/images/app/certificates.webp',
  },
  {
    title: { es: 'Swag', en: 'Swag' },
    headline: { es: 'Merch que también es token.', en: 'Merch that is also a token.' },
    detail: {
      es: 'Paga con tarjeta o con USDC. Cada diseño es un token que te quedas.',
      en: 'Pay by card or with USDC. Every design is a token you keep.',
    },
    url: APP.swag,
    cta: { es: 'Ver la tienda', en: 'See the store' },
    image: '/images/app/swag.webp',
  },
  {
    title: { es: 'Donaciones', en: 'Donations' },
    headline: { es: 'Donaciones que puedes verificar.', en: 'Donations you can verify.' },
    detail: {
      es: 'Dona en ETH o USDC. Los totales y el muro de donantes se leen de la cadena.',
      en: 'Give in ETH or USDC. Totals and the donor wall are read from the chain.',
    },
    url: APP.donations,
    cta: { es: 'Ver las campañas', en: 'See the campaigns' },
    image: '/images/app/donations.webp',
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
