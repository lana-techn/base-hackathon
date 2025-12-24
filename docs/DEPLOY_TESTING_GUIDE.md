# 🚀 Panduan Deploy & Testing BethNa AI Trader

Dokumentasi lengkap untuk deployment smart contract dan testing Agent Gamma (social media AI).

---

## 📋 Prasyarat

Pastikan sudah terinstall:
- **Node.js** v18+
- **pnpm** (package manager)
- **Foundry** (Forge, Anvil) - untuk smart contract

```bash
# Cek instalasi Foundry
forge --version
anvil --version
```

---

## 🔗 Smart Contract Deployment

### Langkah 1: Jalankan Local Blockchain (Anvil)

Anvil adalah local blockchain dari Foundry untuk testing. Jalankan di terminal terpisah:

```bash
cd /Users/em/web/base-web3/bethna-ai-trader
anvil --port 8545
```

**Output yang diharapkan:**
```
Available Accounts
==================
(0) 0xf39F...
...
Listening on 127.0.0.1:8545
```

### Langkah 2: Compile Smart Contract

```bash
forge build
```

**Penjelasan:** Compile semua contract di folder `contracts/` menghasilkan ABI dan bytecode.

### Langkah 3: Deploy dengan Mock Contracts

Karena Thetanuts Router belum tersedia, kita deploy dengan mock contracts:

```bash
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
forge script contracts/script/Deploy.s.sol:DeployMocks \
  --fork-url http://localhost:8545 \
  --broadcast
```

**Penjelasan Parameter:**
| Parameter | Fungsi |
|-----------|--------|
| `PRIVATE_KEY` | Private key dari Anvil account pertama (untuk testing) |
| `forge script` | Jalankan deployment script |
| `DeployMocks` | Nama contract script yang deploy mock + SentientTrader |
| `--fork-url` | RPC URL blockchain target |
| `--broadcast` | Kirim transaksi ke blockchain |

### Hasil Deployment

| Contract | Address |
|----------|---------|
| MockUSDC | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| MockThetanutsRouter | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| MockCallOption | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| MockPutOption | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| **SentientTrader** | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |

---

## 🤖 Testing Agent Gamma (Tweet Generator)

Agent Gamma adalah AI yang generate konten tweet untuk trading updates.

### Langkah 1: Jalankan Dev Server

```bash
cd /Users/em/web/base-web3/bethna-ai-trader
pnpm dev
```

Server berjalan di `http://localhost:3000`

### Langkah 2: Test API Generate Tweet

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "action": "post",
    "agent": "GAMMA",
    "marketData": {
      "symbol": "ETH",
      "price": 3500.00,
      "high24h": 3600.00,
      "low24h": 3400.00,
      "volume24h": 1000000,
      "change24h": 50,
      "changePercent24h": 1.45
    }
  }'
```

**Penjelasan Parameter:**
| Parameter | Fungsi |
|-----------|--------|
| `action: "post"` | Mode generate social post |
| `agent: "GAMMA"` | Gunakan Agent Gamma (social specialist) |
| `marketData` | Data market untuk konteks tweet |

### Contoh Response

```json
{
  "success": true,
  "data": {
    "post": "🚀 ETH at $3,500, up 1.45% in 24h. Bulls reclaiming momentum... #ETH #Crypto #Trading #bethnaAITrader"
  }
}
```

---

## 📂 Struktur File Penting

```
bethna-ai-trader/
├── contracts/
│   ├── SentientTrader.sol      # Smart contract utama
│   └── script/Deploy.s.sol     # Script deployment
├── src/
│   ├── lib/
│   │   ├── ai-agents.ts        # Agent Gamma & Alpha
│   │   └── openrouter.ts       # AI API client
│   └── app/api/ai/chat/        # API endpoint
└── foundry.toml                # Foundry config
```

---

## ⚙️ Environment Variables

⚠️ **PENTING**: File `.env.local` sudah ada di `.gitignore` - API keys TIDAK akan terpush ke Git!

Buat file `.env.local` dengan:

```env
# AI untuk generate content
OPENROUTER_API_KEY=your_openrouter_api_key

# Base Network
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Twitter API (untuk posting)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret

# Farcaster (untuk posting via Direct Hub)
FARCASTER_FID=your_fid_number
FARCASTER_PRIVATE_KEY=your_ed25519_private_key
OPTIMISM_PRIVATE_KEY=your_custody_wallet_private_key
```

---

## 🐦 Twitter Integration

Twitter posting sudah terintegrasi dan LIVE!

### API Endpoint

```bash
# Test Twitter endpoint
curl -X POST http://localhost:3000/api/twitter/post \
  -H "Content-Type: application/json" \
  -d '{"generateFromMarket":{"symbol":"ETH","price":3500,"changePercent24h":1.5}}'
```

### Setup Twitter API Keys

1. Buka https://developer.twitter.com
2. Buat project/app baru
3. Settings → User authentication → **Read and write** permissions
4. Generate Access Token dan Secret
5. Tambahkan ke `.env.local`

---

## 💜 Farcaster Integration (Direct Hub)

Posting langsung ke Farcaster tanpa Neynar (gratis!).

### Langkah 1: Generate Signer Key

```bash
npx tsx scripts/generate-farcaster-key.ts
```

### Langkah 2: Dapatkan Private Key Custody Address

1. Buka Warpcast → Settings → Advanced → Recovery Phrase
2. Buka https://iancoleman.io/bip39/
3. Masukkan recovery phrase, set ke ETH
4. Copy private key dari address pertama

### Langkah 3: Register Key On-Chain

Butuh sedikit ETH di Optimism (~$0.50) untuk gas.

```bash
npx tsx scripts/register-farcaster-key.ts
```

### Langkah 4: Test Posting

```bash
curl -X POST http://localhost:3000/api/farcaster-hub/post \
  -H "Content-Type: application/json" \
  -d '{"generateFromMarket":{"symbol":"ETH","price":3500,"changePercent24h":1.5}}'
```

---

## 🌐 Deploy ke Mainnet/Testnet

Untuk deploy ke Base Mainnet/Sepolia, update address di `Deploy.s.sol`:

```solidity
// Dapatkan dari Thetanuts docs
address constant THETANUTS_ROUTER_MAINNET = 0x...;
```

Kemudian:

```bash
# Base Sepolia (Testnet)
forge script contracts/script/Deploy.s.sol:DeploySentientTrader \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify

# Base Mainnet
forge script contracts/script/Deploy.s.sol:DeploySentientTrader \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

---

## 🔒 Keamanan

- ✅ `.env.local` di-exclude dari Git via `.gitignore`
- ⚠️ JANGAN commit file yang berisi API keys
- ⚠️ JANGAN share private keys
- ✅ Gunakan environment variables di Vercel untuk production

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `OpenRouter API key not configured` | Set `OPENROUTER_API_KEY` di `.env.local` |
| `Thetanuts Router address not set` | Dapatkan address dari Thetanuts docs |
| `anvil: command not found` | Install Foundry: `curl -L https://foundry.paradigm.xyz \| bash` |
| Twitter 403 error | Cek app permissions → harus "Read and write" |
| Farcaster insufficient balance | Kirim ETH ke custody address di Optimism |

