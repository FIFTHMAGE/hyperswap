/**
 * Real-time Data Processor
 * Utilities for processing and transforming real-time data streams
 */

export interface DataPoint {
  timestamp: number;
  value: number;
}

export interface StreamData {
  id: string;
  data: DataPoint[];
  metadata?: Record<string, any>;
}

/**
 * Calculate moving average from data points
 */
export function calculateMovingAverage(
  dataPoints: DataPoint[],
  windowSize: number
): DataPoint[] {
  if (dataPoints.length < windowSize) {
    return dataPoints;
  }

  const result: DataPoint[] = [];
  
  for (let i = windowSize - 1; i < dataPoints.length; i++) {
    const window = dataPoints.slice(i - windowSize + 1, i + 1);
    const sum = window.reduce((acc, point) => acc + point.value, 0);
    const average = sum / windowSize;
    
    result.push({
      timestamp: dataPoints[i].timestamp,
      value: average,
    });
  }
  
  return result;
}

/**
 * Detect trend in data points
 */
export function detectTrend(
  dataPoints: DataPoint[],
  sensitivity: number = 0.05
): 'up' | 'down' | 'neutral' {
  if (dataPoints.length < 2) return 'neutral';

  const first = dataPoints[0].value;
  const last = dataPoints[dataPoints.length - 1].value;
  const change = (last - first) / first;

  if (change > sensitivity) return 'up';
  if (change < -sensitivity) return 'down';
  return 'neutral';
}

/**
 * Calculate volatility (standard deviation)
 */
