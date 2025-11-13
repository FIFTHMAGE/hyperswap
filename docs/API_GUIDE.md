# API Integration Guide

## Overview

This guide covers the integration of blockchain data APIs used in Wallet Wrapped.

## Covalent/GoldRush API

### Setup

1. Get API key from [Covalent](https://www.covalenthq.com/)
2. Add to `.env.local`:
```
COVALENT_API_KEY=your_api_key_here
```

### Usage

```typescript
import { covalentClient } from '@/lib/api/covalent';

// Get wallet balance
const balance = await covalentClient.getBalance('eth-mainnet', walletAddress);

// Get transactions
const txs = await covalentClient.getTransactions('eth-mainnet', walletAddress);
```

### Endpoints

- `GET /v1/{chainName}/address/{address}/balances_v2/`
- `GET /v1/{chainName}/address/{address}/transactions_v2/`
- `GET /v1/{chainName}/address/{address}/portfolio_v2/`

### Rate Limits

- Free tier: 100,000 credits/month
- Pro tier: Unlimited

## WalletConnect

### Setup

1. Get project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Add to `.env.local`:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Usage

```typescript
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();
```

## Real-time Price Feed

### WebSocket Connection

```typescript
import { PriceFeed } from '@/lib/realtime/price-feed';

const priceFeed = new PriceFeed('wss://price-feed.example.com');
priceFeed.connect();

priceFeed.subscribeToPrices(['ETH', 'BTC'], (update) => {
  console.log('Price update:', update);
});
```

## Error Handling

All API calls should be wrapped in try-catch:

```typescript
try {
  const data = await covalentClient.getBalance(chain, address);
  // Handle success
} catch (error) {
  console.error('API error:', error);
  // Handle error
}
```

