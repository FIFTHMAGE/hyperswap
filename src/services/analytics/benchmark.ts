export interface BenchmarkData {
  name: string;
  returns: number[];
  currentValue: number;
}

export interface BenchmarkComparison {
  benchmark: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  alpha: number;
  beta: number;
  correlation: number;
}

export function compareToBenchmark(
  portfolioReturns: number[],
  benchmark: BenchmarkData
): BenchmarkComparison {
  const portfolioReturn = calculateReturn(portfolioReturns);
  const benchmarkReturn = calculateReturn(benchmark.returns);
  
  // Calculate alpha (excess return)
  const alpha = portfolioReturn - benchmarkReturn;
  
  // Calculate beta (systematic risk)
  const beta = calculateBeta(portfolioReturns, benchmark.returns);
  
  // Calculate correlation
  const correlation = calculateCorrelation(portfolioReturns, benchmark.returns);

  return {
    benchmark: benchmark.name,
    portfolioReturn,
    benchmarkReturn,
    alpha,
    beta,
    correlation,
  };
}

function calculateReturn(returns: number[]): number {
  if (returns.length === 0) return 0;
  return returns.reduce((acc, r) => acc * (1 + r), 1) - 1;
}

function calculateBeta(portfolioReturns: number[], benchmarkReturns: number[]): number {
  if (portfolioReturns.length !== benchmarkReturns.length) return 1;
  
  const n = portfolioReturns.length;
  const portfolioMean = portfolioReturns.reduce((a, b) => a + b, 0) / n;
  const benchmarkMean = benchmarkReturns.reduce((a, b) => a + b, 0) / n;
  
  let covariance = 0;
  let benchmarkVariance = 0;
  
  for (let i = 0; i < n; i++) {
    covariance += (portfolioReturns[i] - portfolioMean) * (benchmarkReturns[i] - benchmarkMean);
    benchmarkVariance += Math.pow(benchmarkReturns[i] - benchmarkMean, 2);
  }
  
  return benchmarkVariance !== 0 ? covariance / benchmarkVariance : 1;
}

function calculateCorrelation(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length || arr1.length === 0) return 0;
  
  const n = arr1.length;
  const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }
  
  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator !== 0 ? numerator / denominator : 0;
}

