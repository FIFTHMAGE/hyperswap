/**
 * Portfolio valuation service
 * @module services/portfolio/valuation
 */

import type { PortfolioBalance } from '@/types/portfolio/balance';

/**
 * Calculate total portfolio value
 */
export function calculateTotalValue(portfolio: PortfolioBalance): number {
  return portfolio.chains.reduce((sum, chain) => sum + chain.totalValueUSD, 0);
}

/**
 * Calculate 24h change
 */
export async function calculate24hChange(
  currentValue: number,
  _address: string
): Promise<{ change: number; percentage: number }> {
  // TODO: Fetch historical value from 24h ago
  const previousValue = currentValue; // Placeholder
  const change = currentValue - previousValue;
  const percentage = previousValue > 0 ? (change / previousValue) * 100 : 0;
  
  return { change, percentage };
}

/**
 * Calculate portfolio diversity score
 */
export function calculateDiversityScore(portfolio: PortfolioBalance): number {
  const tokens = portfolio.chains.flatMap(chain => chain.tokens);
  const totalValue = portfolio.totalValueUSD;
  
  if (tokens.length === 0) return 0;
  
  // Calculate Herfindahl index
  const herfindahl = tokens.reduce((sum, token) => {
    const share = (token.balanceUSD || 0) / totalValue;
    return sum + share * share;
  }, 0);
  
  // Normalize to 0-100 scale (inverse of Herfindahl)
  return (1 - herfindahl) * 100;
}

/**
 * Get portfolio risk level
 */
export function getPortfolioRisk(portfolio: PortfolioBalance): 'low' | 'medium' | 'high' {
  const diversityScore = calculateDiversityScore(portfolio);
  
  if (diversityScore > 70) return 'low';
  if (diversityScore > 40) return 'medium';
  return 'high';
}

/**
 * Calculate chain dominance
 */
export function calculateChainDominance(portfolio: PortfolioBalance) {
  return portfolio.chains.map(chain => ({
    chainId: chain.chainId,
    dominance: (chain.totalValueUSD / portfolio.totalValueUSD) * 100,
  })).sort((a, b) => b.dominance - a.dominance);
}

