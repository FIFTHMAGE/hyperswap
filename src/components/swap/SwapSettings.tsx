/**
 * Swap settings modal
 * @module components/swap/SwapSettings
 */

'use client';

import { useState } from 'react';
import { styled } from 'nativewind';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from '../ui';

interface SwapSettingsProps {
  slippage: number;
  onSlippageChange: (slippage: number) => void;
  onClose: () => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({
  slippage,
  onSlippageChange,
  onClose,
}) => {
  const [customSlippage, setCustomSlippage] = useState((slippage * 100).toString());

  const presetSlippages = [0.001, 0.005, 0.01]; // 0.1%, 0.5%, 1%

  const handleSave = () => {
    const value = parseFloat(customSlippage) / 100;
    if (!isNaN(value) && value > 0 && value < 0.5) {
      onSlippageChange(value);
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>Swap Settings</ModalHeader>
      <ModalBody>
        <div>
          <label className="block text-sm font-medium mb-2">Slippage Tolerance</label>
          
          <div className="flex gap-2 mb-3">
            {presetSlippages.map((preset) => (
              <button
                key={preset}
                onClick={() => setCustomSlippage((preset * 100).toString())}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  parseFloat(customSlippage) === preset * 100
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
              >
                {preset * 100}%
              </button>
            ))}
          </div>

          <div className="relative">
            <Input
              type="number"
              value={customSlippage}
              onChange={(e) => setCustomSlippage(e.target.value)}
              placeholder="Custom"
              fullWidth
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>

          {parseFloat(customSlippage) > 5 && (
            <p className="mt-2 text-sm text-yellow-600">
              ⚠️ High slippage tolerance may result in unfavorable rates
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default styled(SwapSettings);

