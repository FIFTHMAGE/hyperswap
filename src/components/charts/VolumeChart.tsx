/**
 * Volume Chart Component
 * Displays trading volume over time
 */

import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';

interface VolumeData {
  timestamp: number;
  volume: number;
  date: string;
}

interface VolumeChartProps {
  data: VolumeData[];
  height?: number;
  className?: string;
  showTooltip?: boolean;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  height = 200,
  className = '',
  showTooltip: _showTooltip = true,
}) => {
  const chartWidth = Dimensions.get('window').width - 48;

  const { maxVolume, bars } = useMemo(() => {
    if (data.length === 0) {
      return { maxVolume: 0, bars: [] };
    }

    const maxVol = Math.max(...data.map((d) => d.volume));
    const barWidth = chartWidth / data.length;

    const chartBars = data.map((item, index) => ({
      ...item,
      height: maxVol > 0 ? (item.volume / maxVol) * height : 0,
      x: index * barWidth,
      width: barWidth * 0.8,
    }));

    return { maxVolume: maxVol, bars: chartBars };
  }, [data, height, chartWidth]);

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  if (data.length === 0) {
    return (
      <View className={`flex items-center justify-center ${className}`} style={{ height }}>
        <Text className="text-gray-400">No volume data available</Text>
      </View>
    );
  }

  return (
    <View className={`${className}`}>
      {/* Chart Title */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-100">Trading Volume</Text>
        <Text className="text-sm text-gray-400">
          Total: {formatVolume(data.reduce((sum, d) => sum + d.volume, 0))}
        </Text>
      </View>

      {/* Chart Container */}
      <View className="relative" style={{ height }}>
        {/* Y-Axis Labels */}
        <View className="absolute left-0 top-0 bottom-0 justify-between py-2">
          <Text className="text-xs text-gray-400">{formatVolume(maxVolume)}</Text>
          <Text className="text-xs text-gray-400">{formatVolume(maxVolume / 2)}</Text>
          <Text className="text-xs text-gray-400">0</Text>
        </View>

        {/* Bars */}
        <View className="ml-12 flex-row items-end" style={{ height }}>
          {bars.map((bar, index) => (
            <View
              key={index}
              className="mx-0.5"
              style={{
                height: bar.height,
                width: bar.width,
                backgroundColor: bar.volume > maxVolume * 0.7 ? '#10b981' : '#3b82f6',
                borderRadius: 2,
              }}
            />
          ))}
        </View>

        {/* Baseline */}
        <View className="absolute left-12 right-0 border-b border-gray-700" style={{ bottom: 0 }} />
      </View>

      {/* X-Axis Labels */}
      <View className="ml-12 flex-row justify-between mt-2">
        {data.length > 0 && (
          <>
            <Text className="text-xs text-gray-400">{data[0].date}</Text>
            {data.length > 1 && (
              <Text className="text-xs text-gray-400">
                {data[Math.floor(data.length / 2)].date}
              </Text>
            )}
            {data.length > 2 && (
              <Text className="text-xs text-gray-400">{data[data.length - 1].date}</Text>
            )}
          </>
        )}
      </View>

      {/* Legend */}
      <View className="mt-4 flex-row items-center gap-4">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
          <Text className="text-xs text-gray-400">Normal Volume</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
          <Text className="text-xs text-gray-400">High Volume</Text>
        </View>
      </View>
    </View>
  );
};

export default VolumeChart;
