import type { NextConfig } from "next";

const isProduction =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV !== 'preview';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  async headers() {
    if (!isProduction) {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow',
            },
          ],
        },
      ];
    }
    return [];
  },
  async redirects() {
    return [
      { source: '/wetherspoons-near-me', destination: '/locations', permanent: true },
      { source: '/author', destination: '/author/editorial-team', permanent: true },
    ];
  },
};

export default nextConfig;
