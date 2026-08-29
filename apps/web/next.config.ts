import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@comm-platform/api',
    '@comm-platform/coding',
    '@comm-platform/types',
    '@comm-platform/ui',
    '@comm-platform/validation',
  ],
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};

export default nextConfig;
