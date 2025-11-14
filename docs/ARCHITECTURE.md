# HyperSwap Architecture

## Overview

HyperSwap follows a **layer-based architecture** with strict separation of concerns, ensuring maintainability, scalability, and testability.

## Architecture Layers

### 1. Presentation Layer (`src/components/`)

**Responsibility**: User interface and visual representation

**Components**:
- `ui/` - Reusable UI primitives (Button, Input, Modal, etc.)
- `swap/` - Swap-related components
- `liquidity/` - Liquidity pool components
- `portfolio/` - Portfolio management components
- `wrapped/` - Year wrapped experience components

**Rules**:
- Components should be presentational only
- Business logic delegated to hooks and services
- Use NativeWind for styling
- Keep files under 500 lines
- Comprehensive prop types and JSDoc

**Example**:
```typescript
// ✅ Good: Presentational component
export const SwapButton: React.FC<SwapButtonProps> = ({ onClick, disabled }) => {
  const { wallet, connect } = useWallet(); // Hook handles logic
  
  if (!wallet) {
    return <Button onClick={connect}>Connect Wallet</Button>;
  }
  
  return <Button onClick={onClick} disabled={disabled}>Swap</Button>;
};

// ❌ Bad: Component with business logic
export const SwapButton = () => {
  const [loading, setLoading] = useState(false);
  
  const executeSwap = async () => {
    // Business logic should be in a service
    const response = await fetch('/api/swap', {...});
    // ...
  };
};
```

### 2. Application Layer (`src/hooks/`)

**Responsibility**: Application state management and orchestration

**Structure**:
- `core/` - Reusable utility hooks (useDebounce, useLocalStorage, etc.)
- `domain/` - Domain-specific hooks (useSwapQuote, usePortfolio, etc.)

**Rules**:
- Hooks orchestrate services and manage state
- No direct API calls (use services)
- Return clean, typed data
- Handle loading and error states

**Example**:
```typescript
// ✅ Good: Hook orchestrates service
export function useSwapQuote(params: SwapQuoteParams) {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        const result = await getSwapQuote(params); // Service handles API
        setQuote(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.enabled) fetchQuote();
  }, [params]);
  
  return { quote, loading, error };
}
```

### 3. Domain Layer (`src/services/`)

**Responsibility**: Business logic and domain operations

**Structure**:
- `api/` - API integrations (Covalent, token prices)
- `blockchain/` - Blockchain interactions (provider, wallet, transactions)
- `swap/` - Swap-related business logic
- `liquidity/` - Liquidity pool operations
- `portfolio/` - Portfolio calculations
- `wrapped/` - Year wrapped data aggregation

**Rules**:
- Pure business logic, framework-agnostic
- Return typed data
- Handle errors appropriately
- Stateless services (no internal state)

**Example**:
```typescript
// ✅ Good: Pure business logic
export async function getSwapQuote(params: SwapQuoteParams): Promise<SwapQuote> {
  const client = this.clients.get(params.protocol);
  if (!client) throw new Error('Protocol not supported');
  
  const quote = await client.getQuote(params);
  return quote;
}

// ❌ Bad: Service with React state
export class SwapService {
  private [quote, setQuote] = useState(); // Don't use React in services
}
```

### 4. Infrastructure Layer

**Responsibility**: External system integrations

**Components**:
- API clients (Axios, Covalent SDK)
- Blockchain providers (Viem, Wagmi)
- WebSocket connections
- Cache systems (memory, localStorage)
- External services (analytics, monitoring)

**Rules**:
- Abstract external dependencies
- Provide clean interfaces
- Handle connection errors
- Implement retry logic

### 5. Configuration Layer (`src/config/`, `src/constants/`)

**Responsibility**: Application configuration and constants

**Structure**:
- `config/` - Runtime configuration (features, chains, theme)
- `constants/` - Immutable constants (addresses, ABIs, limits)

**Rules**:
- Centralize all configuration
- Use environment variables for secrets
- Type-safe configuration objects
- Document all options

### 6. Types Layer (`src/types/`)

**Responsibility**: TypeScript type definitions

**Structure**:
- Domain types (blockchain, token, swap, liquidity)
- API types (response, error)
- Utility types (guards, validators, branded)

**Rules**:
- Comprehensive type coverage
- Use branded types for IDs and addresses
- Runtime type guards for validation
- Zod schemas for API validation

### 7. Utilities Layer (`src/utils/`)

**Responsibility**: Pure helper functions

**Structure**:
- `format/` - Formatting (numbers, dates, addresses)
- `validation/` - Validation (addresses, amounts)
- `calculation/` - Calculations (gas, price, slippage)
- `async/` - Async utilities (retry, debounce)
- `browser/` - Browser utilities (storage, detection)

**Rules**:
- Pure functions only
- No side effects
- Comprehensive tests
- Type-safe

## Data Flow

```
User Interaction
       ↓
Component (Presentation)
       ↓
Hook (Application)
       ↓
Service (Domain)
       ↓
API/Blockchain (Infrastructure)
       ↓
External System
```

### Example: Executing a Swap

1. **User clicks "Swap" button**
   ```typescript
   <SwapButton onClick={handleSwap} />
   ```

2. **Component delegates to hook**
   ```typescript
   const { executeSwap, isExecuting } = useSwapExecution();
   const handleSwap = () => executeSwap(quote);
   ```

3. **Hook orchestrates services**
   ```typescript
   export function useSwapExecution() {
     const execute = async (quote: SwapQuote) => {
       // Check allowance
       const allowance = await checkAllowance({...});
       
       // Approve if needed
       if (allowance < quote.fromAmount) {
         await approveToken({...});
       }
       
       // Execute swap
       await executeSwap({...});
     };
     
     return { executeSwap: execute, isExecuting };
   }
   ```

