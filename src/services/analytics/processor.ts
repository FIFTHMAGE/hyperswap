import { WalletWrappedStats } from '../types/wrapped';
import { Transaction } from '../types/transaction';
import { TokenBalance } from '../types/token';
import { NFTBalance } from '../types/nft';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { getActiveDays, getActiveMonths } from '../utils/date';
import { findMostCommon, sumValues } from '../utils/calculations';

export function processWalletData(
  address: string,
  transactions: Record<number, Transaction[]>,
  balances: Record<number, TokenBalance[]>,
  nfts: Record<number, NFTBalance[]>
): WalletWrappedStats {
  const year = new Date().getFullYear();
  
  // Calculate transaction stats
  const transactionsByChain: Record<number, number> = {};
  const allTransactions: Transaction[] = [];
  
  Object.entries(transactions).forEach(([chainId, txs]) => {
    const chainIdNum = Number(chainId);
    transactionsByChain[chainIdNum] = txs.length;
    allTransactions.push(...txs);
  });
  
  const totalTransactions = allTransactions.length;
  
  // Find most active chain
  const mostActiveChainId = findMostCommon(
    allTransactions.map(tx => tx.chainId)
  ) || 1;
  
  const mostActiveChain = {
    chainId: mostActiveChainId,
    chainName: SUPPORTED_CHAINS[mostActiveChainId as keyof typeof SUPPORTED_CHAINS]?.name || 'Unknown',
    transactionCount: transactionsByChain[mostActiveChainId] || 0,
  };
  
  // Calculate gas spent
  const gasSpentByChain: Record<number, { eth: string; usd: number }> = {};
  let totalGasUsd = 0;
  let totalGasEth = 0;
  
  Object.entries(transactions).forEach(([chainId, txs]) => {
    const chainIdNum = Number(chainId);
    const gasSpent = txs.reduce((sum, tx) => {
      return sum + parseFloat(tx.gasSpent || '0');
    }, 0);
    
    gasSpentByChain[chainIdNum] = {
      eth: gasSpent.toFixed(6),
      usd: gasSpent * 2000, // Approximate conversion
    };
    
    totalGasEth += gasSpent;
    totalGasUsd += gasSpent * 2000;
  });
  
  const totalGasSpent = {
    eth: totalGasEth.toFixed(6),
    usd: totalGasUsd,
  };
  
  // Calculate activity stats
  const dates = allTransactions.map(tx => tx.blockSignedAt);
  const activeDaysCount = getActiveDays(dates);
  const activeMonthsCount = getActiveMonths(dates);
  
  // Get first transaction
  const sortedTxs = allTransactions.sort((a, b) => 
    new Date(a.blockSignedAt).getTime() - new Date(b.blockSignedAt).getTime()
  );
  const firstTransactionDate = sortedTxs[0]?.blockSignedAt || new Date().toISOString();
  
  // Process tokens
  const allTokens = Object.values(balances).flat();
  const topTokens = allTokens
    .sort((a, b) => b.quote - a.quote)
    .slice(0, 10);
  
  const currentPortfolioValue = sumValues(allTokens.map(t => t.quote));
  
  // Process NFTs
  const allNFTs = Object.values(nfts).flat();
  
  return {
    address,
    year,
    totalTransactions,
    transactionsByChain,
    firstTransactionDate,
    mostActiveChain,
    totalGasSpent,
    gasSpentByChain,
    totalValueSent: 0, // Would need more detailed transaction analysis
    totalValueReceived: 0,
    currentPortfolioValue,
    activeDays: activeDaysCount,
    activeMonths: activeMonthsCount,
    topTokens,
    uniqueTokensHeld: allTokens.length,
    nftCollections: allNFTs,
    totalNFTsHeld: allNFTs.length,
    defiProtocolsUsed: [], // Would need DeFi-specific analysis
    totalSwaps: 0,
    swapActivity: [],
  };
}

