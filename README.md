# BethNa AI Trader

Autonomous AI options trading system built on Base L2 that integrates with Thetanuts Finance V4.

## Overview

BethNa is a sophisticated multi-agent AI system that autonomously trades options through three specialized AI agents:

- **Agent Alpha**: Quantitative analysis and market backtesting
- **Agent Beta**: On-chain trade execution via smart contracts  
- **Agent Gamma**: Social engagement and public relations

## Features

- 🤖 **Multi-Agent AI System**: Three specialized agents working in coordination
- 📊 **Professional Trading Terminal**: Real-time charts, positions, and agent communications
- ⛓️ **Base L2 Integration**: Built for Base network with Coinbase Smart Wallet support
- 🎯 **Options Trading**: Automated options trading via Thetanuts V4 protocol
- 📱 **Social Integration**: Automated social media posting with trade updates
- 🔒 **Smart Contracts**: Secure on-chain execution with proper risk management

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Blockchain**: viem, wagmi, OnchainKit
- **Testing**: fast-check (Property-Based Testing)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm
- Base network wallet (Coinbase Smart Wallet recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bethna-ai-trader
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
   - Base L2 RPC URLs
   - Contract addresses (when deployed)
   - API keys for external services
   - OnchainKit API key

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── agents/          # AI agent implementations
├── components/      # React components
│   ├── ui/         # Shadcn/UI components
│   └── trading/    # Trading-specific components
├── config/         # Configuration files
├── contracts/      # Smart contract interfaces
├── hooks/          # Custom React hooks
├── providers/      # Context providers
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Environment Variables

See `.env.example` for all required environment variables:

- **Base L2 Configuration**: Chain IDs and RPC URLs
- **Contract Addresses**: SentientTrader and Thetanuts Router contracts
- **API Keys**: Binance, Thetanuts, OpenAI, Twitter, Farcaster
- **OnchainKit**: API key for Coinbase integration

## Development

### Running Tests

```bash
# Run all tests
pnpm test

# Run property-based tests
pnpm test:pbt

# Run with coverage
pnpm test:coverage
```

### Building

```bash
pnpm build
```

### Linting

```bash
pnpm lint
```

## Architecture

The system follows a multi-agent architecture:

1. **Agent Alpha** fetches market data, calculates technical indicators, and generates trading signals
2. **Agent Beta** receives signals and executes trades via smart contracts
3. **Agent Gamma** monitors trade events and creates social media content
4. **Trading Terminal** provides real-time monitoring and control interface

## Smart Contracts

The system interacts with:

- **SentientTrader Contract**: Custom contract for options trading operations
- **Thetanuts V4 Router**: Protocol for options liquidity and execution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

[License information to be added]

## Disclaimer

This software is for educational and research purposes. Trading involves risk and you should never trade with money you cannot afford to lose. The developers are not responsible for any financial losses.