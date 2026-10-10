/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  allowedDevOrigins: ["192.168.56.1"],

  turbopack: {
    root: process.cwd(),
  },

  compress: true,

  async headers() {
    const longCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
    return [
      { source: '/img/:path*', headers: longCache },
      { source: '/media/:path*', headers: longCache },
    ];
  },

  // /api/* is handled by app/api/[...slug]/route.js — no rewrites needed

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'backend.tech-iitb.org' },
      { protocol: 'https', hostname: '*.tech-iitb.org' },
      { protocol: 'https', hostname: 'files.tech-iitb.org' },
    ],
  },
};

export default nextConfig;