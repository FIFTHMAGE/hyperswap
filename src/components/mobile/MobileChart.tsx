/**
 * Mobile Chart Component
 * Touch-optimized charts for mobile devices
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface MobileChartProps {
  data: ChartDataPoint[];
  timeframe: '1H' | '24H' | '7D' | '30D' | '1Y' | 'ALL';
  onTimeframeChange?: (timeframe: string) => void;
  showGrid?: boolean;
  color?: string;
  height?: number;
}

export function MobileChart({
  data,
  timeframe,
  onTimeframeChange,
  showGrid = true,
  color = '#3b82f6',
  height = 200,
}: MobileChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [touchPoint, setTouchPoint] = useState<{ x: number; dataPoint: ChartDataPoint } | null>(null);

  const timeframes = ['1H', '24H', '7D', '30D', '1Y', 'ALL'];

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate bounds
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    const padding = 20;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(rect.width - padding, y);
        ctx.stroke();
      }
    }

    // Draw area fill
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(rect.width - padding, rect.height - padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw touch point
    if (touchPoint) {
      const x = touchPoint.x;
      const y = padding + chartHeight - ((touchPoint.dataPoint.value - minValue) / valueRange) * chartHeight;

      // Vertical line
      ctx.strokeStyle = `${color}80`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, rect.height - padding);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [data, showGrid, color, touchPoint]);

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;

    const padding = 20;
    const chartWidth = rect.width - padding * 2;
    const index = Math.round(((x - padding) / chartWidth) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

    setTouchPoint({
      x: padding + (chartWidth / (data.length - 1)) * clampedIndex,
      dataPoint: data[clampedIndex],
    });
  };

  const handleTouchEnd = () => {
    setTouchPoint(null);
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentValue = touchPoint?.dataPoint.value || data[data.length - 1]?.value || 0;
  const firstValue = data[0]?.value || 0;
  const change = currentValue - firstValue;
  const changePercent = (change / firstValue) * 100;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-3xl font-bold">{formatValue(currentValue)}</div>
            <div className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {formatValue(Math.abs(change))} ({changePercent.toFixed(2)}%)
            </div>
          </div>
          {touchPoint && (
            <div className="text-right text-sm text-gray-500">
              {formatDate(touchPoint.dataPoint.timestamp)}
            </div>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange?.(tf)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }
              `}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${height}px` }}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
          className="touch-none"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-1">High</div>
          <div className="font-semibold">{formatValue(Math.max(...data.map(d => d.value)))}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Low</div>
          <div className="font-semibold">{formatValue(Math.min(...data.map(d => d.value)))}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simplified Mini Chart
 */
interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniChart({ data, color = '#3b82f6', height = 40 }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue;

    ctx.beginPath();
    data.forEach((value, index) => {
      const x = (rect.width / (data.length - 1)) * index;
      const y = rect.height - ((value - minValue) / valueRange) * rect.height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px` }}
      className="block"
    />
  );
}

