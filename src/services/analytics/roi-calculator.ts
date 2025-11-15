export interface ROIResult {
  roi: number;
  annualizedROI: number;
  totalReturn: number;
  daysHeld: number;
}

export function calculateTokenROI(
  initialInvestment: number,
  currentValue: number,
  purchaseDate: string,
  currentDate: string = new Date().toISOString()
): ROIResult {
  const totalReturn = currentValue - initialInvestment;
  const roi = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;

  const purchaseTime = new Date(purchaseDate).getTime();
  const currentTime = new Date(currentDate).getTime();
  const daysHeld = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);

  const yearsHeld = daysHeld / 365;
  const annualizedROI = yearsHeld > 0 
    ? (Math.pow(1 + (roi / 100), 1 / yearsHeld) - 1) * 100
    : roi;

  return {
    roi,
    annualizedROI,
    totalReturn,
    daysHeld: Math.floor(daysHeld),
  };
}

export function compareROI(
  portfolioROI: number,
  benchmarkROI: number // e.g., ETH or BTC ROI
): { outperformance: number; relativePer formance: 'better' | 'worse' | 'equal' } {
  const outperformance = portfolioROI - benchmarkROI;
  
  let relativePerformance: 'better' | 'worse' | 'equal';
  if (Math.abs(outperformance) < 0.01) {
    relativePerformance = 'equal';
  } else if (outperformance > 0) {
    relativePerformance = 'better';
  } else {
    relativePerformance = 'worse';
  }

  return {
    outperformance,
    relativePerformance,
  };
}

