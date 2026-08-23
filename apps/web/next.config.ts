import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@comm-platform/api',
    '@comm-platform/types',
    '@comm-platform/ui',
    '@comm-platform/validation',
  ],
};

export default nextConfig;
