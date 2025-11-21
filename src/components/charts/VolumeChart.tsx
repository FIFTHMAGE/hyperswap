/**
 * Volume Chart Component
 * Displays trading volume over time with bar chart
 */

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

interface VolumeData {
  timestamp: number;
  volume: string;
  date?: string;
}

interface VolumeChartProps {
  data: VolumeData[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  barColor?: string;
  className?: string;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  height = 200,
  showGrid = true,
  showLabels = true,
  barColor = '#3B82F6',
  className = '',
}) => {
  const { maxVolume, normalizedData } = useMemo(() => {
    if (data.length === 0) {
      return { maxVolume: 0, normalizedData: [] };
    }

    const volumes = data.map((d) => parseFloat(d.volume));
    const max = Math.max(...volumes);

    const normalized = data.map((d, index) => ({
      ...d,
      normalizedHeight: (parseFloat(d.volume) / max) * 100,
      index,
    }));

    return { maxVolume: max, normalizedData: normalized };
  }, [data]);

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (data.length === 0) {
    return (
      <View className={`rounded-lg bg-gray-800 p-6 ${className}`}>
        <Text className="text-center text-gray-400">No volume data available</Text>
      </View>
    );
  }

  return (
    <View className={`rounded-lg bg-gray-800 p-4 ${className}`}>
      {/* Title */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-white">Trading Volume</Text>
        <Text className="text-sm text-gray-400">
          Total: {formatVolume(data.reduce((sum, d) => sum + parseFloat(d.volume), 0))}
        </Text>
      </View>

      {/* Chart Container */}
      <View className="relative" style={{ height }}>
        {/* Y-axis labels */}
        {showLabels && (
          <View className="absolute left-0 top-0 bottom-0 justify-between py-2">
            <Text className="text-xs text-gray-400">{formatVolume(maxVolume)}</Text>
            <Text className="text-xs text-gray-400">{formatVolume(maxVolume * 0.75)}</Text>
            <Text className="text-xs text-gray-400">{formatVolume(maxVolume * 0.5)}</Text>
            <Text className="text-xs text-gray-400">{formatVolume(maxVolume * 0.25)}</Text>
            <Text className="text-xs text-gray-400">$0</Text>
          </View>
        )}

        {/* Grid lines */}
        {showGrid && (
          <View className="absolute inset-0 ml-12">
            <View className="absolute top-0 left-0 right-0 border-t border-gray-700" />
            <View
              className="absolute left-0 right-0 border-t border-gray-700"
              style={{ top: '25%' }}
            />
            <View
              className="absolute left-0 right-0 border-t border-gray-700"
              style={{ top: '50%' }}
            />
            <View
              className="absolute left-0 right-0 border-t border-gray-700"
              style={{ top: '75%' }}
            />
            <View className="absolute bottom-0 left-0 right-0 border-t border-gray-700" />
          </View>
        )}

        {/* Bars */}
        <View className="absolute inset-0 ml-12 flex-row items-end justify-between gap-0.5">
          {normalizedData.map((d, index) => (
            <View
              key={d.timestamp || index}
              className="relative flex-1 rounded-t"
              style={{
                height: `${d.normalizedHeight}%`,
                backgroundColor: barColor,
                minHeight: d.normalizedHeight > 0 ? 2 : 0,
              }}
            >
              {/* Hover tooltip would go here in a web implementation */}
            </View>
          ))}
        </View>
      </View>

      {/* X-axis labels */}
      {showLabels && data.length <= 30 && (
        <View className="mt-2 flex-row justify-between">
          {data.map((d, index) => {
            // Show every nth label to avoid crowding
            const showLabel = index % Math.ceil(data.length / 7) === 0 || index === data.length - 1;
            return (
              <Text
                key={d.timestamp || index}
                className={`text-xs text-gray-400 ${showLabel ? '' : 'opacity-0'}`}
              >
                {formatDate(d.timestamp)}
              </Text>
            );
          })}
        </View>
      )}

      {/* Legend */}
      <View className="mt-4 flex-row items-center gap-2">
        <View className="h-3 w-3 rounded" style={{ backgroundColor: barColor }} />
        <Text className="text-sm text-gray-400">Volume (24h)</Text>
      </View>
    </View>
  );
};

export default VolumeChart;
