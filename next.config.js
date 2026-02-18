const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      { protocol: "https", hostname: "images.prismic.io" },
    ],
    // Cache transformed images for 6 months (≈ 180 days)
    minimumCacheTTL: 15552000,
    // Serve only WebP — avif doubles transforms for minimal gain on our audience
    formats: ["image/webp"],
    // Restrict generated widths to the breakpoints we actually use
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [64, 128, 256, 384, 512],
  },
};

module.exports = withNextIntl(nextConfig);
