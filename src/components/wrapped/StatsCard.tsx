/**
 * Stats card component for Wrapped feature
 * @module components/wrapped
 */

'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon, trend, className = '' }: StatsCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
          <div className="text-3xl font-bold">{value}</div>
          {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-sm">
          <span className={trend.value >= 0 ? 'text-green-300' : 'text-red-300'}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="opacity-75">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
