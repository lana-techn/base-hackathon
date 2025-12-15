# Base Web3 - Sentient Trader

A comprehensive Web3 trading platform combining AI agents, smart contracts, and real-time market analysis.

## Project Structure

```
base-web3/
├── bethna-ai-trader/          # Main project directory
│   ├── agent-alpha/           # Python AI trading agent
│   ├── contracts/             # Solidity smart contracts
│   ├── src/                   # Next.js frontend
│   ├── public/                # Static assets
│   └── scripts/               # Utility scripts
├── Agent.md                   # Agent documentation
└── NEYNAR.md                  # Neynar integration guide
```

## Components

### 1. Smart Contracts (`contracts/`)
- **SentientTrader.sol** - Main trading contract
- Integrations with Thetanuts Router and ERC20 tokens
- Test suite with fuzzing capabilities

### 2. Python Agent (`agent-alpha/`)
- Trading indicators and signals
- Binance market data integration
- Service-based architecture for modularity

### 3. Frontend (`src/`)
- Next.js-based web interface
- Wagmi integration for Web3 connectivity
- Farcaster integration for social features
- Trading components and UI

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Foundry (for Solidity development)

### Installation

```bash
cd bethna-ai-trader

# Install dependencies
pnpm install

# Python dependencies
cd agent-alpha
pip install -r requirements.txt
```

### Development

```bash
# Run Next.js dev server
pnpm dev

# Run tests
pnpm test

# Run Python tests
cd agent-alpha
pytest
```

## Configuration

- **Contracts**: See [contracts/](bethna-ai-trader/contracts/)
- **Agent**: See [agent-alpha/README.md](bethna-ai-trader/agent-alpha/README.md)
- **Web3 Config**: See [src/config/](bethna-ai-trader/src/config/)

## Documentation

- [Agent Documentation](Agent.md)
- [Neynar Integration](NEYNAR.md)
- [Agent Alpha README](bethna-ai-trader/agent-alpha/README.md)

## License

See individual component licenses in respective directories.
