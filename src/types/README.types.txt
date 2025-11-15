# Type System Guide

## Usage

Import types from centralized location:

```typescript
import type { Address, Token, SwapQuote, ApiResponse } from '@/types';
```

## Type Categories

### Blockchain Types
- Address: `0x${string}` - Ethereum address
- Hash: `0x${string}` - Transaction/block hash
- Token: Complete token information
- Chain: Network configuration

### Domain Types
- SwapQuote: Swap pricing and routing
- Pool: Liquidity pool data
- Portfolio: User portfolio state
- TokenBalance: Token holdings

### API Types
- ApiResponse<T>: Standard API response
- PaginatedApiResponse<T>: Paginated data
- ApiError: Error responses

### UI Types
- AsyncState<T>: Loading state management
- Toast: Notification system
- ModalState: Modal management
- FormState<T>: Form state

### Utility Types
- DeepPartial<T>: Recursive partial
- RequireProps<T, K>: Require specific props
- Result<T, E>: Operation result
- Brand<K, T>: Nominal typing

## Type Guards

Use type guards for runtime validation:

```typescript
import { isAddress, isToken } from '@/types/guards';

if (isAddress(value)) {
  // TypeScript knows value is Address
}
```

## Best Practices

1. ✅ Always use defined types
2. ✅ Avoid `any` - use `unknown` instead
3. ✅ Use type guards for runtime checks
4. ✅ Prefer interfaces for objects
5. ✅ Use type aliases for unions
6. ✅ Export all types from index
7. ✅ Document complex types
8. ✅ Use utility types for transformations

