/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /**
     * WebP only, deliberately. AVIF encodes 5–10× slower on the server, and with
     * ~30 remote photos on the homepage that turns a first visit (or any dev
     * reload) into a long wait while the optimizer chews through them. WebP is
     * within a few percent on size for soft photography like this.
     */
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384, 512],
    /** Optimised variants are cached for 30 days instead of being re-encoded. */
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
