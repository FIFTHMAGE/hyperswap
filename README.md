# 🎁 Wallet Wrapped

Your Year On-Chain - A beautiful, Spotify Wrapped-style year-in-review for your crypto wallet.

## ✨ Features

- 🔗 **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, Optimism, Base
- 💰 **Comprehensive Stats**: Transactions, gas spent, tokens, NFTs, and DeFi activity
- 🎨 **Beautiful UI**: Full-screen story cards with smooth animations
- 🔐 **WalletConnect Integration**: Secure wallet connection with Reown AppKit
- 📊 **Real-Time Data**: Powered by Covalent GoldRush API
- 📱 **Shareable**: Download and share your wrapped stats

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com))
- A Covalent API Key ([Get one here](https://www.covalenthq.com/))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables template:

```bash
cp env.example .env.local
```

4. Fill in your API keys in `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
COVALENT_API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with NativeWind
- **Animations**: Framer Motion
- **Wallet**: WalletConnect v2 / Reown AppKit
- **Blockchain**: Wagmi + Viem
- **Data**: Covalent GoldRush API

## 📁 Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── wrapped/           # Wrapped experience page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── wallet/           # Wallet connection components
│   └── wrapped/          # Wrapped story cards
├── lib/                   # Core logic
│   ├── api/              # API client
│   ├── analytics/        # Data processing
│   ├── constants/        # Configuration
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
└── public/               # Static assets
```

## 📄 License

MIT

## 🙏 Acknowledgments

- Inspired by Spotify Wrapped
- Powered by Covalent, WalletConnect, and the Web3 community
