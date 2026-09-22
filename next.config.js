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
      // /events was a hub page whose only content was two links. Removed, but it
      // was published, so it lands on the local list rather than 404ing.
      ['/events', '/events/local'],
      ['/events_locales', '/events/local'],
      ['/events_internationals', '/events/international'],
      ['/ethcalivenues', '/venues'],
      ['/ethcalidao', '/dao'],
      ['/brand_guidelines', '/brand-guidelines'],
      // The business offer shipped as /quest and is now Frontier Cities. The old
      // URL was in the footer of every page, so it is out in the world already.
      ['/quest', '/builders-tour/frontier-cities-quest'],
      // One hackathon, one URL. The Builders Tour's page is the campaign page —
      // it has the schedule, the sponsors, the prizes and the results, while the
      // CMS row for the same weekend was a stub whose own external link pointed
      // back here. The CMS route was published and indexed, so it redirects
      // rather than 404s. See lib/routes.ts, which every link and the sitemap
      // read so none of them point at this redirect.
      ['/hackathons/ethereum-builders-tour-cali', '/builders-tour'],
      ['/hackathon-ethcolombia-2023', '/hackathons/hackathon-web3-ethcolombia'],
      ['/hackathon-web3-cali-2025', '/hackathons/hackathon-web3-cali'],
      // The USC hackathon was announced and did not happen, so its event row is
      // unpublished and /hackathons/hackathon-usc no longer resolves. This URL
      // was published, so it still has to go somewhere — the list, not a 404,
      // and not a redirect to a page that is itself gone.
      ['/hackathon-usc-2025', '/hackathons'],
    ];
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};
