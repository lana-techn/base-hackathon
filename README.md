# BethNa AI Trader

**Autonomous Swarm Agent System** for AI-powered cryptocurrency options trading on Base L2 network with Thetanuts integration.

## 📚 Documentation

For comprehensive project documentation, see:

| Document | Description |
|----------|-------------|
| **[Overview](./docs/Overview.md)** | Complete project documentation (tech stack, architecture, flow, features) |
| **[Financial Advisor Feature](./docs/FINANCIAL_ADVISOR_FEATURE.md)** | Agent Delta docs - AI-powered financial management for beginners |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Production deployment instructions |
| [Git Workflow](./docs/GIT_WORKFLOW.md) | Branching strategy and contribution guide |
| [Real-time Features](./docs/REAL_TIME_FEATURES.md) | WebSocket implementation details |
| [Agent Details](./docs/Agent.md) | Detailed agent documentation |

## 🤖 Swarm Agent Architecture

BethNa AI Trader operates as a **Swarm Agent System** with specialized agents:

- **Agent Alpha** (Market Analysis) - External market data APIs (Binance, CoinGecko)
- **Agent Beta** (Options Trading) - **Thetanuts Network Integration** for options protocols  
- **Agent Gamma** (Blockchain Operations) - **Base Network Integration** for on-chain transactions
- **Agent Delta** (Social Engagement) - Social networks (Twitter/X, Farcaster) for transparency

**Network Flow**: Market Data → Options Analysis → Blockchain Execution → Social Reporting

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** (for frontend)
- **Python** 3.9+ and **uv** (for Agent Alpha backend)
- **Git** for version control

### 1. Clone Repository

```bash
git clone https://github.com/lana-techn/base-hackathon.git
cd base-hackathon/bethna-ai-trader
```

### 2. Environment Setup

Copy and configure environment variables:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```bash
# Base L2 Network Configuration
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_TESTNET_CHAIN_ID=84532
NEXT_PUBLIC_BASE_TESTNET_RPC_URL=https://sepolia.base.org

# API Keys (Required for full functionality)
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_SECRET_KEY=your_binance_secret_key_here
THETANUTS_API_KEY=your_thetanuts_api_key_here

# AI Content Generation (Optional - uses free model)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free

# Social Media Integration (Optional)
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here

# Farcaster Integration (Optional)
NEYNAR_API_KEY=your_neynar_api_key_here
NEYNAR_SIGNER_UUID=your_neynar_signer_uuid_here

# OnchainKit for Wallet Integration (Optional)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Agent Alpha Service URL
NEXT_PUBLIC_AGENT_ALPHA_URL=http://localhost:8000
```

### 3. Install Dependencies

**Frontend (Next.js):**
```bash
pnpm install
```

**Backend (Agent Alpha):**
```bash
cd agent-alpha
uv sync
# or if you don't have uv:
pip install -r requirements.txt
```

## 🖥️ Running the Application

### Method 1: Full Stack (Recommended)

**Terminal 1 - Agent Alpha Backend:**
```bash
cd agent-alpha
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
# or: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Next.js Frontend:**
```bash
pnpm dev:fast
# or: pnpm dev
```

**Access Application:**
- Landing Page: http://localhost:3000
- Trading Dashboard: http://localhost:3000/dashboard
- UI Components Demo: http://localhost:3000/ui-demo
- UI Components Demo: http://localhost:3000/ui-demo
- Agent Alpha API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Method 2: Frontend Only (Mock Data)

If you only want to run the frontend with mock data:

```bash
pnpm dev:fast
```

The application will automatically fallback to mock data when Agent Alpha backend is unavailable.


## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
pnpm dev          # Development server
pnpm dev:fast     # Fast development (no telemetry)
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm test         # Jest tests
pnpm test:pbt     # Property-based tests
pnpm type-check   # TypeScript check
```

**Backend (Agent Alpha):**
```bash
cd agent-alpha
uv run uvicorn main:app --reload    # Development server
uv run pytest                      # Run tests
uv run pytest tests/test_pbt.py    # Property-based tests
```

### Project Structure

```
bethna-ai-trader/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   ├── components/          # React components
│   │   ├── trading/         # Trading terminal components
│   │   ├── landing/         # Landing page components (upcoming)
│   │   ├── dashboard/       # Dashboard components (upcoming)
│   │   └── ui/              # Shadcn/UI components
│   ├── hooks/               # React hooks
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Utility functions
│   └── providers/           # React providers
├── agent-alpha/             # Python FastAPI backend
│   ├── services/            # Business logic services
│   ├── tests/               # Python tests
│   └── main.py              # FastAPI application
├── contracts/               # Solidity smart contracts (upcoming)
└── docs/                    # Documentation
```

## 🔧 Troubleshooting

### Common Issues

**1. Agent Alpha Connection Failed**
```bash
# Check if Agent Alpha is running
curl http://localhost:8000/health

# If not running, start it:
cd agent-alpha
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**2. Frontend Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev:fast
```

**3. Python Dependencies Issues**
```bash
cd agent-alpha
# Using uv (recommended)
uv sync

# Or using pip
pip install -r requirements.txt
```


## 📝 License

Private repository - All rights reserved.

## 🤝 Contributing

This is a private development project. For questions or issues, contact the development team.

---