4. **Service handles blockchain interaction**
   ```typescript
   export async function executeSwap(params: SwapParams) {
     const client = await getWalletClient();
     const tx = await buildSwapTransaction(params);
     const hash = await client.sendTransaction(tx);
     return { hash };
   }
   ```

## Design Principles

### 1. Separation of Concerns

Each layer has a single, well-defined responsibility. Components render UI, hooks manage state, services handle logic.

### 2. Dependency Inversion

Higher layers depend on abstractions, not implementations. Services define interfaces, infrastructure implements them.

### 3. Single Responsibility

Each module has one reason to change. Swap logic in swap service, portfolio logic in portfolio service.

### 4. Open/Closed Principle

Open for extension, closed for modification. Add new DEX protocols without changing existing code.

### 5. Don't Repeat Yourself (DRY)

Common logic extracted to reusable utilities, hooks, and services.

## File Organization

### Naming Conventions

- **Components**: PascalCase (e.g., `SwapButton.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSwapQuote.ts`)
- **Services**: camelCase with `.service` suffix (e.g., `swap.service.ts`)
- **Utils**: camelCase (e.g., `formatAddress.ts`)
- **Types**: camelCase (e.g., `blockchain.ts`)

### File Size Guidelines

- **Target**: 200-400 lines per file
- **Maximum**: 500 lines (hard limit)
- **Exception**: Generated files, configuration files

### Barrel Exports

Each directory has an `index.ts` that exports all modules:

```typescript
// src/components/swap/index.ts
export { default as SwapInterface } from './SwapInterface';
export { default as TokenInput } from './TokenInput';
export { default as SwapButton } from './SwapButton';
```

Benefits:
- Clean imports: `import { SwapInterface, TokenInput } from '@/components/swap'`
- Easier refactoring
- Clear public API

## State Management

### Local State

Use `useState` for component-local state:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Shared State

Use React Context for shared state across components:

```typescript
const ThemeContext = createContext<ThemeContextType>(defaultTheme);
```

### Server State

Use React Query (TanStack Query) for server data:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['balances', address],
  queryFn: () => getTokenBalances(address),
});
```

### Form State

Use controlled components or React Hook Form for forms:

```typescript
const { register, handleSubmit } = useForm<FormData>();
```

## Error Handling

### Error Boundaries

Catch rendering errors:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Try-Catch

Handle async errors:

```typescript
try {
  await executeSwap(quote);
  toast.success('Swap successful!');
} catch (error) {
  toast.error('Swap failed');
  logError(error);
}
```

### Error Service

Centralized error handling:

```typescript
errorHandler.handle(error, {
  context: 'swap_execution',
  notify: true,
  report: true,
});
```

## Performance Optimization

### Code Splitting

```typescript
const SwapInterface = lazy(() => import('@/components/swap/SwapInterface'));
```

### Memoization

```typescript
const expensiveValue = useMemo(() => calculateValue(data), [data]);
const stableCallback = useCallback(() => doSomething(), []);
```

### Virtual Scrolling

For long lists:

```typescript
import { FixedSizeList } from 'react-window';
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image src="/token.png" width={32} height={32} alt="Token" />
```

## Testing Strategy

### Unit Tests

Test utilities and services in isolation:

```typescript
describe('formatAddress', () => {
  it('should truncate long addresses', () => {
    expect(formatAddress('0x1234...5678')).toBe('0x1234...5678');
  });
});
```

### Integration Tests

Test component + hook + service interactions:

```typescript
it('should execute swap successfully', async () => {
  render(<SwapInterface />);
  // User interactions
  // Assert expected behavior
});
```

### E2E Tests

Test complete user flows:

```typescript
test('user can swap tokens', async ({ page }) => {
  await page.goto('/swap');
  await page.fill('#fromAmount', '1');
  await page.click('button:has-text("Swap")');
  await expect(page.locator('.success-toast')).toBeVisible();
});
```

## Security Considerations

### Client-Side Only

- No private keys stored
- No server-side wallet operations
- User maintains full custody

### Input Validation

```typescript
const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
const validAddress = AddressSchema.parse(input);
```

### Rate Limiting

```typescript
const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });
```

### Content Security Policy

Configured in `next.config.ts`:

```typescript
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; ..."
  }
]
```

## Deployment

### Build Process

1. Type check: `npm run type-check`
2. Lint: `npm run lint`
3. Test: `npm run test`
4. Build: `npm run build`

### Environment Variables

- Development: `.env.local`
- Production: Set in deployment platform

### Docker

Multi-stage build for optimal image size:

```dockerfile
FROM node:20-alpine AS deps
# Install dependencies

FROM node:20-alpine AS builder  
# Build application

FROM node:20-alpine AS runner
# Run application
```

## Monitoring & Observability

### Logging

```typescript
logger.info('Swap executed', { txHash, amount, user });
```

### Analytics

```typescript
trackEvent('swap_completed', { protocol, volume });
```

### Performance Monitoring

```typescript
performanceMonitor.measure('swap_execution_time', startTime, endTime);
```

### Error Tracking

```typescript
Sentry.captureException(error, { context: 'swap' });
```

## Future Considerations

### Scalability

- Consider state management library (Zustand, Jotai) for complex state
- Implement request batching for multiple API calls
- Add service workers for offline support

### Extensibility

- Plugin architecture for custom DEX integrations
- Theming system for white-label deployments
- Webhook system for transaction notifications

### Performance

- Implement progressive web app (PWA) features
- Add skeleton loading states
- Optimize bundle with dynamic imports

---

This architecture provides a solid foundation for a scalable, maintainable, and production-ready decentralized exchange aggregator.

