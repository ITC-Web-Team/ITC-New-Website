/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  allowedDevOrigins: ["192.168.56.1"],

  turbopack: {
    root: process.cwd(),
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://backend.tech-iitb.org/api';
    const cleanUrl = backendUrl.replace(/\/+$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${cleanUrl}/:path*`,
      },
    ];
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'backend.tech-iitb.org' },
      { protocol: 'https', hostname: '*.tech-iitb.org' },
    ],
  },
};

export default nextConfig;