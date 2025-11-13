# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- WalletConnect Project ID
- Covalent API Key

## Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your API keys in `.env.local`

## Build

```bash
npm run build
```

## Deployment Platforms

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Run `npm run build`
2. Deploy `out` directory
3. Configure environment variables

### Docker

```bash
docker build -t wallet-wrapped .
docker run -p 3000:3000 wallet-wrapped
```

## Post-Deployment

- Test wallet connection
- Verify API functionality
- Check analytics tracking
- Monitor error logs

