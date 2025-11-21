/**
 * Application configuration
 * @module config
 */

export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  chains: {
    defaultChainId: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || '1', 10),
    supportedChains: process.env.NEXT_PUBLIC_SUPPORTED_CHAINS?.split(',').map(Number) || [
      1, 137, 56, 42161, 10,
    ],
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  },
  infura: {
    projectId: process.env.NEXT_PUBLIC_INFURA_ID || '',
  },
  logging: {
    level: process.env.NEXT_PUBLIC_LOG_LEVEL || 'INFO',
  },
};
