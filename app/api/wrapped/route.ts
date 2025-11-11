import { NextRequest, NextResponse } from 'next/server';
import { fetchMultiChainTransactions, fetchMultiChainBalances, fetchMultiChainNFTs } from '@/lib/api/multichain';
import { processWalletData } from '@/lib/analytics/processor';
import { determineWalletRank } from '@/lib/analytics/ranking';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch data from all chains in parallel
    const [transactions, balances, nfts] = await Promise.all([
      fetchMultiChainTransactions(address),
      fetchMultiChainBalances(address),
      fetchMultiChainNFTs(address),
    ]);

    // Process the data
    const stats = processWalletData(address, transactions, balances, nfts);
    
    // Determine wallet rank
    stats.rank = determineWalletRank(stats);

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}

