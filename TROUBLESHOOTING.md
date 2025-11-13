# Troubleshooting Guide

## Common Issues

### Wallet Connection Issues

**Problem**: Wallet won't connect
**Solution**:
- Check WalletConnect Project ID is set correctly
- Try refreshing the page
- Clear browser cache
- Try a different browser

### Data Loading Issues

**Problem**: Stats not loading
**Solution**:
- Verify Covalent API key is valid
- Check network connection
- Check browser console for errors
- Verify wallet has on-chain activity

### Performance Issues

**Problem**: Slow page load
**Solution**:
- Clear browser cache
- Disable browser extensions
- Check network throttling
- Use production build

### Build Errors

**Problem**: Build fails
**Solution**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

### API Rate Limits

**Problem**: Too many requests error
**Solution**:
- Wait a minute and try again
- Check rate limiter configuration
- Upgrade Covalent API tier

## Error Codes

- `WALLET_NOT_CONNECTED`: User wallet not connected
- `API_ERROR`: External API failure
- `RATE_LIMITED`: Too many requests
- `INVALID_ADDRESS`: Invalid wallet address

## Getting Help

1. Check documentation
2. Search GitHub issues
3. Join Discord community
4. Contact support

