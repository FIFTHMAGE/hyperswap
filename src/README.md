# Source Directory Architecture

This directory contains the core application source code organized by layer-based architecture.

## Directory Structure

```
src/
├── types/          # TypeScript type definitions and interfaces
├── config/         # Application configuration files
├── constants/      # Constant values and enums
├── utils/          # Pure utility functions
├── services/       # Business logic and API clients
├── hooks/          # React hooks
└── components/     # React components
```

## Architecture Principles

### Layer-Based Organization

The codebase follows a strict layer-based architecture where:

1. **Types Layer**: Pure TypeScript definitions with no runtime logic
2. **Constants Layer**: Immutable configuration values
3. **Utils Layer**: Pure functions with no side effects
4. **Services Layer**: Business logic and external integrations
5. **Hooks Layer**: React hooks for state management
6. **Components Layer**: UI components

### Dependency Rules

- Lower layers can be imported by higher layers
- Higher layers cannot be imported by lower layers
- Each layer should be independently testable

```
Components → Hooks → Services → Utils → Constants/Types
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `SwapInterface.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSwapQuote.ts`)
- **Services**: camelCase with `.service.ts` suffix (e.g., `swap-aggregator.service.ts`)
- **Utils**: camelCase (e.g., `format-number.ts`)
- **Types**: camelCase (e.g., `swap.ts`, `token.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for values, camelCase for files

### Import Aliases

Use path aliases for cleaner imports:

```typescript
import { Button } from '@/components/ui/Button';
import { useSwapQuote } from '@/hooks/swap';
import { formatCurrency } from '@/utils/format';
import { SwapService } from '@/services/swap';
import { CHAIN_IDS } from '@/constants/blockchain';
import type { Token } from '@/types/token';
```

### Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Testing**: Minimum 80% coverage
- **Documentation**: JSDoc comments for all public APIs
- **Linting**: ESLint + Prettier
- **Formatting**: Consistent code style

## Best Practices

1. **Single Responsibility**: Each file should have one clear purpose
2. **Small Files**: Keep files under 400 lines
3. **Descriptive Names**: Use clear, descriptive names
4. **Type Safety**: Leverage TypeScript's type system
5. **Immutability**: Prefer immutable data structures
6. **Pure Functions**: Minimize side effects
7. **Error Handling**: Always handle errors gracefully
8. **Performance**: Consider performance implications
9. **Accessibility**: Follow WCAG 2.1 AA standards
10. **Security**: Validate all user inputs

## Development Workflow

1. Create types first
2. Implement utilities
3. Build services
4. Create hooks
5. Build components
6. Write tests
7. Add documentation

## Testing Strategy

- **Unit Tests**: All utilities and services
- **Integration Tests**: Service interactions
- **Component Tests**: React Testing Library
- **E2E Tests**: Critical user flows
- **Visual Tests**: Component snapshots

## Documentation

- README files in each subdirectory
- JSDoc comments for public APIs
- Inline comments for complex logic
- Architecture decision records (ADRs)

