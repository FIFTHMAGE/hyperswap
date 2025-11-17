/**
 * Swap confirmation modal
 * @module components/swap/SwapConfirmation
 */

'use client';

import { styled } from 'nativewind';

import type { SwapQuote } from '@/types/swap';

import { Modal, ModalHeader, ModalBody, ModalFooter, LoadingButton, Button } from '../ui';

interface SwapConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quote: SwapQuote;
  isExecuting?: boolean;
}

const SwapConfirmation: React.FC<SwapConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  quote,
  isExecuting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>Confirm Swap</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-3xl font-bold">{quote.fromAmount}</div>
            <div className="text-gray-600">{quote.fromToken}</div>
            <div className="my-2">↓</div>
            <div className="text-3xl font-bold">{quote.toAmount}</div>
            <div className="text-gray-600">{quote.toToken}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Price Impact</span>
              <span className={quote.priceImpact > 0.05 ? 'text-red-600' : ''}>
                {(quote.priceImpact * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Minimum Received</span>
              <span>{quote.minimumReceived}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Gas</span>
              <span>{quote.estimatedGas}</span>
            </div>
          </div>

          {quote.priceImpact > 0.05 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ High price impact detected. You may receive significantly less than expected.
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isExecuting}>
          Cancel
        </Button>
        <LoadingButton onClick={onConfirm} isLoading={isExecuting} loadingText="Swapping...">
          Confirm Swap
        </LoadingButton>
      </ModalFooter>
    </Modal>
  );
};

export default styled(SwapConfirmation);
