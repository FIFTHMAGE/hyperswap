import { WalletWrappedStats } from '../types/wrapped';

export function determineWalletRank(stats: WalletWrappedStats): WalletWrappedStats['rank'] {
  // Whale: High portfolio value
  if (stats.currentPortfolioValue > 100000) {
    return 'Whale';
  }
  
  // Active Trader: Many transactions
  if (stats.totalTransactions > 500) {
    return 'Active Trader';
  }
  
  // DeFi Native: Uses many DeFi protocols
  if (stats.defiProtocolsUsed.length > 5) {
    return 'DeFi Native';
  }
  
  // NFT Collector: Holds many NFTs
  if (stats.totalNFTsHeld > 10) {
    return 'NFT Collector';
  }
  
  // HODLer: Long-term holder, few transactions
  if (stats.activeDays > 180 && stats.totalTransactions < 100) {
    return 'HODLer';
  }
  
  // Explorer: Default
  return 'Explorer';
}

