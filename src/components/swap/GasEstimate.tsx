/**
 * Gas estimate display component
 * @module components/swap/GasEstimate
 */

'use client';

import { styled } from 'nativewind';
import { useGasPrice } from '@/hooks/core/useGasPrice';

interface GasEstimateProps {
  estimatedGas: string;
  className?: string;
}

const GasEstimate: React.FC<GasEstimateProps> = ({
  estimatedGas,
  className = '',
}) => {
  const { gasPrice } = useGasPrice();

  const calculateGasCost = () => {
    if (!gasPrice) return '...';
    
    const gas = BigInt(estimatedGas);
    const price = gasPrice.value;
    const cost = (gas * price) / BigInt(10 ** 18);
    
    return cost.toString();
  };

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <span>⛽ Gas:</span>
      <span>{estimatedGas}</span>
      <span>({calculateGasCost()} ETH)</span>
    </div>
  );
};

export default styled(GasEstimate);

