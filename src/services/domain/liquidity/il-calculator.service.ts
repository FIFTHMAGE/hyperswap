/**
 * Impermanent loss calculator service
 * @module services/liquidity/il-calculator
 */

import type { ImpermanentLoss } from '@/types/liquidity/position';

/**
 * Calculate impermanent loss
 */
export function calculateImpermanentLoss(
  initialPrice: number,
  currentPrice: number
): ImpermanentLoss {
  const priceRatio = currentPrice / initialPrice;
  
  // IL formula: 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
  const il = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
  const ilPercentage = il * 100;
  
  // Calculate HODLing value vs LP value
  const hodlValue = (1 + priceRatio) / 2;
  const lpValue = Math.sqrt(priceRatio);
  const hodlVsLP = ((hodlValue - lpValue) / lpValue) * 100;
  
  return {
    percentage: Math.abs(ilPercentage),
    value: 0, // TODO: Calculate actual value based on position size
    hodlValue: 0,
    lpValue: 0,
    difference: hodlVsLP,
  };
}

/**
 * Calculate IL for multiple price points
 */
export function calculateILCurve(
  initialPrice: number,
  pricePoints: number[]
): Array<{ price: number; il: number }> {
  return pricePoints.map(price => ({
    price,
    il: calculateImpermanentLoss(initialPrice, price).percentage,
  }));
}

/**
 * Estimate IL with fees
 */
export function estimateILWithFees(params: {
  initialPrice: number;
  currentPrice: number;
  feesEarned: number;
  positionValue: number;
}): {
  il: number;
  fees: number;
  netProfitLoss: number;
} {
  const il = calculateImpermanentLoss(params.initialPrice, params.currentPrice);
  const ilValue = (il.percentage / 100) * params.positionValue;
  const netProfitLoss = params.feesEarned - Math.abs(ilValue);
  
  return {
    il: il.percentage,
    fees: params.feesEarned,
    netProfitLoss,
  };
}

/**
 * Check if IL is high risk
 */
export function isHighRiskIL(ilPercentage: number): boolean {
  return Math.abs(ilPercentage) > 5; // > 5% IL considered high risk
}

