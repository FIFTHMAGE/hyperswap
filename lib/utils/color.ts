export function getGradientForChain(chainId: number): string {
  const gradients: Record<number, string> = {
    1: 'from-blue-900 to-indigo-900',
    137: 'from-purple-900 to-violet-900',
    42161: 'from-blue-800 to-cyan-900',
    10: 'from-red-900 to-pink-900',
    8453: 'from-blue-700 to-indigo-800',
  };
  return gradients[chainId] || 'from-gray-900 to-slate-900';
}

