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
 * The six places the app can take you, in the app's own order and words.
 *
 * Mirrors `AREAS` in wallet_ethcali/pages/index.tsx: same order, same titles,
 * same images (public/images/app). The English is the app's copy verbatim; the
 * Spanish says the same thing. Change one, change the other.
 *
 * `url` decides how you get there. The first four need a session, so they go
 * through the app's front door with the destination attached (`appEntry`) and
 * you land where you clicked after signing in. Swag and donations read fine
 * signed out, so they are plain deep links.
 */
export const APP_AREAS: readonly {
  title: Bilingual;
  detail: Bilingual;
  url: string;
  cta: Bilingual;
  /** The same rendered object the app's landing page uses for this area. */
  image: string;
}[] = [
  {
    title: { es: 'Una wallet que paga su propio gas', en: 'A wallet that pays its own gas' },
    detail: {
      es: 'Envía, recibe e intercambia ETH, USDC, USDT y EURC en Ethereum. La comunidad patrocina el gas; las llaves son tuyas.',
      en: 'Send, receive and swap ETH, USDC, USDT and EURC on Ethereum. The community sponsors the gas; the keys stay yours.',
    },
    url: appEntry('/wallet'),
    cta: { es: 'Abrir tu wallet', en: 'Open your wallet' },
    image: '/images/app/wallet.webp',
  },
  {
    title: { es: 'Identidad sin vigilancia', en: 'Identity without surveillance' },
    detail: {
      es: 'Demuestra que eres una sola persona con una prueba de conocimiento cero sobre tu pasaporte y reclama tu nombre.ethcali.eth. Guardamos un nullifier, nunca un nombre.',
      en: 'Prove you are one person with a zero-knowledge passport proof, then claim your name.ethcali.eth. We store a nullifier, never a name.',
    },
    url: appEntry('/sybil'),
    cta: { es: 'Verificarte', en: 'Verify yourself' },
    image: '/images/app/identity.webp',
  },
  {
    title: { es: 'Un faucet para humanos verificados', en: 'A faucet for verified humans' },
    detail: {
      es: 'Cuando ETH Cali abre una bóveda para un evento o una hackathon, las personas verificadas reclaman un poco de ETH para gas sin pedirle permiso a nadie.',
      en: 'When ETH Cali opens a vault for an event or a hackathon, verified people claim a little ETH for gas without asking anyone.',
    },
    url: appEntry('/faucet'),
    cta: { es: 'Ir al faucet', en: 'Go to the faucet' },
    image: '/images/app/faucet.webp',
  },
  {
    title: { es: 'Certificados que son tuyos', en: 'Certificates you own' },
    detail: {
      es: 'Quienes construyen y organizan los eventos de ETH Cali reciben un certificado soulbound en Ethereum, con PDF y credencial de LinkedIn en un clic.',
      en: 'Builders and organisers of ETH Cali events receive a soulbound certificate on Ethereum, with a PDF and a one-click LinkedIn credential.',
    },
    url: appEntry('/certificate'),
    cta: { es: 'Ver tus certificados', en: 'See your certificates' },
    image: '/images/app/certificates.webp',
  },
  {
    title: { es: 'Swag, con tarjeta o USDC', en: 'Swag, paid by card or USDC' },
    detail: {
      es: 'Cada diseño es un token en Ethereum. Paga con tarjeta, o en USDC por menos, y el token es tuyo de cualquier forma.',
      en: 'Every design is a token on Ethereum. Pay by card, or in USDC for less, and the token is yours either way.',
    },
    url: APP.swag,
    cta: { es: 'Ver la tienda', en: 'Browse the store' },
    image: '/images/app/swag.webp',
  },
  {
    title: { es: 'Donaciones que puedes verificar', en: 'Donations you can verify' },
    detail: {
      es: 'Apoya las campañas de ETH Cali en ETH o USDC, directo al Safe de la comunidad. Los totales y el muro de donantes se leen de la cadena.',
      en: 'Fund ETH Cali campaigns in ETH or USDC, straight to the community Safe. Totals and the donor wall are read from the chain.',
    },
    url: APP.donations,
    cta: { es: 'Ver las campañas', en: 'See the campaigns' },
    image: '/images/app/donations.webp',
  },
];

/**
 * What the app is built on, for the moving strip on /app. The app's own landing
 * page lists the first six as "Built on"; Safe is here too because every
 * donation lands in the community Safe. Each links to the project itself.
 */
export const APP_TOOLS: readonly { name: string; logo: string; url: string }[] = [
  { name: 'Privy', logo: '/tools/privy.png', url: 'https://www.privy.io' },
  { name: 'ZKPassport', logo: '/tools/zkpassport.png', url: 'https://zkpassport.id' },
  { name: 'ENS', logo: '/tools/ens.svg', url: 'https://ens.domains' },
  { name: 'LI.FI', logo: '/tools/lifi.png', url: 'https://li.fi' },
  { name: 'POAP', logo: '/tools/poap.png', url: 'https://poap.xyz' },
  { name: 'OpenSea', logo: '/tools/opensea.svg', url: 'https://opensea.io' },
  { name: 'Safe', logo: '/tools/safe.svg', url: 'https://safe.global' },
];
