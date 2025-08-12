/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle canvas module for Konva.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        'canvas-prebuilt': false,
      };
    }
    
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  // Disable ESLint during build for Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build for Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
