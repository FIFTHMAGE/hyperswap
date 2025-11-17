/**
 * Add liquidity modal
 * @module components/liquidity/AddLiquidity
 */

'use client';

import { styled } from 'nativewind';
import { useState } from 'react';

import type { LiquidityPool } from '@/types/liquidity/pool';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  LoadingButton,
  Button,
  NumberInput,
} from '../ui';

interface AddLiquidityProps {
  isOpen: boolean;
  onClose: () => void;
  pool: LiquidityPool;
  onConfirm: (amount0: string, amount1: string) => Promise<void>;
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ isOpen, onClose, pool, onConfirm }) => {
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await onConfirm(amount0, amount1);
      onClose();
    } catch (error) {
      console.error('Add liquidity failed:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>Add Liquidity</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{pool.token0.symbol} Amount</label>
            <NumberInput value={amount0} onChange={setAmount0} placeholder="0.0" fullWidth />
            <p className="text-sm text-gray-600 mt-1">Balance: {pool.token0.balance || '0'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{pool.token1.symbol} Amount</label>
            <NumberInput value={amount1} onChange={setAmount1} placeholder="0.0" fullWidth />
            <p className="text-sm text-gray-600 mt-1">Balance: {pool.token1.balance || '0'}</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ You will receive LP tokens representing your share of the pool
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isAdding}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleAdd}
          isLoading={isAdding}
          disabled={!amount0 || !amount1}
          loadingText="Adding..."
        >
          Add Liquidity
        </LoadingButton>
      </ModalFooter>
    </Modal>
  );
};

export default styled(AddLiquidity);
