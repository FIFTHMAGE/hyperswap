import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';

export class SolanaClient {
  private connection: Connection;

  constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  async getBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to get Solana balance:', error);
      return 0;
    }
  }

  async getTokenAccounts(address: string) {
    try {
      const publicKey = new PublicKey(address);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );

      return tokenAccounts.value.map(account => {
        const data = account.account.data as ParsedAccountData;
        return {
          mint: data.parsed.info.mint,
          amount: data.parsed.info.tokenAmount.uiAmount,
          decimals: data.parsed.info.tokenAmount.decimals,
        };
      });
    } catch (error) {
      console.error('Failed to get Solana token accounts:', error);
      return [];
    }
  }

  async getTransactionHistory(address: string, limit: number = 10) {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await this.connection.getSignaturesForAddress(
        publicKey,
        { limit }
      );

      const transactions = [];
      for (const sig of signatures) {
        const tx = await this.connection.getParsedTransaction(sig.signature);
        if (tx) {
          transactions.push({
            signature: sig.signature,
            timestamp: tx.blockTime,
            slot: tx.slot,
            fee: tx.meta?.fee || 0,
            success: tx.meta?.err === null,
          });
        }
      }

      return transactions;
    } catch (error) {
      console.error('Failed to get Solana transactions:', error);
      return [];
    }
  }
}

export const solanaClient = new SolanaClient();

