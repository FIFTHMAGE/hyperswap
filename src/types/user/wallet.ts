/**
 * Wallet state types
 * @module types/user/wallet
 */

import type { Address, ChainId } from '../blockchain';

/**
 * Wallet connection status
 */
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Wallet type/provider
 */
export type WalletType =
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'trust'
  | 'rainbow'
  | 'safe'
  | 'injected';

/**
 * Connected wallet
 */
export interface ConnectedWallet {
  address: Address;
  chainId: ChainId;
  type: WalletType;
  ens?: string;
  avatar?: string;
  status: WalletStatus;
  connectedAt: number;
}

/**
 * Wallet capabilities
 */
export interface WalletCapabilities {
  supportedChains: ChainId[];
  supportsSignTypedData: boolean;
  supportsEIP1559: boolean;
  supportsWatchAsset: boolean;
}

