'use client';

import { Card } from '@/components/ui/Card';

interface DataPoint {
  label: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  data: DataPoint[];
  type?: 'line' | 'bar';
}

export function ChartCard({ title, data, type = 'bar' }: ChartCardProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      
      <div className="space-y-4">
        {data.map((point, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {point.label}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {point.value.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(point.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

