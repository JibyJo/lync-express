import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'agent.lyncexpress.in',
      },
    ],
  },
};

export default nextConfig;
