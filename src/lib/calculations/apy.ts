export const calculateAPY = (rate: number, periods: number = 365) => {
  return (Math.pow(1 + rate / periods, periods) - 1) * 100;
};
