# Agent Alpha - Quantitative Analysis Service

AI-powered market analysis and trading signal generation for BethNa AI Trader.

## Setup with uv

```bash
# Install uv if not installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv sync

# Run the service
uv run uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health` - Health check
- `GET /candles` - Fetch historical candlestick data
- `GET /indicators` - Get current technical indicators
- `GET /analyze` - Full market analysis with trading signal
- `GET /signal` - Quick trading signal

## Running Tests

```bash
uv run pytest -v
```

## Strategy

- **BUY_CALL**: Price < Lower Bollinger Band AND RSI < 30 (oversold)
- **BUY_PUT**: Price > Upper Bollinger Band AND RSI > 70 (overbought)
- **HOLD**: Normal market conditions
