export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function compareAddresses(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export function formatTokenAmount(amount: string | number, decimals: number = 18): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (value / Math.pow(10, decimals)).toFixed(4);
}

export function weiToEther(wei: string | bigint): string {
  const value = typeof wei === 'string' ? BigInt(wei) : wei;
  return (Number(value) / 1e18).toFixed(6);
}

