/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  allowedDevOrigins: ["192.168.56.1"],

  turbopack: {
    root: process.cwd(),
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