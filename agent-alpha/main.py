"""
Agent Alpha - Quantitative Analysis Service
FastAPI application for market data analysis and trading signal generation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

from services.coingecko import CoinGeckoService
from services.indicators import calculate_rsi, calculate_bollinger_bands
from services.signals import SignalGenerator, TradingSignal

load_dotenv()

app = FastAPI(
    title="Agent Alpha - Quantitative Analysis",
    description="Market data analysis and trading signal generation for BethNa AI Trader",
    version="1.0.0"
)

# CORS middleware for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
coingecko_service = CoinGeckoService(api_key=os.getenv('COINGECKO_API_KEY'))
signal_generator = SignalGenerator()


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str


class CandlestickData(BaseModel):
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float


class IndicatorsResponse(BaseModel):
    rsi: float
    bollinger_upper: float
    bollinger_middle: float
    bollinger_lower: float
    current_price: float
    price_position: str  # "UPPER", "MIDDLE", "LOWER"


class AnalysisResponse(BaseModel):
    signal: str  # "BUY_CALL", "BUY_PUT", "HOLD", "CLOSE_POSITION"
    confidence: float
    win_rate: float
    reasoning: str
    indicators: IndicatorsResponse
    timestamp: str


class CandlesResponse(BaseModel):
    symbol: str
    interval: str
    candles: List[CandlestickData]
    count: int


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0"
    )


@app.get("/candles", response_model=CandlesResponse)
async def get_candles(
    symbol: str = "ETH/USDT",
    interval: str = "1h",
    limit: int = 720
):
    """
    Fetch historical candlestick data from CoinGecko
    
    - symbol: Trading pair (default: ETH/USDT)
    - interval: Candle interval (not used, CoinGecko uses days)
    - limit: Number of candles to fetch
    """
    try:
        # Convert limit to days (CoinGecko uses days parameter)
        days = min(max(limit // 24, 1), 365)  # Convert hours to days, max 365
        candles = await coingecko_service.fetch_ohlc(symbol, days)
        return CandlesResponse(
            symbol=symbol,
            interval=interval,
            candles=[
                CandlestickData(
                    timestamp=c[0],
                    open=c[1],
                    high=c[2],
                    low=c[3],
                    close=c[4],
                    volume=c[5] if len(c) > 5 else 0
                ) for c in candles
            ],
            count=len(candles)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/indicators")
async def get_indicators(
    symbol: str = "ETH/USDT",
    interval: str = "1h"
):
    """
    Get current technical indicators for a symbol
    """
    try:
        # Fetch enough data for indicator calculations (30 days)
        candles = await coingecko_service.fetch_ohlc(symbol, days=30)
        closes = [c[4] for c in candles]  # Close prices
        
        # Calculate indicators
        rsi = calculate_rsi(closes, period=14)
        bb_upper, bb_middle, bb_lower = calculate_bollinger_bands(closes, period=20, std_dev=2)
        
        current_price = closes[-1] if closes else 0
        
        # Determine price position relative to Bollinger Bands
        if current_price >= bb_upper:
            price_position = "UPPER"
        elif current_price <= bb_lower:
            price_position = "LOWER"
        else:
            price_position = "MIDDLE"
        
        return IndicatorsResponse(
            rsi=round(rsi, 2),
            bollinger_upper=round(bb_upper, 2),
            bollinger_middle=round(bb_middle, 2),
            bollinger_lower=round(bb_lower, 2),
            current_price=round(current_price, 2),
            price_position=price_position
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analyze", response_model=AnalysisResponse)
async def analyze_market(
    symbol: str = "ETH/USDT",
    interval: str = "1h"
):
    """
    Run full market analysis and generate trading signal
    
    Strategy:
    - If Price < Lower Band AND RSI < 30 → BUY_CALL (oversold)
    - If Price > Upper Band AND RSI > 70 → BUY_PUT (overbought)
    - Otherwise → HOLD
    """
    try:
        # Fetch historical data for backtesting (30 days)
        candles = await coingecko_service.fetch_ohlc(symbol, days=30)
        
        # Generate signal with backtesting
        signal = signal_generator.generate_signal(candles)
        
        # Get current indicators for response
        closes = [c[4] for c in candles]
        rsi = calculate_rsi(closes, period=14)
        bb_upper, bb_middle, bb_lower = calculate_bollinger_bands(closes, period=20, std_dev=2)
        current_price = closes[-1]
        
        # Determine price position
        if current_price >= bb_upper:
            price_position = "UPPER"
        elif current_price <= bb_lower:
            price_position = "LOWER"
        else:
            price_position = "MIDDLE"
        
        return AnalysisResponse(
            signal=signal.signal,
            confidence=signal.confidence,
            win_rate=signal.win_rate,
            reasoning=signal.reasoning,
            indicators=IndicatorsResponse(
                rsi=round(rsi, 2),
                bollinger_upper=round(bb_upper, 2),
                bollinger_middle=round(bb_middle, 2),
                bollinger_lower=round(bb_lower, 2),
                current_price=round(current_price, 2),
                price_position=price_position
            ),
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/signal")
async def get_signal(symbol: str = "ETH/USDT"):
    """
    Get current trading signal (simplified response)
    """
    analysis = await analyze_market(symbol)
    return {
        "signal": analysis.signal,
        "confidence": analysis.confidence,
        "timestamp": analysis.timestamp
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
