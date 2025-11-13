# Testing Guide

## Running Tests

```bash
npm test          # Run all tests
npm test:watch    # Watch mode
npm test:coverage # Coverage report
```

## Test Structure

```
/__tests__
  /components
  /hooks
  /lib
  /utils
```

## Testing Strategies

### Unit Tests
- Utility functions
- Analytics calculations
- Data formatters

### Component Tests
- UI component rendering
- User interactions
- Props validation

### Integration Tests
- API calls
- Wallet connection
- Data flow

## Manual Testing

1. **Wallet Connection**
   - Test multiple wallets
   - Test network switching
   - Test disconnect/reconnect

2. **Data Fetching**
   - Test with different addresses
   - Test error handling
   - Test loading states

3. **UI/UX**
   - Test all story cards
   - Test navigation
   - Test sharing features

4. **Performance**
   - Lighthouse audit
   - Network throttling
   - Large dataset handling

## Test Wallets

Use these addresses for testing:
- Mainnet: `0x...` (with activity)
- Testnet: `0x...` (for testing)

