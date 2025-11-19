import { ethers } from 'ethers';

export const getContract = (address: string, abi: unknown[], provider: ethers.Provider) => {
  return new ethers.Contract(address, abi as ethers.InterfaceAbi, provider);
};

export const parseUnits = (value: string, decimals: number = 18) => {
  return ethers.parseUnits(value, decimals);
};
