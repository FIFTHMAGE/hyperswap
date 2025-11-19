export class SwapError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'SwapError';
  }
}

export class InsufficientLiquidityError extends SwapError {
  constructor() {
    super('Insufficient liquidity', 'INSUFFICIENT_LIQUIDITY');
  }
}
