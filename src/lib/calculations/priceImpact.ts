export const calculatePriceImpact = (amountIn: string, reserve: string) => {
  const impact = (parseFloat(amountIn) / parseFloat(reserve)) * 100;
  return Math.min(impact, 100);
};

export const calculateSlippage = (expected: string, actual: string) => {
  return ((parseFloat(expected) - parseFloat(actual)) / parseFloat(expected)) * 100;
};
