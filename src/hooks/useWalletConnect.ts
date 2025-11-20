/**
 * useWalletConnect - React hook for wallet connection
 * @module hooks
 */

import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';

import { walletConnector, WalletType, WalletInfo } from '../features/wallet/WalletConnector';
import { Logger } from '../utils/logger';

const logger = new Logger('useWalletConnect');

export function useWalletConnect() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Subscribe to wallet changes
  useEffect(() => {
    const unsubscribe = walletConnector.subscribe((newWallet) => {
      setWallet(newWallet);

      if (newWallet && window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethersProvider);

        ethersProvider
          .getSigner()
          .then((ethSigner) => {
            setSigner(ethSigner);
          })
          .catch((err) => {
            logger.error('Failed to get signer:', err);
          });
      } else {
        setProvider(null);
        setSigner(null);
      }
    });

    return unsubscribe;
  }, []);

  const connect = useCallback(async (walletType: WalletType = WalletType.METAMASK) => {
    setIsConnecting(true);
    setError(null);

    try {
      const connectedWallet = await walletConnector.connect(walletType);
      logger.info('Wallet connected:', connectedWallet.address);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      logger.error('Wallet connection failed:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await walletConnector.disconnect();
      logger.info('Wallet disconnected');
    } catch (err: any) {
      logger.error('Wallet disconnection failed:', err);
      throw err;
    }
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    if (!window.ethereum) {
      throw new Error('No wallet provider found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      logger.info('Switched to chain:', chainId);
    } catch (err: any) {
      logger.error('Failed to switch chain:', err);
      throw err;
    }
  }, []);

  const addToken = useCallback(async (tokenAddress: string, symbol: string, decimals: number) => {
    if (!window.ethereum) {
      throw new Error('No wallet provider found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol,
            decimals,
          },
        },
      });
      logger.info('Token added:', symbol);
    } catch (err: any) {
      logger.error('Failed to add token:', err);
      throw err;
    }
  }, []);

  return {
    wallet,
    address: wallet?.address,
    chainId: wallet?.chainId,
    isConnected: wallet !== null,
    isConnecting,
    error,
    provider,
    signer,
    connect,
    disconnect,
    switchChain,
    addToken,
  };
}