export function calculateVolatility(dataPoints: DataPoint[]): number {
  if (dataPoints.length < 2) return 0;

  const values = dataPoints.map(p => p.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Normalize data points to 0-1 range
 */
export function normalizeData(dataPoints: DataPoint[]): DataPoint[] {
  if (dataPoints.length === 0) return [];

  const values = dataPoints.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return dataPoints.map(p => ({ ...p, value: 0.5 }));
  }

  return dataPoints.map(p => ({
    ...p,
    value: (p.value - min) / range,
  }));
}

/**
 * Smooth data using exponential moving average
 */
export function exponentialMovingAverage(
  dataPoints: DataPoint[],
  alpha: number = 0.3
): DataPoint[] {
  if (dataPoints.length === 0) return [];

  const result: DataPoint[] = [dataPoints[0]];
  
  for (let i = 1; i < dataPoints.length; i++) {
    const smoothedValue = alpha * dataPoints[i].value + (1 - alpha) * result[i - 1].value;
    result.push({
      timestamp: dataPoints[i].timestamp,
      value: smoothedValue,
    });
  }
  
  return result;
}

/**
 * Detect anomalies using z-score
 */
export function detectAnomalies(
  dataPoints: DataPoint[],
  threshold: number = 3
): { point: DataPoint; zScore: number }[] {
  if (dataPoints.length < 3) return [];

  const values = dataPoints.map(p => p.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
  );

  const anomalies: { point: DataPoint; zScore: number }[] = [];

  dataPoints.forEach(point => {
    const zScore = Math.abs((point.value - mean) / stdDev);
    if (zScore > threshold) {
      anomalies.push({ point, zScore });
    }
  });

  return anomalies;
}

/**
 * Calculate rate of change
 */
export function calculateRateOfChange(
  dataPoints: DataPoint[],
  periods: number = 1
): DataPoint[] {
  if (dataPoints.length <= periods) return [];

  const result: DataPoint[] = [];

  for (let i = periods; i < dataPoints.length; i++) {
    const currentValue = dataPoints[i].value;
    const previousValue = dataPoints[i - periods].value;
    const roc = ((currentValue - previousValue) / previousValue) * 100;

    result.push({
      timestamp: dataPoints[i].timestamp,
      value: roc,
    });
  }

  return result;
}

/**
 * Downsample data points to reduce size
 */
export function downsampleData(
  dataPoints: DataPoint[],
  targetSize: number
): DataPoint[] {
  if (dataPoints.length <= targetSize) return dataPoints;

  const result: DataPoint[] = [];
  const step = dataPoints.length / targetSize;

  for (let i = 0; i < targetSize; i++) {
    const index = Math.floor(i * step);
    result.push(dataPoints[index]);
  }

  return result;
}

/**
 * Interpolate missing data points
 */
export function interpolateData(
  dataPoints: DataPoint[],
  targetInterval: number
): DataPoint[] {
  if (dataPoints.length < 2) return dataPoints;

  const result: DataPoint[] = [dataPoints[0]];
  
  for (let i = 1; i < dataPoints.length; i++) {
    const prev = dataPoints[i - 1];
    const current = dataPoints[i];
    const timeDiff = current.timestamp - prev.timestamp;
    const steps = Math.floor(timeDiff / targetInterval);

    // Add interpolated points
    for (let j = 1; j < steps; j++) {
      const ratio = j / steps;
      result.push({
        timestamp: prev.timestamp + targetInterval * j,
        value: prev.value + (current.value - prev.value) * ratio,
      });
    }

    result.push(current);
  }

  return result;
}

/**
 * Calculate correlation between two data series
 */
export function calculateCorrelation(
  series1: DataPoint[],
  series2: DataPoint[]
): number {
  const minLength = Math.min(series1.length, series2.length);
  if (minLength < 2) return 0;

  const values1 = series1.slice(0, minLength).map(p => p.value);
  const values2 = series2.slice(0, minLength).map(p => p.value);

  const mean1 = values1.reduce((a, b) => a + b, 0) / minLength;
  const mean2 = values2.reduce((a, b) => a + b, 0) / minLength;

  let numerator = 0;
  let sum1Squared = 0;
  let sum2Squared = 0;

  for (let i = 0; i < minLength; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    numerator += diff1 * diff2;
    sum1Squared += diff1 * diff1;
    sum2Squared += diff2 * diff2;
  }

  const denominator = Math.sqrt(sum1Squared * sum2Squared);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Find local extrema (peaks and valleys)
 */
export function findExtrema(
  dataPoints: DataPoint[],
  windowSize: number = 3
): { peaks: DataPoint[]; valleys: DataPoint[] } {
  if (dataPoints.length < windowSize * 2 + 1) {
    return { peaks: [], valleys: [] };
  }

  const peaks: DataPoint[] = [];
  const valleys: DataPoint[] = [];

  for (let i = windowSize; i < dataPoints.length - windowSize; i++) {
    const window = dataPoints.slice(i - windowSize, i + windowSize + 1);
    const center = dataPoints[i];
    
    const isPeak = window.every(p => p === center || p.value <= center.value);
    const isValley = window.every(p => p === center || p.value >= center.value);

    if (isPeak) peaks.push(center);
    if (isValley) valleys.push(center);
  }

  return { peaks, valleys };
}

/**
 * Aggregate data by time buckets
 */
export function aggregateByTimeBuckets(
  dataPoints: DataPoint[],
  bucketSizeMs: number,
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'last' = 'avg'
): DataPoint[] {
  if (dataPoints.length === 0) return [];

  const buckets = new Map<number, number[]>();
  
  // Group data into buckets
  dataPoints.forEach(point => {
    const bucketKey = Math.floor(point.timestamp / bucketSizeMs) * bucketSizeMs;
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, []);
    }
    buckets.get(bucketKey)!.push(point.value);
  });

  // Aggregate each bucket
  const result: DataPoint[] = [];
  buckets.forEach((values, timestamp) => {
    let aggregatedValue: number;

    switch (aggregation) {
      case 'sum':
        aggregatedValue = values.reduce((a, b) => a + b, 0);
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'last':
        aggregatedValue = values[values.length - 1];
        break;
      case 'avg':
      default:
        aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
    }

    result.push({ timestamp, value: aggregatedValue });
  });

  return result.sort((a, b) => a.timestamp - b.timestamp);
}

