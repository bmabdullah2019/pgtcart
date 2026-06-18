/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Image Optimization (for future <Image> migration) ──
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.pgtcart.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
    ],
    // Increase minimum cache TTL for optimized images
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // ── Security & CDN Edge Caching Headers ──
  async headers() {
    return [
      {
        // Static assets (images, fonts, JS/CSS chunks) — cache aggressively
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Static images served from the public folder
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|eot)',
        locale: false,
        missing: [
          { type: 'header', key: 'next-router-prefetch' },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // All HTML pages — CDN edge caching with stale-while-revalidate
        source: '/((?!_next/static|api/).*)',
        locale: false,
        missing: [
          { type: 'header', key: 'next-router-prefetch' },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // ── Security: hide Next.js version from headers ──
  poweredByHeader: false,
};

export default nextConfig;
