/**
 * Price display component with formatting
 * @module components/features
 */

'use client';

interface PriceDisplayProps {
  price: string | number;
  currency?: string;
  change?: number;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({
  price,
  currency = 'USD',
  change,
  showChange = false,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const formatPrice = (value: string | number): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(numValue);
  };

  const formatChange = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-semibold text-gray-900 dark:text-white ${sizeClasses[size]}`}>
        {formatPrice(price)}
      </span>
      {showChange && change !== undefined && (
        <span
          className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {formatChange(change)}
        </span>
      )}
    </div>
  );
}
