export interface WalletHealthScore {
  overall: number;
  diversification: number;
  activity: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export function calculateWalletHealth(
  uniqueTokens: number,
  uniqueChains: number,
  transactionCount: number,
  daysSinceFirstTx: number
): WalletHealthScore {
  // Calculate diversification score (0-100)
  const diversificationScore = Math.min(
    (uniqueTokens * 5) + (uniqueChains * 15),
    100
  );

  // Calculate activity score (0-100)
  const avgTxPerDay = daysSinceFirstTx > 0 ? transactionCount / daysSinceFirstTx : 0;
  const activityScore = Math.min(avgTxPerDay * 50, 100);

  // Overall health score
  const overallScore = (diversificationScore * 0.6) + (activityScore * 0.4);

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (uniqueTokens < 3 || uniqueChains < 2) {
    riskLevel = 'high';
  } else if (uniqueTokens < 5 || uniqueChains < 3) {
    riskLevel = 'medium';
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (uniqueChains < 3) {
    recommendations.push('Consider diversifying across more blockchain networks');
  }
  if (uniqueTokens < 5) {
    recommendations.push('Expand your token portfolio for better diversification');
  }
  if (avgTxPerDay < 0.1) {
    recommendations.push('Increase your on-chain activity to gain more experience');
  }

  return {
    overall: Math.round(overallScore),
    diversification: Math.round(diversificationScore),
    activity: Math.round(activityScore),
    riskLevel,
    recommendations,
  };
}

