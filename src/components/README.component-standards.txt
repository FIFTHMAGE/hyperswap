# Component Standards and Guidelines

## Component Structure

```
src/components/
├── shared/           # Shared utilities and types
├── ui/               # Base UI components (Button, Input, Card, etc.)
├── patterns/         # Compound patterns (LoadingState, ErrorState, etc.)
├── HOCs/             # Higher-Order Components
├── layouts/          # Layout components (Container, Stack, Grid)
├── features/         # Feature-specific components
└── [domain]/         # Domain components (swap, portfolio, etc.)
```

## Component Template

```typescript
import React from 'react';
import { BaseComponentProps } from '../shared/prop-types';
import { cn } from '../shared/component-utils';

export interface MyComponentProps extends BaseComponentProps {
  // Component-specific props
}

export const MyComponent: React.FC<MyComponentProps> = ({
  className,
  children,
  testId,
  ...props
}) => {
  return (
    <div
      className={cn('base-classes', className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
```

## Standards

### 1. TypeScript
- ✅ Always define prop interfaces
- ✅ Extend BaseComponentProps when appropriate
- ✅ Use strict typing (no `any`)
- ✅ Export prop types for reuse

### 2. Styling
- ✅ Use NativeWind/Tailwind only (NO StyleSheet)
- ✅ Use the `cn()` helper for conditional classes
- ✅ Support className prop for extensibility
- ✅ Use theme-variants.ts for consistent styling

### 3. Accessibility
- ✅ Include ARIA attributes
- ✅ Support keyboard navigation
- ✅ Use semantic HTML
- ✅ Add focus-visible styles

### 4. Performance
- ✅ Use React.memo for expensive components
- ✅ Use useCallback for event handlers
- ✅ Avoid inline object/array creation
- ✅ Lazy load heavy components

### 5. Testing
- ✅ Add data-testid attributes
- ✅ Write unit tests for logic
- ✅ Test accessibility
- ✅ Test responsive behavior

### 6. File Organization
- ✅ Max 400 lines per file
- ✅ One component per file
- ✅ Co-locate tests
- ✅ Use barrel exports (index.ts)

