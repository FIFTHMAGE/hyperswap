/**
 * Unit conversion utilities
 * @module utils/conversion/units
 */

/**
 * Convert from wei to ether
 */
export function fromWei(wei: string | number, decimals: number = 18): string {
  const weiNum = typeof wei === 'string' ? BigInt(wei) : BigInt(Math.floor(wei));
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = weiNum / divisor;
  const fractionalPart = weiNum % divisor;

  if (fractionalPart === BigInt(0)) {
    return integerPart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  return `${integerPart}.${fractionalStr}`.replace(/\.?0+$/, '');
}

/**
 * Convert from ether to wei
 */
export function toWei(ether: string | number, decimals: number = 18): string {
  const etherStr = typeof ether === 'number' ? ether.toString() : ether;
  const [integer = '0', fraction = '0'] = etherStr.split('.');

  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  const wei = BigInt(integer) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFraction);

  return wei.toString();
}

/**
 * Convert Gwei to wei
 */
export function gweiToWei(gwei: string | number): string {
  return toWei(gwei, 9);
}

/**
 * Convert wei to Gwei
 */
export function weiToGwei(wei: string | number): string {
  return fromWei(wei, 9);
}

/**
 * Parse units with custom decimals
 */
export function parseUnits(value: string, decimals: number): string {
  return toWei(value, decimals);
}

/**
 * Format units with custom decimals
 */
export function formatUnits(value: string, decimals: number): string {
  return fromWei(value, decimals);
}
