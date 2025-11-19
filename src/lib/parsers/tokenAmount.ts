import { BigNumber } from 'ethers';

export const parseTokenAmount = (amount: string, decimals: number) => {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
};

export const formatTokenAmount = (amount: BigNumber, decimals: number) => {
  return amount.div(BigNumber.from(10).pow(decimals)).toString();
};
