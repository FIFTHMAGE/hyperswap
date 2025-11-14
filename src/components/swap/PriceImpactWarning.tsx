/**
 * Price impact warning component
 * @module components/swap/PriceImpactWarning
 */

'use client';

import { styled } from 'nativewind';
import { Alert } from '../ui';

interface PriceImpactWarningProps {
  priceImpact: number;
  className?: string;
}

const PriceImpactWarning: React.FC<PriceImpactWarningProps> = ({
  priceImpact,
  className = '',
}) => {
  if (priceImpact < 0.01) return null; // Less than 1%

  const severity = priceImpact > 0.05 ? 'error' : priceImpact > 0.03 ? 'warning' : 'info';
  
  const messages = {
    error: 'Very high price impact! You may receive significantly less than expected.',
    warning: 'High price impact. Consider reducing your swap amount.',
    info: 'Moderate price impact detected.',
  };

  return (
    <Alert type={severity} className={className}>
      <div>
        <div className="font-medium">Price Impact: {(priceImpact * 100).toFixed(2)}%</div>
        <div className="text-sm mt-1">{messages[severity]}</div>
      </div>
    </Alert>
  );
};

export default styled(PriceImpactWarning);

