/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  // Spanish is the default and carries no prefix: ethcali.org/events stays the
  // Spanish URL it has always been, and /en/events is added alongside it.
  // localeDetection is off deliberately — a Colombian visitor with an English
  // browser should still land on the Spanish site, which is the primary one.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localeDetection: false,
  },

  // The old site published these URLs; several are in og:url tags that are
  // already out in the world. 308 rather than 307 so they are cached as permanent.
  async redirects() {
    const moved = [
      ['/ethcali', '/'],
      ['/home', '/'],
      ['/events_locales', '/events/local'],
      ['/events_internationals', '/events/international'],
      ['/ethcalivenues', '/venues'],
      // NOT YET PORTED — do not add a redirect until the target page exists,
      // or these become 308s to a 404, which is worse than the old page:
      //   /ethcalidao /about /education /swag /technical-infra /brand_guidelines
      ['/hackathon-ethcolombia-2023', '/hackathons/hackathon-web3-ethcolombia'],
      ['/hackathon-web3-cali-2025', '/hackathons/hackathon-web3-cali'],
      ['/hackathon-usc-2025', '/hackathons/hackathon-usc'],
    ];
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};
