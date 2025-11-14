/**
 * Remove liquidity modal
 * @module components/liquidity/RemoveLiquidity
 */

'use client';

import { useState } from 'react';
import { styled } from 'nativewind';
import { Modal, ModalHeader, ModalBody, ModalFooter, LoadingButton, Button } from '../ui';
import type { PoolPosition } from '@/types/liquidity/position';

interface RemoveLiquidityProps {
  isOpen: boolean;
  onClose: () => void;
  position: PoolPosition;
  onConfirm: (percentage: number) => Promise<void>;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  isOpen,
  onClose,
  position,
  onConfirm,
}) => {
  const [percentage, setPercentage] = useState(25);
  const [isRemoving, setIsRemoving] = useState(false);

  const presets = [25, 50, 75, 100];

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onConfirm(percentage);
      onClose();
    } catch (error) {
      console.error('Remove liquidity failed:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>Remove Liquidity</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              Amount to Remove: {percentage}%
            </label>
            
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full"
            />

            <div className="flex gap-2 mt-3">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPercentage(preset)}
                  className={`flex-1 py-2 rounded-lg border transition-colors ${
                    percentage === preset
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">You will receive:</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>{position.token0Symbol}</span>
              <span>{((position.amount0 * percentage) / 100).toFixed(4)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>{position.token1Symbol}</span>
              <span>{((position.amount1 * percentage) / 100).toFixed(4)}</span>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isRemoving}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleRemove}
          isLoading={isRemoving}
          disabled={percentage === 0}
          loadingText="Removing..."
        >
          Remove Liquidity
        </LoadingButton>
      </ModalFooter>
    </Modal>
  );
};

export default styled(RemoveLiquidity);

