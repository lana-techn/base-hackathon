# 🚀 Deployment Guide - BethNa AI Trader

## Deployment Options

### Option 1: Vercel (Recommended for MVP)

#### ✅ **Frontend + API Routes on Vercel**

**Pros:**
- Single platform deployment
- Automatic HTTPS and CDN
- Built-in environment variables
- Zero-config deployment
- Free tier available

**Cons:**
- Serverless functions have cold starts
- 10-second execution limit
- Limited to simple API operations

#### 📋 **Vercel Deployment Steps:**

1. **Prepare Repository**
   ```bash
   # Ensure all files are committed
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from project root
   cd bethna-ai-trader
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   ```bash
   # Required
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_BASE_TESTNET_RPC_URL=https://sepolia.base.org
   
   # Optional (for enhanced functionality)
   BINANCE_API_KEY=your_binance_api_key
   BINANCE_SECRET_KEY=your_binance_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Custom Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Configure DNS records

#### 🔧 **Vercel Configuration**

The project includes `vercel.json` with optimized settings:
- Next.js framework detection
- Environment variable mapping
- Build optimization
- API routes configuration

---

### Option 2: Hybrid Deployment (Production Ready)

#### 🏗 **Frontend: Vercel + Backend: Railway/Render**

**Best for production with full Agent Alpha functionality**

#### **Frontend on Vercel:**
```bash
# Same as Option 1
vercel --prod
```

#### **Backend on Railway:**

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Connect GitHub repository

2. **Deploy Agent Alpha**
   ```bash
   # Railway will auto-detect Python and use:
   # - requirements.txt for dependencies
   # - main.py as entry point
   # - Port 8000 (configured automatically)
   ```

3. **Environment Variables on Railway**
   ```bash
   BINANCE_API_KEY=your_binance_api_key
   BINANCE_SECRET_KEY=your_binance_secret_key
   PORT=8000
   ```

4. **Update Frontend Environment**
   ```bash
   # In Vercel dashboard, update:
   NEXT_PUBLIC_AGENT_ALPHA_URL=https://your-railway-app.railway.app
   ```

#### **Backend on Render (Alternative):**

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Connect GitHub repository

2. **Create Web Service**
   - Root directory: `agent-alpha`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

### Option 3: Full Cloud Deployment

#### ☁️ **Enterprise Setup**

**Frontend:** Vercel
**Backend:** Google Cloud Run / AWS Lambda
**Database:** PostgreSQL (if needed)
**Monitoring:** Sentry, DataDog

---

## 🔑 Environment Variables Setup

### **Required for Basic Functionality:**

1. **OnchainKit API Key**
   ```bash
   # Get from: https://portal.cdp.coinbase.com/
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
   ```

### **Optional for Enhanced Features:**

2. **Binance API (Real Market Data)**
   ```bash
   # Get from: https://www.binance.com/en/binance-api
   BINANCE_API_KEY=your_binance_api_key
   BINANCE_SECRET_KEY=your_binance_secret_key
   ```

3. **AI Content Generation**
   ```bash
   # Get from: https://openrouter.ai/
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free
   ```

4. **Social Media Integration**
   ```bash
   # Twitter API
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   
   # Farcaster (Neynar)
   NEYNAR_API_KEY=your_neynar_api_key
   ```

---

## 🧪 Testing Deployment

### **Local Testing:**
```bash
# Test production build locally
pnpm build
pnpm start

# Test API routes
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/indicators
```

### **Production Testing:**
```bash
# Test all endpoints
curl https://your-app.vercel.app/api/health
curl "https://your-app.vercel.app/api/indicators?symbol=ETH/USDT"
curl "https://your-app.vercel.app/api/analyze?symbol=ETH/USDT"
```

---

## 📊 Monitoring & Analytics

### **Vercel Analytics:**
- Enable in Vercel dashboard
- Monitor performance and usage

### **Error Tracking:**
```bash
# Add Sentry (optional)
pnpm add @sentry/nextjs
```

### **Uptime Monitoring:**
- Use Vercel's built-in monitoring
- Or external services like UptimeRobot

---

## 🔄 CI/CD Pipeline

### **Automatic Deployment:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Troubleshooting Deployment

### **Common Issues:**

1. **Build Errors:**
   ```bash
   # Check build logs in Vercel dashboard
   # Ensure all dependencies are in package.json
   pnpm install
   pnpm build
   ```

2. **API Route Errors:**
   ```bash
   # Check function logs in Vercel
   # Ensure proper error handling in API routes
   ```

3. **Environment Variables:**
   ```bash
   # Verify all required env vars are set
   # Check case sensitivity
   # Ensure NEXT_PUBLIC_ prefix for client-side vars
   ```

4. **Cold Start Issues:**
   ```bash
   # Implement proper error handling
   # Add loading states in UI
   # Consider upgrading to Vercel Pro for faster cold starts
   ```

---

## 📈 Scaling Considerations

### **Performance Optimization:**
- Enable Vercel Edge Functions for faster response
- Implement caching strategies
- Optimize bundle size

### **Cost Management:**
- Monitor Vercel usage dashboard
- Implement rate limiting
- Consider upgrading plans based on usage

### **Security:**
- Enable Vercel's security headers
- Implement proper CORS policies
- Use environment variables for sensitive data

---

## 🎯 Recommended Deployment Strategy

### **For MVP/Demo:**
**Option 1** - Full Vercel deployment with API routes

### **For Production:**
**Option 2** - Vercel frontend + Railway/Render backend

### **For Enterprise:**
**Option 3** - Full cloud infrastructure with monitoring

Choose based on your needs, budget, and technical requirements!