/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions expects an object in Next 15; keep minimal config
    serverActions: { allowedOrigins: ['*'] }
  }
};

module.exports = nextConfig;
