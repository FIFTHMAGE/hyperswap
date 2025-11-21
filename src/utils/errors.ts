/**
 * Custom error classes
 * @module utils
 */

export class SwapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SwapError';
  }
}

export class InsufficientBalanceError extends SwapError {
  constructor(token: string, required: string, available: string) {
    super(`Insufficient ${token} balance. Required: ${required}, Available: ${available}`);
    this.name = 'InsufficientBalanceError';
  }
}

export class SlippageExceededError extends SwapError {
  constructor(expected: string, actual: string) {
    super(`Slippage exceeded. Expected: ${expected}, Actual: ${actual}`);
    this.name = 'SlippageExceededError';
  }
}

export class WalletNotConnectedError extends Error {
  constructor() {
    super('Wallet is not connected');
    this.name = 'WalletNotConnectedError';
  }
}

export class InvalidAmountError extends Error {
  constructor(amount: string) {
    super(`Invalid amount: ${amount}`);
    this.name = 'InvalidAmountError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(`Network error: ${message}`);
    this.name = 'NetworkError';
  }
}

export class ContractError extends Error {
  constructor(message: string) {
    super(`Contract error: ${message}`);
    this.name = 'ContractError';
  }
}
