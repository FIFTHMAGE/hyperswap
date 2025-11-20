/**
 * PriceChart - Token price chart component
 * @module features/charts
 */

import React, { useState, useMemo } from 'react';

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface PriceChartProps {
  data: ChartDataPoint[];
  height?: number;
  showVolume?: boolean;
  showGrid?: boolean;
  color?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d' | '1y';
  onTimeRangeChange?: (range: string) => void;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  height = 300,
  showVolume = true,
  showGrid = true,
  color = '#3b82f6',
  timeRange = '24h',
  onTimeRangeChange,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Calculate chart dimensions
  const chartHeight = showVolume ? height - 80 : height;
  const volumeHeight = 60;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  // Calculate price range
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 1, priceRange: 1 };

    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;

    // Add 5% padding to top and bottom
    const paddedMin = min - range * 0.05;
    const paddedMax = max + range * 0.05;

    return {
      minPrice: paddedMin,
      maxPrice: paddedMax,
      priceRange: paddedMax - paddedMin,
    };
  }, [data]);

  // Calculate volume range
  const { maxVolume } = useMemo(() => {
    if (!showVolume || data.length === 0) return { maxVolume: 1 };

    const volumes = data.map((d) => d.volume);
    return { maxVolume: Math.max(...volumes) };
  }, [data, showVolume]);

  // Scale functions
  const scaleX = (index: number, width: number): number => {
    const chartWidth = width - padding.left - padding.right;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const scaleY = (price: number): number => {
    const chartContentHeight = chartHeight - padding.top - padding.bottom;
    return chartHeight - padding.bottom - ((price - minPrice) / priceRange) * chartContentHeight;
  };

  const scaleVolume = (volume: number): number => {
    return (volume / maxVolume) * volumeHeight;
  };

  // Generate path for price line
  const generatePath = (width: number): string => {
    if (data.length === 0) return '';

    return data
      .map((point, index) => {
        const x = scaleX(index, width);
        const y = scaleY(point.price);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Generate area path
  const generateAreaPath = (width: number): string => {
    if (data.length === 0) return '';

    const linePath = generatePath(width);
    const firstX = scaleX(0, width);
    const lastX = scaleX(data.length - 1, width);
    const baseY = chartHeight - padding.bottom;

    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find closest data point
    const chartWidth = rect.width - padding.left - padding.right;
    const relativeX = x - padding.left;
    const index = Math.round((relativeX / chartWidth) * (data.length - 1));

    if (index >= 0 && index < data.length) {
      setHoveredPoint(data[index]);
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setMousePosition(null);
  };

  // Calculate price change
  const priceChange = useMemo(() => {
    if (data.length < 2) return { value: 0, percentage: 0, isPositive: true };

    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;

    return {
      value: change,
      percentage,
      isPositive: change >= 0,
    };
  }, [data]);

  return (
    <div className="price-chart w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">
            $
            {hoveredPoint
              ? hoveredPoint.price.toFixed(2)
              : data[data.length - 1]?.price.toFixed(2) || '0.00'}
          </div>
          <div
            className={`text-sm font-medium ${priceChange.isPositive ? 'text-green-500' : 'text-red-500'}`}
          >
            {priceChange.isPositive ? '+' : ''}
            {priceChange.percentage.toFixed(2)}%
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <svg
        width="100%"
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="grid">
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Area */}
        <path d={generateAreaPath(1000)} fill="url(#priceGradient)" />

        {/* Price line */}
        <path d={generatePath(1000)} fill="none" stroke={color} strokeWidth="2" />

        {/* Hover indicator */}
        {hoveredPoint && mousePosition && (
          <>
            <line
              x1={mousePosition.x}
              y1={padding.top}
              x2={mousePosition.x}
              y2={chartHeight - padding.bottom}
              stroke="#6b7280"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <circle cx={mousePosition.x} cy={scaleY(hoveredPoint.price)} r="4" fill={color} />
          </>
        )}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const price = maxPrice - (i / 4) * priceRange;
          const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
          return (
            <text
              key={i}
              x={padding.left - 10}
              y={y}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-500"
            >
              ${price.toFixed(2)}
            </text>
          );
        })}

        {/* Volume bars */}
        {showVolume && (
          <g transform={`translate(0, ${chartHeight})`}>
            {data.map((point, index) => {
              const x = scaleX(index, 1000);
              const barWidth = Math.max(1, (1000 - padding.left - padding.right) / data.length - 2);
              const barHeight = scaleVolume(point.volume);
              return (
                <rect
                  key={index}
                  x={x - barWidth / 2}
                  y={volumeHeight - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  opacity="0.3"
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 text-sm pointer-events-none">
          <div className="font-semibold">${hoveredPoint.price.toFixed(2)}</div>
          <div className="text-gray-500 text-xs">
            {new Date(hoveredPoint.timestamp).toLocaleString()}
          </div>
          {showVolume && (
            <div className="text-gray-500 text-xs">Vol: {formatVolume(hoveredPoint.volume)}</div>
          )}
        </div>
      )}
    </div>
  );
};

function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(2)}B`;
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toFixed(2);
}
