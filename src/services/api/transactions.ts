import { API_ENDPOINTS } from '../constants/api';
import { Transaction, TransactionResponse } from '../types/transaction';
import { covalentClient } from './client';

export async function fetchTransactions(
  chainName: string,
  address: string,
  pageNumber = 0,
  pageSize = 100
): Promise<TransactionResponse> {
  const endpoint = API_ENDPOINTS.TRANSACTIONS(chainName, address);
  return covalentClient.get<TransactionResponse>(endpoint, {
    'page-number': pageNumber,
    'page-size': pageSize,
  });
}

export async function fetchAllTransactions(
  chainName: string,
  address: string
): Promise<Transaction[]> {
  const allTransactions: Transaction[] = [];
  let hasMore = true;
  let pageNumber = 0;

  while (hasMore) {
    const response = await fetchTransactions(chainName, address, pageNumber);
    allTransactions.push(...response.items);
    hasMore = response.pagination.hasMore;
    pageNumber++;
  }

  return allTransactions;
}

