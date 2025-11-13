export interface PredictionResult {
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export function predictPortfolioValue(
  historicalValues: number[],
  daysAhead: number = 30
): PredictionResult {
  if (historicalValues.length < 7) {
    return {
      predicted: historicalValues[historicalValues.length - 1] || 0,
      confidence: 0,
      trend: 'stable',
    };
  }

  // Simple linear regression
  const n = historicalValues.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = historicalValues;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predicted = slope * (n + daysAhead) + intercept;
  const lastValue = historicalValues[n - 1];
  
  // Calculate confidence based on R-squared
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => {
    const yPred = slope * x[i] + intercept;
    return sum + Math.pow(yi - yPred, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  
  const trend = predicted > lastValue ? 'up' : predicted < lastValue ? 'down' : 'stable';

  return {
    predicted: Math.max(0, predicted),
    confidence: Math.max(0, Math.min(1, rSquared)),
    trend,
  };
}

