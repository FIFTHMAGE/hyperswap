/**
 * Validation utilities
 * @module utils
 */

import { ethers } from 'ethers';

export class ValidationUtil {
  static isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  static isValidAmount(amount: string): boolean {
    try {
      const num = parseFloat(amount);
      return !isNaN(num) && num > 0 && isFinite(num);
    } catch {
      return false;
    }
  }

  static isValidSlippage(slippage: number): boolean {
    return slippage >= 0 && slippage <= 50;
  }

  static isValidDeadline(deadline: number): boolean {
    return deadline >= 60 && deadline <= 3600;
  }

  static isValidChainId(chainId: number): boolean {
    return Number.isInteger(chainId) && chainId > 0;
  }

  static isValidPercentage(value: number): boolean {
    return value >= 0 && value <= 100;
  }
}
