# Type Definitions

This directory contains all TypeScript type definitions used throughout the application.

## Structure

```
types/
├── common.ts              # Common utility types
├── blockchain.ts          # Blockchain-related types
├── token.ts               # Token types (ERC20, NFT)
├── swap/                  # Swap domain types
│   ├── index.ts          # Main swap types
│   └── aggregator.ts     # DEX aggregator types
├── liquidity/             # Liquidity pool types
│   ├── pool.ts           # Pool definitions
│   └── position.ts       # LP position types
├── portfolio/             # Portfolio types
│   ├── balance.ts        # Balance tracking
│   └── transaction.ts    # Transaction history
├── wrapped/               # Year-wrapped types
│   ├── stats.ts          # Statistics
│   └── card.ts           # Card configuration
├── analytics/             # Analytics types
│   ├── metrics.ts        # Metrics definitions
│   └── events.ts         # Event tracking
├── api/                   # API types
│   ├── response.ts       # API responses
│   └── error.ts          # Error types
├── realtime/              # Real-time types
│   ├── websocket.ts      # WebSocket messages
│   └── subscription.ts   # Subscription management
├── user/                  # User types
│   ├── wallet.ts         # Wallet state
│   └── preferences.ts    # User preferences
├── ui/                    # UI component types
│   └── component.ts      # Component props
├── guards.ts              # Runtime type guards
├── validators.ts          # Validation functions
└── branded.ts             # Branded types
```

## Usage

Import types from the barrel export:

```typescript
import type { Token, SwapQuote, PortfolioBalance } from '@/types';
```

Or import specific modules:

```typescript
import type { Token } from '@/types/token';
import type { SwapQuote } from '@/types/swap';
```

## Type Categories

### Common Types
- Utility types (Nullable, Optional, DeepPartial)
- Pagination types
- Async state types
- Result types

### Domain Types
- **Blockchain**: Chains, transactions, gas, blocks
- **Tokens**: ERC20, ERC721, ERC1155
- **Swap**: Quotes, routes, execution
- **Liquidity**: Pools, positions, analytics
- **Portfolio**: Balances, transactions, allocation
- **Wrapped**: Year-in-review statistics

### System Types
- **Analytics**: Metrics, events, tracking
- **API**: Responses, errors, pagination
- **Real-time**: WebSocket, subscriptions
- **User**: Wallet, preferences, settings
- **UI**: Component props, variants

### Utility Types
- **Guards**: Runtime type checking
- **Validators**: Input validation
- **Branded**: Type-safe IDs

## Best Practices

1. **Always use types from this directory** - Don't define types inline
2. **Use type guards** - For runtime validation
3. **Use branded types** - For type-safe IDs
4. **Document complex types** - Add JSDoc comments
5. **Keep types pure** - No logic in type files
6. **Use const assertions** - For literal types
7. **Leverage utility types** - Use common.ts utilities

## Adding New Types

1. Create file in appropriate subdirectory
2. Add comprehensive JSDoc comments
3. Export from module's index.ts
4. Update main types/index.ts barrel export
5. Add runtime validators if needed
6. Create type guards if applicable
7. Add to README documentation

