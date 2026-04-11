/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode — catches double-render bugs early
  reactStrictMode: true,

  // Silence Supabase realtime websocket warnings in dev
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig;
