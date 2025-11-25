# HyperSwap

Advanced DEX aggregator and swap interface for seamless cryptocurrency trading across multiple protocols.

## Features

- **Smart Routing**: Automatically finds the best swap routes across multiple DEXs
- **Multi-Protocol Support**: Integrates with Uniswap V2/V3, Sushiswap, and more
- **Cross-Chain Swaps**: Bridge assets between different blockchain networks
- **Portfolio Tracking**: Monitor your assets and performance
- **Advanced Orders**: Limit orders, stop-loss, and DCA strategies
- **Liquidity Management**: Provide and manage liquidity positions
- **Price Alerts**: Get notified when tokens hit target prices
- **Referral System**: Earn rewards by referring users

## Technology Stack

- **Frontend**: React Native with Expo
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Web3**: Ethers.js, Viem, Wagmi
- **Data Fetching**: TanStack Query (React Query)
- **Navigation**: React Navigation
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hyperswap

# Install dependencies
npm install
```

### Running the App

```bash
# Start development server
npm run dev

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Project Structure

```
hyperswap/
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-based modules
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── services/         # API and blockchain services
│   ├── constants/        # App constants
│   └── types/            # TypeScript type definitions
├── App.tsx               # Main app component
└── package.json
```

## Features in Detail

### Swap Engine

- Real-time price quotes from multiple DEXs
- Slippage protection
- Gas estimation
- Price impact calculation
- MEV protection

### Portfolio

- Multi-chain asset tracking
- P&L analysis
- Transaction history
- Performance metrics

### Liquidity Pools

- Add/remove liquidity
- LP token management
- Impermanent loss calculator
- Fee earnings tracker

### Advanced Trading

- Limit orders
- Stop-loss orders
- Dollar-cost averaging (DCA)
- Order management

### Analytics

- Trading volume charts
- Price history
- Market depth
- Token analytics

## Configuration

### Environment Variables

Create a `.env` file:

```
API_BASE_URL=https://api.example.com
WALLET_CONNECT_PROJECT_ID=your_project_id
SUPPORTED_CHAINS=1,137,56,42161
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## Building

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios

# Build for Web
npm run build:web
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Security

- Smart contract interactions are thoroughly validated
- Private keys are never stored
- All API calls use HTTPS
- Regular security audits performed

## Support

For issues and questions:

- Open a GitHub issue
- Join our Discord community
- Check our documentation

## License

MIT License - see LICENSE file for details

## Smart Contracts

### Deployed Contracts

#### HyperSwap
- **Type**: dex
- **Network**: Base Sepolia
- **Address**:   [`[0;34m[INFO][0m Deploying HyperSwap to Base Sepolia...
[1;33m[WARNING][0m Deployment failed or simulated.`](https://sepolia.basescan.org/address/[0;34m[INFO][0m Deploying HyperSwap to Base Sepolia...
[1;33m[WARNING][0m Deployment failed or simulated.)
- **Owners**: 
  - `0x21b805BBC4bfFA7769868BF7f488D77b71756d3E`
  - `0x748876944621F3908CECAfb8f1a4354257b3AADf`
- **Deployment Date**: 2025-11-25

