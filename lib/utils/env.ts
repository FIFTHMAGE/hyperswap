export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  covalentApiKey: process.env.COVALENT_API_KEY || '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    gaId: process.env.NEXT_PUBLIC_GA_ID,
  },
  
  features: {
    enableSharing: process.env.NEXT_PUBLIC_ENABLE_SHARING !== 'false',
    enableLeaderboard: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === 'true',
    enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE === 'true',
  },
};

export function validateEnv() {
  const required = ['walletConnectProjectId', 'covalentApiKey'];
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  if (missing.length > 0 && env.isProduction) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

