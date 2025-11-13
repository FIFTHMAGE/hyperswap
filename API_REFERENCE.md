# API Reference

## Internal API Endpoints

### GET /api/wrapped

Fetch wrapped statistics for a wallet address.

**Query Parameters:**
- `address` (required): Wallet address
- `year` (optional): Year to analyze (default: 2024)

**Response:**
```json
{
  "address": "0x...",
  "totalTransactions": 150,
  "totalGasSpent": 250.50,
  "uniqueChains": 5,
  "topTokens": [...],
  "nfts": [...],
  "defi": {...}
}
```

## External APIs

### Covalent API

Used for blockchain data fetching.

**Endpoints Used:**
- Get transactions for address
- Get token balances
- Get NFT metadata

**Rate Limits:**
- 30 requests per minute (free tier)
- Cached for 5 minutes

## Error Handling

All API endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Authentication

- WalletConnect for user authentication
- API keys stored in environment variables
- No server-side authentication required

