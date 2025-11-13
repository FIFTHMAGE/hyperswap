/**
 * Analytics metrics types
 * @module types/analytics/metrics
 */

/**
 * Metric type
 */
export type MetricType =
  | 'counter'
  | 'gauge'
  | 'histogram'
  | 'timing'
  | 'set';

/**
 * Analytics metric
 */
export interface Metric {
  name: string;
  type: MetricType;
  value: number;
  tags?: Record<string, string>;
  timestamp: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
}

/**
 * User engagement metrics
 */
export interface EngagementMetrics {
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  bounceRate: number;
  conversionRate: number;
}

/**
 * Business metrics
 */
export interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  churnRate: number;
  retention: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}

