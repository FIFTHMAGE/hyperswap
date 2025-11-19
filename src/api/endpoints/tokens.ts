export const getTokenList = async () => {
  return [
    { symbol: 'ETH', address: 'native' },
    { symbol: 'USDC', address: '0xA0b...' },
  ];
};

export const getTokenPrice = async (address: string) => {
  return { price: 1000, symbol: 'ETH', address };
};
