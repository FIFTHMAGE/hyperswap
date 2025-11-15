export interface GasSuggestion {
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potentialSavings: number;
}

export function analyzeGasUsage(
  totalGasSpent: number,
  transactionCount: number,
  chainDistribution: Record<number, number>
): GasSuggestion[] {
  const suggestions: GasSuggestion[] = [];
  const avgGasPerTx = transactionCount > 0 ? totalGasSpent / transactionCount : 0;

  // High gas per transaction
  if (avgGasPerTx > 50) {
    suggestions.push({
      type: 'high',
      title: 'High Average Gas Cost',
      description: 'Consider batching transactions or using gas-efficient protocols',
      potentialSavings: avgGasPerTx * transactionCount * 0.3,
    });
  }

  // Ethereum mainnet usage
  if (chainDistribution[1] && chainDistribution[1] > transactionCount * 0.5) {
    suggestions.push({
      type: 'medium',
      title: 'Heavy Ethereum Mainnet Usage',
      description: 'Try Layer 2 solutions like Arbitrum or Optimism for cheaper transactions',
      potentialSavings: totalGasSpent * 0.9,
    });
  }

  // Many small transactions
  if (transactionCount > 50 && avgGasPerTx < 10) {
    suggestions.push({
      type: 'low',
      title: 'Many Small Transactions',
      description: 'Batch operations when possible to save on gas',
      potentialSavings: totalGasSpent * 0.2,
    });
  }

  return suggestions;
}

