export const calculatePercentage = (value: number, total: number) => {
  return (value / total) * 100;
};

export const roundToDecimals = (value: number, decimals: number) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
