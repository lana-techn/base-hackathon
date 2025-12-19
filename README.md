# BethNa AI Trader

**Autonomous Swarm Agent System** for AI-powered cryptocurrency options trading on Base L2 network with Thetanuts integration.

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

## 📊 Application Features

### Current Features (Completed Tasks 1-2, 8.1-8.7)

- ✅ **Modern Web3 UI** - Next.js 14 with TypeScript and Tailwind CSS
- ✅ **Real-time Trading Terminal** - Live market data and AI signals
- ✅ **Agent Alpha Integration** - Market analysis with technical indicators
- ✅ **Wallet Connection** - OnchainKit integration for Base network
- ✅ **Data Models & Validation** - TypeScript interfaces with property-based testing
- ✅ **War Room Log** - Real-time agent communication display
- ✅ **Modern Web3 Design System** - Glassmorphism, GSAP animations, Framer Motion
- ✅ **Landing Page** - Hero section with parallax scroll and Bento Grid layouts
- ✅ **AI Agents Showcase** - Interactive agent cards with live stats
- ✅ **Floating Navigation** - Modern Web3 navigation with wallet integration
- ✅ **Micro-interactions** - Smooth animations and hover effects

### Upcoming Features (Tasks 3-13)

- 🔄 **Agent Alpha Enhancement** - Full Python FastAPI service with Binance integration
- 🔄 **Smart Contracts** - SentientTrader contract for Thetanuts V4 integration
- 🔄 **Agent Beta** - Options trading engine with Thetanuts network
- 🔄 **Agent Gamma** - Base L2 blockchain operations and position tracking
- 🔄 **Agent Delta** - Social media automation (Twitter/X, Farcaster)
- 🔄 **Modern Web3 Design** - Aceternity UI, GSAP animations, glassmorphism
- 🔄 **Landing Page** - Hero section with parallax scroll and Bento Grid
- 🔄 **Trading Dashboard** - Advanced charts and position management

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

**4. Wallet Connection Issues**
- Ensure you have a Web3 wallet installed (MetaMask, Coinbase Wallet)
- Switch to Base network (Chain ID: 8453)
- Check NEXT_PUBLIC_ONCHAINKIT_API_KEY in .env.local

### Environment Variables Status

**✅ Already Configured:**
- OpenRouter AI API (free model)
- Twitter API credentials
- Farcaster/Neynar API credentials

**⚠️ Need Configuration:**
- `BINANCE_API_KEY` & `BINANCE_SECRET_KEY` - For real market data
- `THETANUTS_API_KEY` - For options trading
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - For enhanced wallet features
- Contract addresses (will be added after deployment)

## 🚨 Disclaimer

This is an autonomous swarm agent system that operates across multiple blockchain networks and external services. Users should understand the risks involved in automated trading:

- **Financial Risk**: Automated trading can result in significant losses
- **Smart Contract Risk**: Unaudited contracts may contain vulnerabilities  
- **Network Risk**: Blockchain networks may experience downtime or congestion
- **API Risk**: External services may become unavailable

**Use at your own risk. This is experimental software.**

## 📝 License

Private repository - All rights reserved.

## 🤝 Contributing

This is a private development project. For questions or issues, contact the development team.

---

**Next Steps:**
1. Configure required API keys in `.env.local`
2. Run both frontend and backend servers
3. Test wallet connection on Base network
4. Monitor War Room Log for agent communications

**Current Status:** Tasks 1-2, 8.1-8.7 completed ✅ | Task 3+ in development 🔄

## 🎨 Modern Web3 Design Features

### Glassmorphism Design System
- **Glass Cards** - Backdrop blur effects with subtle transparency
- **Floating Navigation** - Auto-hiding navigation with smooth animations
- **Theme System** - Consistent color palette and design tokens
- **Micro-interactions** - Hover effects, scale animations, and smooth transitions

### GSAP & Framer Motion Animations
- **Parallax Scrolling** - Multi-layer scrolling effects on landing page
- **Typewriter Effect** - Animated text for hero section
- **Stagger Animations** - Sequential element animations
- **Smooth Scroll** - Lenis integration for buttery smooth scrolling

### Bento Grid Layouts
- **Responsive Grid System** - Adaptive layouts for different screen sizes
- **Dynamic Sizing** - Components with flexible column/row spans
- **Interactive Cards** - Hover effects and animated counters
- **Modern Spacing** - Consistent gaps and padding throughout

### Component Library
- **Reusable Components** - Modular design system components
- **TypeScript Support** - Full type safety across all components
- **Accessibility** - ARIA labels and keyboard navigation support
- **Performance Optimized** - Lazy loading and efficient animations

### Shadcn/UI Components (Enhanced with Glassmorphism)
- **Button** - Multiple variants (default, glass, outline, glow) with animations
- **Input** - Glass and default variants with focus states
- **Select** - Dropdown with glassmorphism styling
- **Switch** - Toggle component with smooth transitions
- **Progress** - Animated progress bars with gradient fills
- **Toast** - Notification system with multiple variants
- **Alert Dialog** - Modal dialogs with backdrop blur
- **Popover** - Floating content with glassmorphism
- **Label** - Form labels with consistent styling
- **Separator** - Divider lines with transparency
- **Card** - Enhanced with glass variants and animations

### Shadcn/UI Components (Enhanced with Glassmorphism)
- **Button** - Multiple variants (default, glass, outline, glow, etc.)
- **Input & Label** - Form components with glass styling
- **Select** - Dropdown with backdrop blur effects
- **Switch** - Toggle component with smooth animations
- **Progress** - Gradient progress bars
- **Toast** - Notification system with multiple variants
- **Alert Dialog** - Modal dialogs with glassmorphism
- **Popover** - Floating content with backdrop blur
- **Separator** - Divider components
- **Card** - Enhanced with glass variants and animations