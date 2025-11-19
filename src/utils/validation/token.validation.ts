/**
 * Token validation utilities
 * @module utils/validation/token
 */

export function isValidTokenAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
}

export function isValidTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateSlippage(slippage: number): boolean {
  return slippage >= 0.1 && slippage <= 50;
}

export function validateDeadline(minutes: number): boolean {
  return minutes >= 1 && minutes <= 60;
}
