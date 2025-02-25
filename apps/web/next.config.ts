import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '7f315584ec7ee75055f84cffcb2908dc.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname:
          'saas-rbac.7f315584ec7ee75055f84cffcb2908dc.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
