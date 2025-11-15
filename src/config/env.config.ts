/**
 * Environment variables configuration with validation
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

export const envConfig = {
  // App
  appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'HyperSwap'),
  appVersion: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  
  // API
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://api.hyperswap.io'),
  wsUrl: getEnvVar('NEXT_PUBLIC_WS_URL', 'wss://ws.hyperswap.io'),
  
  // Blockchain
  defaultChainId: parseInt(getEnvVar('NEXT_PUBLIC_DEFAULT_CHAIN_ID', '1')),
  infuraKey: getEnvVar('NEXT_PUBLIC_INFURA_KEY', ''),
  alchemyKey: getEnvVar('NEXT_PUBLIC_ALCHEMY_KEY', ''),
  
  // Analytics
  analyticsEnabled: getEnvVar('NEXT_PUBLIC_ANALYTICS_ENABLED', 'false') === 'true',
  
  // Features
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

export function validateEnv(): void {
  // Validate required env vars
  if (!envConfig.infuraKey && !envConfig.alchemyKey) {
    console.warn('No RPC provider key configured');
  }
}

