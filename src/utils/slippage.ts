/**
 * Slippage Calculation Utilities
 * Functions for calculating and managing slippage tolerance
 */

export type SlippagePreset = 'auto' | 'low' | 'medium' | 'high' | 'custom';

export interface SlippageConfig {
  value: number;
  preset: SlippagePreset;
  isCustom: boolean;
}

export interface SlippageWarning {
  level: 'none' | 'low' | 'medium' | 'high';
  message: string;
}

// Preset values
const SLIPPAGE_PRESETS: Record<SlippagePreset, number> = {
  auto: 0.5,
  low: 0.1,
  medium: 0.5,
  high: 1.0,
  custom: 0.5,
};

// Warning thresholds
const LOW_SLIPPAGE_THRESHOLD = 0.1;
const HIGH_SLIPPAGE_THRESHOLD = 1.0;
const VERY_HIGH_SLIPPAGE_THRESHOLD = 5.0;

/**
 * Get slippage value from preset
 */
export function getSlippageFromPreset(preset: SlippagePreset): number {
  return SLIPPAGE_PRESETS[preset];
}

/**
 * Create slippage config
 */
export function createSlippageConfig(
  value?: number,
  preset: SlippagePreset = 'auto'
): SlippageConfig {
  if (value !== undefined) {
    return {
      value,
      preset: 'custom',
      isCustom: true,
    };
  }
  return {
    value: getSlippageFromPreset(preset),
    preset,
    isCustom: false,
  };
}

/**
 * Calculate minimum output with slippage
 */
export function calculateMinOutput(
  expectedOutput: number,
  slippagePercent: number
): number {
  const slippageFactor = 1 - slippagePercent / 100;
  return expectedOutput * slippageFactor;
}

/**
 * Calculate maximum input with slippage
 */
export function calculateMaxInput(
  expectedInput: number,
  slippagePercent: number
): number {
  const slippageFactor = 1 + slippagePercent / 100;
  return expectedInput * slippageFactor;
}

/**
 * Calculate actual slippage from trade
 */
export function calculateActualSlippage(
  expectedOutput: number,
  actualOutput: number
): number {
  if (expectedOutput === 0) return 0;
  const slippage = ((expectedOutput - actualOutput) / expectedOutput) * 100;
  return Math.max(0, slippage);
}

/**
 * Get slippage warning
 */
export function getSlippageWarning(slippage: number): SlippageWarning {
  if (slippage < LOW_SLIPPAGE_THRESHOLD) {
    return {
      level: 'low',
      message: 'Your transaction may fail due to low slippage tolerance',
    };
  }
  if (slippage > VERY_HIGH_SLIPPAGE_THRESHOLD) {
    return {
      level: 'high',
      message: 'High slippage tolerance. You may receive significantly less tokens.',
    };
  }
  if (slippage > HIGH_SLIPPAGE_THRESHOLD) {
    return {
      level: 'medium',
      message: 'Slippage tolerance is higher than recommended',
    };
  }
  return {
    level: 'none',
    message: '',
  };
}

/**
 * Suggest optimal slippage based on conditions
 */
export function suggestSlippage(params: {
  priceImpact: number;
  liquidityDepth: number;
  volatility: number;
}): number {
  let suggested = 0.5; // Base slippage
  
  // Increase for high price impact
  if (params.priceImpact > 1) {
    suggested += params.priceImpact * 0.5;
  }
  
  // Increase for low liquidity
  if (params.liquidityDepth < 10000) {
    suggested += 0.5;
  }
  
  // Increase for high volatility
  if (params.volatility > 5) {
    suggested += params.volatility * 0.1;
  }
  
  // Cap at reasonable maximum
  return Math.min(suggested, 5);
}

/**
 * Validate slippage value
 */
export function validateSlippage(value: number): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: 'Invalid slippage value' };
  }
  if (value < 0) {
    return { valid: false, error: 'Slippage cannot be negative' };
  }
  if (value > 50) {
    return { valid: false, error: 'Slippage cannot exceed 50%' };
  }
  return { valid: true };
}

/**
 * Parse slippage from string input
 */
export function parseSlippage(input: string): number | null {
  const value = parseFloat(input);
  if (isNaN(value)) return null;
  return Math.max(0, Math.min(50, value));
}

/**
 * Format slippage for display
 */
export function formatSlippage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Get slippage preset options
 */
export function getSlippagePresetOptions(): Array<{
  preset: SlippagePreset;
  label: string;
  value: number;
}> {
  return [
    { preset: 'auto', label: 'Auto', value: SLIPPAGE_PRESETS.auto },
    { preset: 'low', label: '0.1%', value: SLIPPAGE_PRESETS.low },
    { preset: 'medium', label: '0.5%', value: SLIPPAGE_PRESETS.medium },
    { preset: 'high', label: '1%', value: SLIPPAGE_PRESETS.high },
  ];
}

/**
 * Check if trade will likely fail
 */
export function willTradeFailDueToSlippage(
  expectedSlippage: number,
  toleranceSlippage: number
): boolean {
  return expectedSlippage > toleranceSlippage;
}

export { SLIPPAGE_PRESETS, LOW_SLIPPAGE_THRESHOLD, HIGH_SLIPPAGE_THRESHOLD, VERY_HIGH_SLIPPAGE_THRESHOLD };

