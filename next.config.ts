import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `use cache` + cacheTag/updateTag: an admin save expires the content tag, so
  // the next request renders fresh copy instead of stale cached HTML.
  cacheComponents: true,

  // Firebase Admin's authentication dependency chain includes ESM-only code.
  // Bundle it into the server output instead of leaving it as a Node external,
  // which avoids Vercel attempting a CommonJS require at runtime.
  transpilePackages: ['firebase-admin'],

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
