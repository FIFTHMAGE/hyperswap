import { DeFiProtocol, SwapActivity } from './defi';
import { TokenBalance } from './token';
import { NFTBalance } from './nft';

export interface WalletWrappedStats {
  address: string;
  year: number;
  
  // Transaction stats
  totalTransactions: number;
  transactionsByChain: Record<number, number>;
  firstTransactionDate: string;
  mostActiveChain: {
    chainId: number;
    chainName: string;
    transactionCount: number;
  };
  
  // Gas stats
  totalGasSpent: {
    eth: string;
    usd: number;
  };
  gasSpentByChain: Record<number, { eth: string; usd: number }>;
  
  // Financial stats
  totalValueSent: number;
  totalValueReceived: number;
  currentPortfolioValue: number;
  
  // Activity stats
  activeDays: number;
  activeMonths: number;
  
  // Token stats
  topTokens: TokenBalance[];
  uniqueTokensHeld: number;
  
  // NFT stats
  nftCollections: NFTBalance[];
  totalNFTsHeld: number;
  
  // DeFi stats
  defiProtocolsUsed: DeFiProtocol[];
  totalSwaps: number;
  swapActivity: SwapActivity[];
  
  // Summary
  rank?: 'Whale' | 'Active Trader' | 'HODLer' | 'DeFi Native' | 'NFT Collector' | 'Explorer';
}

