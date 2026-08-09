/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  allowedDevOrigins: ["192.168.56.1"],

  turbopack: {
    root: process.cwd(),
  },

  async rewrites() {
    // BACKEND_INTERNAL_URL: internal Docker/Coolify network URL (no external DNS needed)
    // Falls back to the public URL if internal URL isn't configured
    const backendUrl = (
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://backend.tech-iitb.org/api'
    ).replace(/\/+$/, '');
    console.log('[next.config] Proxying /api/* →', backendUrl);
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
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