/**
 * Volume Chart Component
 * Displays trading volume over time
 */

import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';

interface VolumeData {
  timestamp: number;
  volume: number;
  value?: number;
}

interface VolumeChartProps {
  data: VolumeData[];
  height?: number;
  showValue?: boolean;
  className?: string;
}

export function VolumeChart({
  data,
  height = 200,
  showValue = true,
  className = '',
}: VolumeChartProps) {
  const { width } = Dimensions.get('window');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        bars: [],
        maxVolume: 0,
        labels: [],
      };
    }

    const maxVolume = Math.max(...data.map((d) => d.volume));
    const barWidth = (width - 40) / data.length - 2;

    const bars = data.map((point, index) => {
      const barHeight = (point.volume / maxVolume) * height * 0.8;
      const xPos = 20 + index * (barWidth + 2);
      const yPos = height - barHeight - 20;

      return {
        x: xPos,
        y: yPos,
        width: barWidth,
        height: barHeight,
        volume: point.volume,
        value: point.value,
        timestamp: point.timestamp,
      };
    });

    // Generate time labels
    const labelCount = Math.min(5, data.length);
    const labelStep = Math.floor(data.length / labelCount);
    const labels = [];

    for (let i = 0; i < data.length; i += labelStep) {
      const date = new Date(data[i].timestamp);
      labels.push({
        x: 20 + i * (barWidth + 2),
        label: formatTimeLabel(date),
      });
    }

    return {
      bars,
      maxVolume,
      labels,
    };
  }, [data, width, height]);

  const formatVolume = (volume: number): string => {
    if (volume >= 1_000_000_000) {
      return `${(volume / 1_000_000_000).toFixed(2)}B`;
    }
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(2)}M`;
    }
    if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  const formatValue = (value: number): string => {
    return `$${formatVolume(value)}`;
  };

  if (!data || data.length === 0) {
    return (
      <View className={`flex items-center justify-center ${className}`} style={{ height }}>
        <Text className="text-gray-500">No volume data available</Text>
      </View>
    );
  }

  return (
    <View className={`relative ${className}`}>
      {/* Chart Title */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Trading Volume</Text>
        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded bg-blue-500" />
          <Text className="text-sm text-gray-600">Volume</Text>
        </View>
      </View>

      {/* Chart Container */}
      <View className="relative" style={{ height }}>
        {/* Y-axis labels */}
        <View className="absolute left-0 top-0 bottom-0 justify-between py-5">
          <Text className="text-xs text-gray-500">{formatVolume(chartData.maxVolume)}</Text>
          <Text className="text-xs text-gray-500">{formatVolume(chartData.maxVolume * 0.5)}</Text>
          <Text className="text-xs text-gray-500">0</Text>
        </View>

        {/* Chart Area */}
        <View className="ml-8 flex-1">
          {/* Grid lines */}
          <View className="absolute inset-0">
            {[0, 0.25, 0.5, 0.75, 1].map((percent) => (
              <View
                key={percent}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${percent * 100}%` }}
              />
            ))}
          </View>

          {/* Volume bars */}
          <View className="absolute inset-0">
            {chartData.bars.map((bar, index) => (
              <View
                key={index}
                className="absolute rounded-t bg-blue-500 opacity-80"
                style={{
                  left: bar.x,
                  top: bar.y,
                  width: bar.width,
                  height: bar.height,
                }}
              />
            ))}
          </View>
        </View>

        {/* X-axis labels */}
        <View className="absolute bottom-0 left-8 right-0 flex-row justify-between pt-2">
          {chartData.labels.map((label, index) => (
            <Text key={index} className="text-xs text-gray-500">
              {label.label}
            </Text>
          ))}
        </View>
      </View>

      {/* Summary Stats */}
      {showValue && (
        <View className="mt-4 flex-row justify-around rounded-lg bg-gray-50 p-3">
          <View>
            <Text className="text-xs text-gray-500">Total Volume</Text>
            <Text className="text-lg font-semibold">
              {formatVolume(data.reduce((sum, d) => sum + d.volume, 0))}
            </Text>
          </View>
          {data[0]?.value !== undefined && (
            <View>
              <Text className="text-xs text-gray-500">Total Value</Text>
              <Text className="text-lg font-semibold">
                {formatValue(data.reduce((sum, d) => sum + (d.value || 0), 0))}
              </Text>
            </View>
          )}
          <View>
            <Text className="text-xs text-gray-500">Avg Volume</Text>
            <Text className="text-lg font-semibold">
              {formatVolume(data.reduce((sum, d) => sum + d.volume, 0) / data.length)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function formatTimeLabel(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffHours < 168) {
    // Less than 7 days
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
