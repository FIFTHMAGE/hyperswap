/**
 * Hook for managing token approvals
 */

import { useState } from 'react';

export function useApproval() {
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const approve = async (tokenAddress: string, spenderAddress: string, amount: string) => {
    setApproving(true);
    try {
      // Mock approval - would use web3 library
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setApproved(true);
      return true;
    } catch (error) {
      console.error('Approval failed:', error);
      return false;
    } finally {
      setApproving(false);
    }
  };

  const checkAllowance = async (
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string
  ): Promise<string> => {
    // Mock allowance check
    return '0';
  };

  return { approve, checkAllowance, approving, approved };
}

