/**
 * WalletConnector - Wallet connection management
 * @module features/wallet
 */

export enum WalletType {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletconnect',
  COINBASE = 'coinbase',
  INJECTED = 'injected',
}

export interface WalletInfo {
  type: WalletType;
  address: string;
  chainId: number;
  ensName?: string;
  balance?: string;
}

export interface ConnectOptions {
  chainId?: number;
  rpcUrl?: string;
}

export class WalletConnector {
  private wallet: WalletInfo | null = null;
  private listeners: Set<(wallet: WalletInfo | null) => void> = new Set();

  /**
   * Connect wallet
   */
  async connect(walletType: WalletType, options?: ConnectOptions): Promise<WalletInfo> {
    switch (walletType) {
      case WalletType.METAMASK:
        return this.connectMetaMask(options);
      case WalletType.WALLET_CONNECT:
        return this.connectWalletConnect(options);
      case WalletType.COINBASE:
        return this.connectCoinbase(options);
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    this.wallet = null;
    this.notifyListeners();
  }

  /**
   * Get current wallet
   */
  getWallet(): WalletInfo | null {
    return this.wallet;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.wallet !== null;
  }

  /**
   * Subscribe to wallet changes
   */
  subscribe(listener: (wallet: WalletInfo | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Connect MetaMask
   */
  private async connectMetaMask(_options?: ConnectOptions): Promise<WalletInfo> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    this.wallet = {
      type: WalletType.METAMASK,
      address: accounts[0],
      chainId: parseInt(chainId, 16),
    };

    this.setupMetaMaskListeners();
    this.notifyListeners();

    return this.wallet;
  }

  /**
   * Connect WalletConnect
   */
  private async connectWalletConnect(_options?: ConnectOptions): Promise<WalletInfo> {
    // Mock implementation
    throw new Error('WalletConnect not implemented');
  }

  /**
   * Connect Coinbase Wallet
   */
  private async connectCoinbase(_options?: ConnectOptions): Promise<WalletInfo> {
    // Mock implementation
    throw new Error('Coinbase Wallet not implemented');
  }

  /**
   * Setup MetaMask event listeners
   */
  private setupMetaMaskListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else if (this.wallet) {
        this.wallet.address = accounts[0];
        this.notifyListeners();
      }
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      if (this.wallet) {
        this.wallet.chainId = parseInt(chainId, 16);
        this.notifyListeners();
      }
    });
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.wallet));
  }
}

export const walletConnector = new WalletConnector();

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
