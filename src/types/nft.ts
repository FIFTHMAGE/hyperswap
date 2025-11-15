export interface NFTBalance {
  contractAddress: string;
  contractName: string;
  contractSymbol: string;
  tokenId: string;
  balance: string;
  metadata: NFTMetadata | null;
  chainId: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

