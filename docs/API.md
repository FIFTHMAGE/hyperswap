# HyperSwap API Documentation

## Table of Contents

- [Services API](#services-api)
- [Hooks API](#hooks-api)
- [Components API](#components-api)
- [Utilities API](#utilities-api)

## Services API

### Swap Services

#### DexAggregatorService

```typescript
import { getSwapQuote, buildSwapTransaction } from '@/services/swap/aggregator.service';

// Get swap quote
const quote = await getSwapQuote({
  chainId: 1,
  fromToken: '0x...',
  toToken: '0x...',
  amount: '1000000000000000000',
  slippage: 0.005,
});

// Build swap transaction
const tx = await buildSwapTransaction(quote);
```

#### SwapExecutionService

```typescript
import { executeSwap } from '@/services/swap/execution.service';

const result = await executeSwap({
  chainId: 1,
  fromToken: '0x...',
  toToken: '0x...',
  amount: '1000000000000000000',
  slippage: 0.005,
  userAddress: '0x...',
});
```

### Portfolio Services

#### PortfolioBalanceService

```typescript
import { getPortfolioBalances } from '@/services/portfolio/balance.service';

const balances = await getPortfolioBalances(address, [1, 137, 42161]);
```

#### PortfolioValuationService

```typescript
import { calculatePortfolioValue } from '@/services/portfolio/valuation.service';

const valuation = await calculatePortfolioValue(balances);
```

### Liquidity Services

#### PoolDiscoveryService

```typescript
import { discoverPools } from '@/services/liquidity/pool-discovery.service';

const pools = await discoverPools({
  chainId: 1,
  minLiquidity: 100000,
  sortBy: 'tvl',
});
```

## Hooks API

### Core Hooks

#### useWallet

```typescript
import { useWallet } from '@/hooks/core/useWallet';

const { wallet, connect, disconnect, switchChain } = useWallet();
```

#### useDebounce

```typescript
import { useDebounce } from '@/hooks/core/useDebounce';

const debouncedValue = useDebounce(value, 300);
```

### Domain Hooks

#### useSwapQuote

```typescript
import { useSwapQuote } from '@/hooks/domain/useSwapQuote';

const { quote, loading, error } = useSwapQuote({
  chainId: 1,
  fromToken: '0x...',
  toToken: '0x...',
  amount: '1.0',
  slippage: 0.005,
  enabled: true,
});
```

#### usePortfolio

```typescript
import { usePortfolio } from '@/hooks/domain/usePortfolio';

const { portfolio, loading } = usePortfolio(address, chainIds);
```

## Components API

### UI Components

#### Button

```tsx
import { Button } from '@/components/ui';

<Button
  variant="primary" // 'primary' | 'secondary' | 'outline' | 'ghost'
  size="md" // 'sm' | 'md' | 'lg'
  onClick={handleClick}
  disabled={false}
  fullWidth={false}
>
  Click Me
</Button>
```

#### Input

```tsx
import { Input } from '@/components/ui';

<Input
  label="Amount"
  placeholder="0.0"
  value={value}
  onChange={handleChange}
  error={error}
  helperText="Helper text"
  fullWidth
/>
```

#### Modal

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

<Modal isOpen={isOpen} onClose={handleClose} size="md">
  <ModalHeader onClose={handleClose}>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={handleClose}>Close</Button>
  </ModalFooter>
</Modal>
```

### Swap Components

#### SwapInterface

```tsx
import { SwapInterface } from '@/components/swap';

<SwapInterface />
```

### Liquidity Components

#### PoolDiscovery

```tsx
import { PoolDiscovery } from '@/components/liquidity';

<PoolDiscovery />
```

## Utilities API

### Format Utilities

```typescript
import {
  formatNumber,
  formatUSD,
  formatPercentage,
  formatAddress,
  formatDate,
} from '@/utils/format';

formatNumber(1000); // "1,000"
formatUSD(1234.56); // "$1,234.56"
formatPercentage(0.05); // "5.00%"
formatAddress('0x1234...5678'); // "0x1234...5678"
formatDate(new Date()); // "Jan 15, 2025"
```

### Validation Utilities

```typescript
import {
  isValidAddress,
  isValidAmount,
  isValidSlippage,
} from '@/utils/validation';

isValidAddress('0x...'); // true/false
isValidAmount('1.5'); // true/false
isValidSlippage(0.005); // true/false
```

### Calculation Utilities

```typescript
import {
  calculatePriceImpact,
  calculateGasFee,
  applySlippage,
} from '@/utils/calculation';

const impact = calculatePriceImpact(amountIn, amountOut);
const gasFee = calculateGasFee(estimatedGas, gasPrice);
const minAmount = applySlippage(amount, 0.005);
```

## Type Definitions

All type definitions are available in `@/types`:

```typescript
import type {
  ERC20Token,
  SwapQuote,
  LiquidityPool,
  PortfolioBalance,
} from '@/types';
```

## Error Handling

All services return typed errors:

```typescript
try {
  const quote = await getSwapQuote(params);
} catch (error) {
  if (error instanceof APIError) {
    console.error(error.code, error.message);
  }
}
```

## Rate Limiting

API calls are automatically rate-limited. Default: 10 requests per minute.

## Caching

Responses are cached with configurable TTL:

- Token prices: 30 seconds
- Pool data: 5 minutes
- Transaction history: 1 minute

---

For more details, see the inline JSDoc comments in the source code.

