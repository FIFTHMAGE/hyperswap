'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PriceData, ChartConfig } from '@/lib/types/chart';

interface Props {
  config: ChartConfig;
  data?: PriceData[];
  height?: number;
}

export function PriceChart({ config, data = [], height = 400 }: Props) {
  const [priceData, setPriceData] = useState<PriceData[]>(data);
  const [selectedTimeframe, setSelectedTimeframe] = useState(config.timeframe);
  const [chartType, setChartType] = useState(config.chartType);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0) {
      setPriceData(data);
    } else {
      // Fetch price data if not provided
      fetchPriceData();
    }
  }, [config.tokenAddress, selectedTimeframe]);

  const fetchPriceData = async () => {
    // Mock data generation for demonstration
    const mockData: PriceData[] = Array.from({ length: 100 }, (_, i) => {
      const timestamp = Date.now() - (100 - i) * 60000;
      const basePrice = 100 + Math.random() * 50;
      return {
        timestamp,
        open: basePrice,
        high: basePrice + Math.random() * 5,
        low: basePrice - Math.random() * 5,
        close: basePrice + (Math.random() - 0.5) * 3,
        volume: Math.random() * 1000000,
      };
    });
    setPriceData(mockData);
  };

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'] as const;
  const chartTypes = ['candlestick', 'line', 'area'] as const;

  const renderCandlestick = () => {
    if (priceData.length === 0) return null;

    const maxPrice = Math.max(...priceData.map((d) => d.high));
    const minPrice = Math.min(...priceData.map((d) => d.low));
    const priceRange = maxPrice - minPrice;

    return (
      <div className="flex items-end justify-between gap-1 h-full">
        {priceData.map((candle, index) => {
          const isGreen = candle.close >= candle.open;
          const bodyTop = Math.max(candle.open, candle.close);
          const bodyBottom = Math.min(candle.open, candle.close);
          const bodyHeight = bodyTop - bodyBottom;

          const topPosition = ((maxPrice - candle.high) / priceRange) * 100;
          const bottomPosition = ((candle.low - minPrice) / priceRange) * 100;
          const bodyTopPosition = ((maxPrice - bodyTop) / priceRange) * 100;
          const bodyHeightPercent = (bodyHeight / priceRange) * 100;

          return (
            <div
              key={index}
              className="relative flex-1 group"
              style={{ height: '100%' }}
            >
              {/* Wick */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-px ${
                  isGreen ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  top: `${topPosition}%`,
                  bottom: `${bottomPosition}%`,
                }}
              />
              {/* Body */}
              <div
                className={`absolute left-0 right-0 ${
                  isGreen ? 'bg-green-500' : 'bg-red-500'
                } hover:opacity-80 transition-opacity`}
                style={{
                  top: `${bodyTopPosition}%`,
                  height: `${Math.max(bodyHeightPercent, 0.5)}%`,
                }}
              />
              {/* Tooltip */}
              <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                <div>O: ${candle.open.toFixed(2)}</div>
                <div>H: ${candle.high.toFixed(2)}</div>
                <div>L: ${candle.low.toFixed(2)}</div>
                <div>C: ${candle.close.toFixed(2)}</div>
                <div>V: ${candle.volume.toFixed(0)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => {
    if (priceData.length === 0) return null;

    const maxPrice = Math.max(...priceData.map((d) => d.close));
    const minPrice = Math.min(...priceData.map((d) => d.close));
    const priceRange = maxPrice - minPrice;

    const points = priceData
      .map((d, i) => {
        const x = (i / (priceData.length - 1)) * 100;
        const y = ((maxPrice - d.close) / priceRange) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-full">
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {priceData.map((d, i) => {
          const x = (i / (priceData.length - 1)) * 100;
          const y = ((maxPrice - d.close) / priceRange) * 100;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="3"
              fill="#3b82f6"
              className="hover:r-5 transition-all"
            />
          );
        })}
      </svg>
    );
  };

  const renderAreaChart = () => {
    if (priceData.length === 0) return null;

    const maxPrice = Math.max(...priceData.map((d) => d.close));
    const minPrice = Math.min(...priceData.map((d) => d.close));
    const priceRange = maxPrice - minPrice;

    const points = priceData
      .map((d, i) => {
        const x = (i / (priceData.length - 1)) * 100;
        const y = ((maxPrice - d.close) / priceRange) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradient)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold capitalize transition-colors ${
                chartType === type
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} style={{ height: `${height}px` }} className="relative">
        {priceData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {chartType === 'candlestick' && renderCandlestick()}
            {chartType === 'line' && renderLineChart()}
            {chartType === 'area' && renderAreaChart()}
          </>
        )}
      </div>

      {/* Price Info */}
      {priceData.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Current: </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${priceData[priceData.length - 1].close.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">24h Change: </span>
              <span
                className={`font-semibold ${
                  priceData[priceData.length - 1].close >= priceData[0].open
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {(
                  ((priceData[priceData.length - 1].close - priceData[0].open) /
                    priceData[0].open) *
                  100
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

