/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle canvas module for Konva.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      'canvas-prebuilt': false,
    };
    
    // Exclude canvas from client-side bundle
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push('canvas');
    }
    
    return config;
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
