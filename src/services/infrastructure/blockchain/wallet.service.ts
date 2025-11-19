/**
 * Wallet service for wallet operations
 * @module services/blockchain/wallet
 */

import type { ChainId } from '@/types/blockchain';
import type { ConnectedWallet } from '@/types/user/wallet';

/**
 * Connect wallet (placeholder - actual implementation via WalletConnect/Wagmi)
 */
export async function connectWallet(): Promise<ConnectedWallet | null> {
  // This will be implemented with actual wallet connection logic
  // using WalletConnect v2 / Reown AppKit
  return null;
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
  // Implementation via wallet provider
}

/**
 * Switch network
 */
export async function switchNetwork(chainId: ChainId): Promise<boolean> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });

    return true;
  } catch (error: any) {
    // Chain not added, attempt to add it
    if (error.code === 4902) {
      return await addNetwork(chainId);
    }
    return false;
  }
}

/**
 * Add network to wallet
 */
export async function addNetwork(chainId: ChainId): Promise<boolean> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    const { CHAINS } = await import('@/constants/blockchain');
    const chain = CHAINS[chainId];

    if (!chain) {
      return false;
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: chain.rpcUrls,
          blockExplorerUrls: chain.blockExplorerUrls,
        },
      ],
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Sign message
 */
export async function signMessage(message: string): Promise<string | null> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, accounts[0]],
    });

    return signature;
  } catch {
    return null;
  }
}

/**
 * Get connected address
 */
export async function getConnectedAddress(): Promise<string | null> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    return accounts[0] || null;
  } catch {
    return null;
  }
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return !!window.ethereum && !!window.ethereum.selectedAddress;
}

/**
 * Watch for account changes
 */
export function watchAccountChanges(callback: (accounts: string[]) => void): () => void {
  if (typeof window === 'undefined' || !window.ethereum) {
    return () => {};
  }

  const handler = (accounts: string[]) => {
    callback(accounts);
  };

  window.ethereum.on('accountsChanged', handler);

  return () => {
    window.ethereum?.removeListener('accountsChanged', handler);
  };
}

/**
 * Watch for chain changes
 */
export function watchChainChanges(callback: (chainId: string) => void): () => void {
  if (typeof window === 'undefined' || !window.ethereum) {
    return () => {};
  }

  const handler = (chainId: string) => {
    callback(chainId);
  };

  window.ethereum.on('chainChanged', handler);

  return () => {
    window.ethereum?.removeListener('chainChanged', handler);
  };
}

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

