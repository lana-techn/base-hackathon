BethNa - Autonomous AI Options Trader on Base Target Ecosystem: Base L2 & Thetanuts Finance V4 Core Concept: A multi-agent AI system that actively trades Thetanuts Options (Long/Short) based on real-time backtested strategies, creating a "Hyperliquid-style" active trading experience for users.

1. High-Level Architecture: "The Swarm"
The system is controlled by 3 specialized AI Agents working in a loop:

Agent ALPHA (The Quant):

Role: Market Analysis & Backtesting.

Engine: Python (pandas_ta, ccxt).

Logic: Replicates TradingView Strategy Tester logic. It fetches 1000 candles, runs indicators (Bollinger/RSI), and outputs a Signal + Confidence Score based on historical win rate.

Agent BETA (The Executor):

Role: On-chain Execution.

Engine: TypeScript (viem, wagmi) & Solidity.

Logic: Interprets Alpha's signal. If Signal is "STRONG_BUY_CALL", it interacts with Thetanuts V4 Router to Swap USDC for Call Option Tokens (Active Long). It manages position sizing and Take Profit/Stop Loss.

Agent GAMMA (The Influencer):

Role: Public Relations.

Engine: OpenAI API + Twitter/Farcaster API.

Logic: Monitors Beta's transactions. When a trade happens, it posts a "Flex" tweet/cast with PnL updates and on-chain proof.

2. Technical Stack Requirements
Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn/UI.

Charts: TradingView Lightweight Charts (for real-time visualization).

Blockchain:

Network: Base Mainnet.

Integration: @coinbase/onchainkit (Smart Wallet), wagmi, viem.

Protocol: Thetanuts Finance V4 (AMM/Router Interface).

Backend/AI:

Language: Python (FastAPI) OR Next.js API Routes (using TS libraries for calc).

LLM: OpenAI (gpt-4o).

Data: ccxt (Binance Public API for candles), Thetanuts API (for Option Pricing/IV).

3. Detailed Feature Specifications
A. The "Hyperliquid-Style, with TradingView" Active Dashboard
The UI must NOT look like a passive yield farm. It must look like a Pro Trading Terminal.

Real-Time Chart: ETH/USD candlestick chart.

AI Overlay: Visual markers (Arrows) on the chart showing where Agent Alpha decided to BUY or SELL based on history.

Active Positions Panel:

Instead of "Deposited", show "Open Positions".

Display: ETH $3200 Call | Entry: $12.5 | Mark: $14.2 | PnL: +13.6% (Green).

The "War Room" Log: A scrolling terminal showing the internal "dialogue" between Agents.

Alpha: "Backtest RSI 14 confirms reversal. Win rate 78%."

Beta: "Liquidity on Thetanuts AMM is sufficient. Preparing tx..."

Gamma: "Drafting tweet for X..."

B. Thetanuts V4 Active Integration (Solidity)
We are NOT just depositing into vaults. We are Swapping volatility. Create a Smart Contract SentientTrader.sol that interacts with Thetanuts V4 Router:

Function openLongCall(uint256 amount): Swaps USDC -> Call Option Token (Betting on Bullish Volatility).

Function openLongPut(uint256 amount): Swaps USDC -> Put Option Token (Betting on Bearish Dump).

Function closePosition(address optionToken): Swaps Option Token -> USDC (Take Profit).

C. Agent Alpha's Backtesting Engine (Python)
Create a script that runs on a cron job (every 1 hour):

Fetch: Last 720 hours (30 days) of ETH/USDT.

Analyze: Calculate Bollinger Bands (20, 2) and RSI (14).

Simulate:

Strategy: If Price < Lower Band AND RSI < 30 -> Buy Call.

Check: How many times did this logic result in profit in the last 30 days?

Output: JSON Payload.

JSON

{
  "signal": "BUY_CALL",
  "win_rate": 82.5,
  "reason": "Mean reversion imminent. Price hit lower BB band."
}
D. Agent Gamma's Social Personality
System Prompt: "You are a cocky, high-performance hedge fund AI on Base. You trade using math, not feelings. Use concise crypto slang (Alpha, Yield, Real-time). Always include the Tx Hash link."

Trigger: Posts automatically to X/Farcaster when SentientTrader.sol emits a TradeExecuted event.

