/**
 * Performance-optimized Next.js configuration additions
 */

export const performanceConfig = {
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/utils', '@/hooks', '@/services'],
    turbo: {
      resolveAlias: {
        '@': './src',
      },
    },
  },

  // Image optimization
  images: {
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },

  // Production source maps
  productionBrowserSourceMaps: false,

  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    // Tree shaking
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  },
};



