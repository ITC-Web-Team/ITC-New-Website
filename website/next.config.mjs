/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  allowedDevOrigins: ["192.168.56.1"],

  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;