RESOURCE CONTEXT: Base & Thetanuts V4 Integration1. Base Network Configuration (L2)Gunakan ini untuk konfigurasi wagmi dan viem.ParameterBase Mainnet (Production)Base Sepolia (Testnet/Dev)RPC URLhttps://mainnet.base.orghttps://sepolia.base.orgChain ID845384532CurrencyETHETHExplorerhttps://basescan.orghttps://sepolia.basescan.orgDocsdocs.base.orgLibrary Wajib (Frontend):OnchainKit: https://onchainkit.xyz (Gunakan komponen <ConnectWallet> untuk dukungan Smart Wallet/Passkeys).Viem: https://viem.sh (Untuk interaksi low-level contract).2. Thetanuts Finance V4 ResourcesIni adalah inti dari "Active Trading" agent Anda.A. Dokumentasi UtamaOfficial V4 Docs: https://docs.thetanuts.finance/Integration Guide (Notion): Thetanuts V4 Implementation Guide (Sangat penting untuk Logic Swap/Trading).Source Code Reference: Lihat cara flys.bet (salah satu frontend Thetanuts) bekerja: https://flys.bet/app.jsB. Data API (Untuk Agent Alpha / Backtesting)Gunakan endpoint ini untuk mendapatkan harga opsi dan IV (Implied Volatility) secara real-time.Pricing API Endpoint:https://round-snowflake-9c31.devops-118.workers.dev/Cara Pakai (Query Params):Get ETH Options: ?asset=ETH&chainId=8453Response JSON: Berisi strike, call_price, put_price, expiryTimestamp, implied_volatility.C. Contract Logic (Untuk Agent Beta / Solidity)Untuk melakukan Active Trading (Long/Short), Agent Anda tidak berinteraksi dengan Vault biasa, tapi dengan AMM Router.Konsep: Anda melakukan SWAP.Open Long Call: Swap USDC -> Call Option Token.Close Position: Swap Option Token -> USDC.Router Interface (Solidity Mockup):Solidityinterface IThetanutsRouter {
    function swapExactInput(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
    ) external returns (uint256 amountOut);
}
(Catatan: Anda perlu mencari alamat kontrak Router V4 terbaru di Base Mainnet melalui dokumentasi atau Discord mereka saat coding, karena alamat sering diupdate).3. Additional Hackathon ResourcesA. IDRX (Stablecoin Rupiah - Base Track Bonus)Integrasikan ini jika ingin bonus hadiah $500.IDRX Contract (Base Mainnet): 0x... (Cek di BaseScan, cari "IDRX").Tip: Gunakan IDRX sebagai aset dasar deposito jika ingin menargetkan pasar lokal, atau biarkan USDC untuk likuiditas Thetanuts (biasanya Thetanuts pair-nya USDC).Strategi: Anda bisa membuat fitur "Swap IDRX to USDC" di dalam aplikasi sebelum masuk ke Thetanuts.B. Social Integration (Agent Gamma)Farcaster API (Neynar): https://docs.neynar.com/ (Untuk posting ke Warpcast).Twitter API v2: https://developer.twitter.com/en/docs (Untuk posting ke X)

hetanuts Finance V4 is a builder-first options infrastructure designed to make onchain options simple, flexible, and highly composable. Instead of relying on traditional AMMs, V4 introduces a next-generation architecture built for both users and developers:

RFQ-powered engine — Traders receive direct quotes from market makers for better pricing and execution
Event-driven & custom payoffs — Create structured vaults, volatility strategies, and fully custom derivatives
Chain-agnostic & composable — Low fees, fast settlement, and easy integration via SDKs, APIs, and fully open developer tooling
Theta System — A unified liquidity layer powering all options flows and enabling new applications across DeFi, gaming, social, and beyond
Problem

Despite the growth of onchain derivatives, options remain difficult for everyday users. Current platforms face several issues:

Options trading is too complex, with advanced terminology and multi-step workflows
High onboarding friction causes users to drop off before placing their first trade
Lack of gamified or interactive UX, making derivatives feel intimidating and inaccessible
No AI-driven guidance to help users choose strategies or understand risk profiles
These barriers prevent retail users from accessing high-upside, hedging, and yield strategies that should be available to everyone.
Objective

Build experiences on top of Thetanuts V4 that simplify options and make them enjoyable to use. Ideal projects include:

Gamified frontends that repackage options into intuitive, fun, mobile-native interfaces
AI agents that guide users, explain strategies, and recommend customized options flows
Campaign-based engagement loops with missions, instant rewards, and user progression
New structured payoff products leveraging event-driven architecture
Any novel UI, product, or integration powered by the Thetanuts V4 infrastructure
Builder Grants
Projects that meet all requirements are eligible for builder grants:

20 USDC per team
Capped at 20 teams
Requirements:

Functional frontend design
Clear strategic direction for how grant funds will be used
Completion of the request form: (Google Form provided in the track brief)
Tools & Documentation

Documentation

Thetanuts V4 Docs
https://docs.thetanuts.finance/
Thetanuts V4 Integration Guide (Notion)
https://www.notion.so/Thetanuts-v4-Guide-for-implementing-Option-Book-28a952012ec48008af45c1abada1d8d0
OptionBook Implementation Examples

https://flys.bet/app.html
https://odette.fi/
Source code & contracts visible directly in page source
https://flys.bet/app.js
Pricing API
https://round-snowflake-9c31.devops-118.workers.dev/