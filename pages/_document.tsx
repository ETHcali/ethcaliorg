import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Sarun Pro ships inside @ethcali/design-tokens and is requested by tokens.css,
 * which the CSS bundle pulls in. Black and Book are preloaded because they are
 * the two weights above the fold on every page; the rest load on demand.
 */
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/branding/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/branding/faviconethcali38x38.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
