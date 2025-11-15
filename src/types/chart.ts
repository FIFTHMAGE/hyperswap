/**
 * Chart and price data type definitions
 */

export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartConfig {
  tokenAddress: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  chartType: 'candlestick' | 'line' | 'area';
  indicators?: ChartIndicator[];
  theme?: 'light' | 'dark';
}

export interface ChartIndicator {
  type: 'MA' | 'EMA' | 'RSI' | 'MACD' | 'BB' | 'Volume';
  period?: number;
  color?: string;
  visible: boolean;
}

export interface ChartAnnotation {
  type: 'horizontal' | 'vertical' | 'trendline';
  value: number;
  label?: string;
  color?: string;
  timestamp?: number;
}

export interface TradingViewConfig {
  symbol: string;
  interval: string;
  theme: 'light' | 'dark';
  autosize: boolean;
  timezone?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  studies?: string[];
}

