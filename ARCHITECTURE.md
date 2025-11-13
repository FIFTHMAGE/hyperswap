# Architecture Overview

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS + NativeWind
- **Wallet**: WalletConnect v2 / Reown AppKit
- **Data**: Covalent/GoldRush API
- **Animations**: Framer Motion
- **State**: React hooks + Wagmi

## Project Structure

```
/app                 # Next.js pages
/components          # React components
  /ui               # Reusable UI components
  /wallet           # Wallet connection
  /wrapped          # Wrapped cards
/lib
  /analytics        # Data processing
  /api              # API clients
  /cache            # Caching layer
  /constants        # Static data
  /monitoring       # Error tracking
  /security         # Security utilities
  /social           # Sharing features
  /types            # TypeScript types
  /utils            # Helper functions
/hooks              # Custom React hooks
/public             # Static assets
```

## Data Flow

1. User connects wallet
2. Fetch transactions via Covalent API
3. Process data with analytics engine
4. Generate wrapped statistics
5. Display animated story cards
6. Enable sharing functionality

## Key Components

- **WalletProvider**: Manages wallet state
- **StoryCard**: Base card component
- **StoryNavigator**: Card navigation
- **Analytics Processor**: Data transformation
- **Cache Layer**: Request optimization

## Performance Optimizations

- Request caching
- Request deduplication
- Image lazy loading
- Code splitting
- Service worker

