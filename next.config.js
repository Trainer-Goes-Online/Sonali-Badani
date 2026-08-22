/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    // Served to phones first, so the small widths matter more than the large.
    deviceSizes: [360, 390, 430, 640, 750, 828, 1080, 1200, 1920],
    // WebP only, deliberately. AVIF encodes 3 to 6 times slower for a few
    // percent more saving, and on this page the images are text screenshots
    // where that saving is smallest. Measured on the testimonial screenshots:
    // AVIF cost 1.2s to 3.1s each to encode, WebP is a fraction of that.
    formats: ['image/webp'],
  },

  /**
   * The site is now the Love Legacy Masterclass funnel. The old direct-sale
   * routes are retired but still redirect, so any link already in the wild
   * (an old ad, a WhatsApp forward, a bookmark) lands somewhere sensible
   * instead of on a 404.
   */
  async redirects() {
    return [
      { source: '/', destination: '/masterclass', permanent: true },
      { source: '/oto', destination: '/masterclass/upgrade', permanent: true },
      { source: '/checkout', destination: '/masterclass', permanent: true },
      { source: '/thank-you', destination: '/welcome', permanent: true },
      // The spec lists the thank-you pages under /masterclass; the live routes
      // are top level, so both spellings resolve.
      { source: '/masterclass/welcome', destination: '/welcome', permanent: true },
      {
        source: '/masterclass/welcome-reset',
        destination: '/welcome-reset',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
