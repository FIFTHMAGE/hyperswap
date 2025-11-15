export interface Transaction {
  txHash: string;
  blockHeight: number;
  blockSignedAt: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  gasPrice: string;
  gasSpent: string;
  successful: boolean;
  chainId: number;
}

export interface TransactionResponse {
  address: string;
  chainId: number;
  items: Transaction[];
  pagination: {
    hasMore: boolean;
    pageNumber: number;
    pageSize: number;
  };
}

