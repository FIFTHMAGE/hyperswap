/**
 * Swap button with state handling
 * @module components/swap/SwapButton
 */

'use client';

import { styled } from 'nativewind';

import { useWallet } from '@/hooks/core/useWallet';

import { LoadingButton } from '../ui';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
}) => {
  const { wallet, connect } = useWallet();

  if (!wallet) {
    return (
      <LoadingButton onClick={connect} variant="primary" size="lg" fullWidth className="mt-4">
        Connect Wallet
      </LoadingButton>
    );
  }

  return (
    <LoadingButton
      onClick={onClick}
      disabled={disabled}
      isLoading={isLoading}
      variant="primary"
      size="lg"
      fullWidth
      className="mt-4"
      loadingText="Swapping..."
    >
      Swap
    </LoadingButton>
  );
};

export default styled(SwapButton);
