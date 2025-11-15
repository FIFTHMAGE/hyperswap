# Service Patterns and Best Practices

## Architecture

All services should extend from shared base utilities and follow consistent patterns:

```
src/services/
├── shared/           # Shared utilities for all services
│   ├── api-client-base.ts
│   ├── service-cache.ts
│   ├── service-error-handler.ts
│   ├── service-logger.ts
│   ├── service-validator.ts
│   └── rate-limiter.ts
├── analytics/        # Analytics services
├── api/              # External API integrations
├── blockchain/       # Blockchain interactions
└── [domain]/         # Domain-specific services
```

## Service Pattern Template

```typescript
import { ApiClientBase, validateRequired, logger } from './shared';

export class MyService extends ApiClientBase {
  constructor() {
    super({
      baseURL: 'https://api.example.com',
      timeout: 30000,
      retries: 3,
    });
  }

  async fetchData(id: string): Promise<Data> {
    // 1. Validate inputs
    validateRequired(id, 'ID');
    
    // 2. Log the operation
    logger.debug('MyService', 'Fetching data', { id });
    
    // 3. Use caching when appropriate
    return this.get(`/data/${id}`, true, 60000);
  }
}
```

## Error Handling

Always use the error handler utilities:
- throw ValidationError for validation failures
- throw NetworkError for network issues
- Use withErrorHandling wrapper for consistent error catching

## Caching

Use serviceCache for temporary data:
- Token prices: 30s TTL
- Balances: 10s TTL
- Pool data: 1min TTL
- Analytics: 5min TTL

## Rate Limiting

Apply rate limiters to external APIs:
- Create RateLimiter instance per service
- Await limiter.acquire() before API calls

## Logging

Use structured logging:
- logger.debug() for development
- logger.info() for important events
- logger.warn() for warnings
- logger.error() for errors with full context

