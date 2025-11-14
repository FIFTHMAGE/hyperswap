# HyperSwap

A production-ready, multi-chain decentralized exchange (DEX) aggregator built with Next.js 14, TypeScript, and modern Web3 technologies.

## Features

- 🔄 **Multi-Chain Swaps** - Trade across Ethereum, Polygon, Arbitrum, Optimism, Base, and more
- 💱 **DEX Aggregation** - Best rates from Uniswap, Sushiswap, 1inch, and other DEXes
- 💰 **Portfolio Tracking** - Monitor your holdings across all chains
- 🏊 **Liquidity Pools** - Discover and manage LP positions
- 📊 **Year Wrapped** - Beautiful annual blockchain activity summaries
- ⚡ **Real-time Updates** - Live price feeds and transaction tracking
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔐 **Secure** - Non-custodial, client-side only

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS + NativeWind
- **Blockchain**: Wagmi + Viem + WalletConnect v2
- **Animations**: Framer Motion
- **Data**: Covalent GoldRush API
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- A WalletConnect Project ID (free at [cloud.walletconnect.com](https://cloud.walletconnect.com))
- A Covalent API Key (free at [covalenthq.com](https://www.covalenthq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hyperswap.git
cd hyperswap

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
# COVALENT_API_KEY=your_api_key

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
hyperswap/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI primitives
│   │   ├── swap/        # Swap-related components
│   │   ├── liquidity/   # Liquidity pool components
│   │   ├── portfolio/   # Portfolio components
│   │   └── wrapped/     # Year wrapped components
│   ├── config/          # App configuration
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   │   ├── core/       # Utility hooks
│   │   └── domain/     # Domain-specific hooks
│   ├── services/        # Business logic services
│   │   ├── api/        # API integrations
│   │   ├── blockchain/ # Blockchain interactions
│   │   ├── swap/       # Swap services
│   │   └── ...         # Other services
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/             # Static assets
└── docs/              # Documentation
```

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm run type-check   # Check TypeScript types

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests

# Utilities
npm run clean        # Clean build artifacts
```

## Architecture

HyperSwap follows a **layer-based architecture** with strict separation of concerns:

### Layers

1. **Presentation Layer** (`components/`): React components, UI primitives
2. **Application Layer** (`hooks/`): Custom hooks, state management
3. **Domain Layer** (`services/`): Business logic, domain services
4. **Infrastructure Layer** (`services/api/`, `services/blockchain/`): External integrations
5. **Configuration Layer** (`config/`, `constants/`): App configuration
6. **Types Layer** (`types/`): TypeScript definitions
7. **Utilities Layer** (`utils/`): Pure helper functions

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## Key Features

### Multi-Chain Swaps

Execute token swaps across multiple blockchains with automatic DEX aggregation for best rates:

```typescript
import { useSwapQuote } from '@/hooks/domain/useSwapQuote';

const { quote, loading } = useSwapQuote({
  chainId: 1, // Ethereum
  fromToken: '0x...',
  toToken: '0x...',
  amount: '1000000000000000000', // 1 token in wei
  slippage: 0.005, // 0.5%
});
```

### Portfolio Tracking

Monitor your multi-chain portfolio in real-time:

```typescript
import { usePortfolio } from '@/hooks/domain/usePortfolio';

const { portfolio, loading } = usePortfolio(address, [1, 137, 42161]);
// Returns balances across Ethereum, Polygon, and Arbitrum
```

### Liquidity Pools

Discover and analyze liquidity pools:

```typescript
import { useLiquidityPools } from '@/hooks/domain/useLiquidityPools';

const { pools, loading } = useLiquidityPools({
  chainId: 1,
  sortBy: 'tvl',
  minLiquidity: 100000,
});
```

## Configuration

### Environment Variables

See `.env.example` for all available environment variables. Required variables:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID
- `COVALENT_API_KEY`: Your Covalent API key

### Feature Flags

Enable/disable features in `src/config/features.ts`:

```typescript
export const FEATURE_TOGGLES = {
  enableAnalytics: false,
  enableSentry: false,
  enableNFTs: true,
  enableLiquidity: true,
};
```

## Development

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use NativeWind for styling (not StyleSheet)
- Keep files under 500 lines
- Write comprehensive JSDoc comments

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/my-feature
```

Pre-commit hooks will automatically:
- Format code with Prettier
- Lint with ESLint
- Run type checking

## Deployment

### Docker

```bash
# Build Docker image
docker build -t hyperswap .

# Run container
docker run -p 3000:3000 --env-file .env hyperswap
```

### Docker Compose

```bash
# Development
docker-compose up dev

# Production
docker-compose up app
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hyperswap)

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

## Performance

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Bundle Size**: Optimized with code splitting
- **Lighthouse Score**: 95+

## Security

- Non-custodial architecture
- Client-side only operations
- No private keys stored
- Regular security audits
- Rate limiting on API calls

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- 📚 [Documentation](./docs/)
- 🐛 [Report Bug](https://github.com/yourusername/hyperswap/issues)
- 💡 [Request Feature](https://github.com/yourusername/hyperswap/issues)
- 💬 [Discord](https://discord.gg/hyperswap)
- 🐦 [Twitter](https://twitter.com/hyperswap)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Viem](https://viem.sh/)
- [WalletConnect](https://walletconnect.com/)
- [Covalent](https://www.covalenthq.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

Built with ❤️ by the HyperSwap team
