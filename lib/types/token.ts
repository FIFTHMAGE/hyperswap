export interface TokenBalance {
  contractAddress: string;
  contractName: string;
  contractSymbol: string;
  contractDecimals: number;
  logo: string | null;
  balance: string;
  quote: number;
  quoteRate: number;
  chainId: number;
}

export interface TokenTransfer {
  blockHeight: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  contractAddress: string;
  contractName: string;
  contractSymbol: string;
  value: string;
  blockSignedAt: string;
}

