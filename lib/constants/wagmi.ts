import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';

export const chains = [mainnet, polygon, arbitrum, optimism, base] as const;

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const metadata = {
  name: 'Wallet Wrapped',
  description: 'Your Year in Crypto - Wrapped',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

