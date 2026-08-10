import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `use cache` + cacheTag/updateTag: an admin save expires the content tag, so
  // the next request renders fresh copy instead of stale cached HTML.
  cacheComponents: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
