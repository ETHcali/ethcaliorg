// Order matters: tokens.css defines the custom properties that both the Tailwind
// preset and globals.css read. Loading it second would leave every token class
// resolving to a colour with no channels.
import '@ethcali/design-tokens/tokens.css';
// Leaflet's own stylesheet, which it needs to position tiles and panes at all —
// without it the map renders as a pile of stacked images. Loaded globally
// because Next only accepts global CSS here; `styles/globals.css` restyles its
// controls and popups to the dark theme afterwards, so the order matters.
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
