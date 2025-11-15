export interface RiskProfile {
  level: 'low' | 'medium' | 'high' | 'extreme';
  score: number;
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  impact: 'positive' | 'negative';
  weight: number;
}

export function assessWalletRisk(
  portfolioVolatility: number,
  concentration: number, // 0-1, higher means more concentrated
  newTokensRatio: number, // ratio of tokens < 30 days old
  avgTransactionValue: number
): RiskProfile {
  const factors: RiskFactor[] = [];
  let score = 50; // Base score

  // Volatility assessment
  if (portfolioVolatility > 0.5) {
    score += 20;
    factors.push({
      name: 'High Portfolio Volatility',
      impact: 'negative',
      weight: 0.3,
    });
  } else if (portfolioVolatility < 0.2) {
    score -= 10;
    factors.push({
      name: 'Low Portfolio Volatility',
      impact: 'positive',
      weight: 0.2,
    });
  }

  // Concentration assessment
  if (concentration > 0.7) {
    score += 15;
    factors.push({
      name: 'High Portfolio Concentration',
      impact: 'negative',
      weight: 0.25,
    });
  } else if (concentration < 0.3) {
    score -= 10;
    factors.push({
      name: 'Good Diversification',
      impact: 'positive',
      weight: 0.2,
    });
  }

  // New tokens risk
  if (newTokensRatio > 0.5) {
    score += 15;
    factors.push({
      name: 'Many Recent Tokens',
      impact: 'negative',
      weight: 0.2,
    });
  }

  // Normalize score to 0-100
  score = Math.max(0, Math.min(100, score));

  let level: RiskProfile['level'];
  if (score < 30) level = 'low';
  else if (score < 55) level = 'medium';
  else if (score < 75) level = 'high';
  else level = 'extreme';

  return {
    level,
    score,
    factors,
  };
}

