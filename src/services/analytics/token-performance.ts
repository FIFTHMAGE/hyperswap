export interface TokenPerformance {
  symbol: string;
  buyPrice: number;
  currentPrice: number;
  changePercent: number;
  profitLoss: number;
  isGainer: boolean;
}

export function analyzeTokenPerformance(
  tokens: { symbol: string; buyPrice: number; currentPrice: number; amount: number }[]
): { gainers: TokenPerformance[]; losers: TokenPerformance[] } {
  const performance: TokenPerformance[] = tokens.map(token => {
    const changePercent = token.buyPrice > 0 
      ? ((token.currentPrice - token.buyPrice) / token.buyPrice) * 100 
      : 0;
    const profitLoss = (token.currentPrice - token.buyPrice) * token.amount;

    return {
      symbol: token.symbol,
      buyPrice: token.buyPrice,
      currentPrice: token.currentPrice,
      changePercent,
      profitLoss,
      isGainer: changePercent > 0,
    };
  });

  const gainers = performance
    .filter(p => p.isGainer)
    .sort((a, b) => b.changePercent - a.changePercent);
  
  const losers = performance
    .filter(p => !p.isGainer)
    .sort((a, b) => a.changePercent - b.changePercent);

  return { gainers, losers };
}

