# BethNa AI Trader

Autonomous AI options trading system built on Base L2 that integrates with Thetanuts Finance V4.

## 🚀 Features

- **Agent Alpha**: Quantitative analysis and backtesting with technical indicators
- **Agent Beta**: On-chain trade execution via smart contracts  
- **Agent Gamma**: Social media engagement and content generation
- **Professional Trading Terminal**: Real-time dashboard with TradingView integration
- **Base L2 Integration**: Native support for Base network and Coinbase Smart Wallet

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Blockchain**: Base L2, viem, wagmi, OnchainKit
- **Backend**: Python FastAPI (Agent Alpha)
- **Testing**: Jest, fast-check (Property-Based Testing)
- **APIs**: Binance, Thetanuts V4, OpenAI, Twitter/X, Farcaster

## 📋 Prerequisites

Before running the application, make sure you have:

- **Node.js** 18+ and **pnpm** installed
- **Python** 3.8+ and **pip** installed
- **Git** for version control
- **Base network** access (Mainnet or Testnet)

## 🔧 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/lana-techn/base-hackathon.git
cd base-hackathon/bethna-ai-trader
```

### 2. Frontend Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local
```

### 3. Environment Configuration

Edit `.env.local` with your API keys and configuration:

```bash
# Required - Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_TESTNET_RPC_URL=https://sepolia.base.org

# Required - OnchainKit (Get from Coinbase Developer Platform)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key_here

# Required - Agent Alpha Service
NEXT_PUBLIC_AGENT_ALPHA_URL=http://localhost:8000

# Optional - Contract Addresses (will be deployed later)
NEXT_PUBLIC_SENTIENT_TRADER_CONTRACT=0x...
NEXT_PUBLIC_THETANUTS_ROUTER_CONTRACT=0x...

# Optional - API Keys for full functionality
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_SECRET_KEY=your_binance_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
TWITTER_API_KEY=your_twitter_api_key_here
NEYNAR_API_KEY=your_neynar_api_key_here
```

### 4. Backend Setup (Agent Alpha)

Agent Alpha sudah tersedia di direktori `agent-alpha/` dengan struktur lengkap:

```bash
# Navigate to agent-alpha directory
cd agent-alpha

# Install uv (modern Python package manager) if not installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv sync

# Alternative: Using traditional pip
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

**Agent Alpha Structure:**
```
agent-alpha/
├── main.py              # FastAPI application
├── services/            # Business logic modules
│   ├── binance.py      # Binance API integration
│   ├── indicators.py   # Technical indicators
│   └── signals.py      # Signal generation logic
├── tests/              # Test suite
├── requirements.txt    # Dependencies
└── README.md          # Service documentation
```

## 🚀 Running the Application

### 1. Start Agent Alpha (Backend)

```bash
# Navigate to agent-alpha directory
cd agent-alpha

# Option 1: Using uv (recommended)
uv run uvicorn main:app --reload --port 8000

# Option 2: Using traditional Python
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
python main.py

# Option 3: Using uvicorn directly
uvicorn main:app --reload --port 8000
```

Agent Alpha will be available at: `http://localhost:8000`

**Available Endpoints:**
- `GET /health` - Health check
- `GET /candles` - Historical candlestick data
- `GET /indicators` - Current technical indicators  
- `GET /analyze` - Full market analysis with trading signal
- `GET /signal` - Quick trading signal

### 2. Start Frontend

```bash
# In bethna-ai-trader directory
cd bethna-ai-trader
pnpm dev
```

Frontend will be available at: `http://localhost:3000`

## 🔑 Getting API Keys

### ✅ Required APIs (untuk basic functionality):

