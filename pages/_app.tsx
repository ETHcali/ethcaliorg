// Order matters: tokens.css defines the custom properties that both the Tailwind
// preset and globals.css read. Loading it second would leave every token class
// resolving to a colour with no channels.
import '@ethcali/design-tokens/tokens.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
