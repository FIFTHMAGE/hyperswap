'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { chains, projectId, metadata } from '@/lib/constants/wagmi';

// Create query client
const queryClient = new QueryClient();

// Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  chains: chains as any,
  projectId,
});

// Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: chains as any,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