1. **OnchainKit API Key** (Required for wallet connection)
   - Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Create account and get API key
   - Add to `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

### 🔧 Optional APIs (untuk full functionality):

2. **Binance API** (for real market data - tanpa ini akan pakai mock data)
   - Go to [Binance API](https://www.binance.com/en/binance-api)
   - Create API key with **read-only permissions**
   - Add to `BINANCE_API_KEY` and `BINANCE_SECRET_KEY`
   - **Note**: Tanpa API ini, Agent Alpha akan tetap berjalan dengan mock data

3. **OpenRouter API** (for AI content generation)
   - Go to [OpenRouter](https://openrouter.ai/)
   - Get API key for free model access: `kwaipilot/kat-coder-pro:free`
   - Add to `OPENROUTER_API_KEY`

4. **Twitter API** (for social posting)
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Create app and get API keys
   - Add to `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET`

5. **Neynar API** (for Farcaster posting)
   - Go to [Neynar](https://neynar.com/)
   - Get API key for Farcaster integration
   - Add to `NEYNAR_API_KEY` and `NEYNAR_SIGNER_UUID`

### 🚀 Quick Start (Minimal Setup)

Untuk menjalankan aplikasi dengan cepat, Anda hanya perlu:

1. **OnchainKit API Key** - untuk wallet connection
2. **Sisanya optional** - aplikasi akan berjalan dengan mock data

```bash
# Minimal .env.local setup
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key_here
NEXT_PUBLIC_AGENT_ALPHA_URL=http://localhost:8000

# Optional - untuk real market data
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_SECRET_KEY=your_binance_secret_key_here
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run property-based tests only
pnpm test:pbt

# Run tests in watch mode
pnpm test:watch
```

## 📁 Project Structure

```
bethna-ai-trader/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── trading/         # Trading terminal components
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── providers/           # Context providers
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── config/              # Configuration files
├── agent-alpha/             # Python backend service
│   ├── services/            # Business logic modules
│   ├── tests/               # Test suite
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── .kiro/specs/             # Feature specifications
└── README.md                # This file
```

## 🔧 Development Workflow

1. **Frontend Development**: Use `pnpm dev` for hot reload
2. **Backend Development**: Use `python main.py` with auto-reload
3. **Testing**: Run `pnpm test` before committing
4. **Linting**: Use `pnpm lint` to check code quality

## 🚨 Troubleshooting

### Common Issues:

1. **Agent Alpha 500 Errors**: 
   ```bash
   # Check if service is running
   curl http://localhost:8000/health
   
   # If not running, start it:
   cd agent-alpha
   uv run uvicorn main:app --reload --port 8000
   ```

2. **Wallet Connection Issues**: 
   - Verify OnchainKit API key is set in `.env.local`
   - Check browser console for connection errors
   - Make sure you're on a supported network (Base)

3. **Hydration Errors**: 
   - Already fixed in current version
   - If still occurring, clear browser cache

4. **Build Errors**: 
   ```bash
   # Clean install
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

5. **Python Dependencies Issues**:
   ```bash
   # Using uv (recommended)
   cd agent-alpha
   uv sync
   
   # Or traditional pip
   pip install -r requirements.txt
   ```

### Debug Commands:

```bash
# Check Agent Alpha health
curl http://localhost:8000/health

# Test market data endpoint
curl "http://localhost:8000/indicators?symbol=ETH/USDT"

# Check frontend build
pnpm build

# Run tests
pnpm test
cd agent-alpha && uv run pytest -v
```

### Environment Variables Check:

```bash
# Check if required env vars are set
echo $NEXT_PUBLIC_ONCHAINKIT_API_KEY
echo $NEXT_PUBLIC_AGENT_ALPHA_URL

# In agent-alpha directory, check Python env
cd agent-alpha
echo $BINANCE_API_KEY  # Optional
```

## 📝 Next Steps

1. **Deploy Agent Alpha**: Set up production Python service
2. **Smart Contract Deployment**: Deploy SentientTrader contract to Base
3. **API Integration**: Add real Thetanuts V4 integration
4. **Social Features**: Implement Agent Gamma social posting
5. **Testing**: Add more comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details