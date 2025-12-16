"""
Binance Market Data Service
Fetches OHLCV data using ccxt library
"""

import ccxt.async_support as ccxt
from typing import List, Tuple
import asyncio
import time
import random
import os


class BinanceService:
    """Service for fetching market data from Binance"""
    
    def __init__(self):
        # Check if API keys are available
        api_key = os.getenv('BINANCE_API_KEY')
        secret_key = os.getenv('BINANCE_SECRET_KEY')
        
        self.use_mock_data = not (api_key and secret_key)
        
        if not self.use_mock_data:
            self.exchange = ccxt.binance({
                'apiKey': api_key,
                'secret': secret_key,
                'enableRateLimit': True,
                'options': {
                    'defaultType': 'spot'
                }
            })
        else:
            # Use public API without authentication for basic data
            self.exchange = ccxt.binance({
                'enableRateLimit': True,
                'options': {
                    'defaultType': 'spot'
                }
            })
            print("⚠️  No Binance API keys found. Using mock data for development.")
    
    async def fetch_ohlcv(
        self,
        symbol: str = "ETH/USDT",
        timeframe: str = "1h",
        limit: int = 720
    ) -> List[List]:
        """
        Fetch OHLCV (candlestick) data from Binance
        
        Args:
            symbol: Trading pair (e.g., "ETH/USDT")
            timeframe: Candle interval ("1m", "5m", "15m", "1h", "4h", "1d")
            limit: Number of candles to fetch (max 1000)
        
        Returns:
            List of [timestamp, open, high, low, close, volume]
        """
        try:
            # Binance has a limit of 1000 candles per request
            if limit > 1000:
                # Fetch in batches
                all_candles = []
                remaining = limit
                since = None
                
                while remaining > 0:
                    batch_size = min(remaining, 1000)
                    candles = await self.exchange.fetch_ohlcv(
                        symbol,
                        timeframe,
                        since=since,
                        limit=batch_size
                    )
                    
                    if not candles:
                        break
                    
                    all_candles.extend(candles)
                    remaining -= len(candles)
                    
                    # Set since to after the last candle
                    if candles:
                        since = candles[-1][0] + 1
                    
                    # Rate limiting
                    await asyncio.sleep(0.1)
                
                return all_candles[-limit:]  # Return only requested amount
            else:
                candles = await self.exchange.fetch_ohlcv(
                    symbol,
                    timeframe,
                    limit=limit
                )
                return candles
        except Exception as e:
            print(f"⚠️  Binance API error: {str(e)}. Falling back to mock data.")
            return self._generate_mock_ohlcv(symbol, timeframe, limit)
    
    async def get_ticker(self, symbol: str = "ETH/USDT") -> dict:
        """
        Get current ticker data for a symbol
        
        Returns:
            Dict with bid, ask, last price, volume, etc.
        """
        try:
            ticker = await self.exchange.fetch_ticker(symbol)
            return {
                "symbol": symbol,
                "last": ticker["last"],
                "bid": ticker["bid"],
                "ask": ticker["ask"],
                "high": ticker["high"],
                "low": ticker["low"],
                "volume": ticker["baseVolume"],
                "change_percent": ticker["percentage"],
                "timestamp": ticker["timestamp"]
            }
        except Exception as e:
            print(f"⚠️  Binance API error: {str(e)}. Falling back to mock data.")
            return self._generate_mock_ticker(symbol)
    
    def _generate_mock_ohlcv(self, symbol: str, timeframe: str, limit: int) -> List[List]:
        """Generate realistic mock OHLCV data for development"""
        # Base price for different symbols
        base_prices = {
            "ETH/USDT": 3200,
            "BTC/USDT": 65000,
            "SOL/USDT": 180,
            "MATIC/USDT": 0.85
        }
        
        base_price = base_prices.get(symbol, 3200)
        
        # Time intervals in milliseconds
        intervals = {
            "1m": 60 * 1000,
            "5m": 5 * 60 * 1000,
            "15m": 15 * 60 * 1000,
            "1h": 60 * 60 * 1000,
            "4h": 4 * 60 * 60 * 1000,
            "1d": 24 * 60 * 60 * 1000
        }
        
        interval_ms = intervals.get(timeframe, 60 * 60 * 1000)
        current_time = int(time.time() * 1000)
        
        candles = []
        current_price = base_price
        
        for i in range(limit):
            timestamp = current_time - (limit - i - 1) * interval_ms
            
            # Generate realistic price movement
            volatility = 0.02  # 2% volatility
            price_change = random.uniform(-volatility, volatility)
            current_price *= (1 + price_change)
            
            # Generate OHLC around current price
            high = current_price * random.uniform(1.001, 1.015)
            low = current_price * random.uniform(0.985, 0.999)
            open_price = current_price * random.uniform(0.995, 1.005)
            close_price = current_price
            
            # Ensure OHLC logic is correct
            high = max(high, open_price, close_price)
            low = min(low, open_price, close_price)
            
            volume = random.uniform(1000, 10000)
            
            candles.append([
                timestamp,
                round(open_price, 2),
                round(high, 2),
                round(low, 2),
                round(close_price, 2),
                round(volume, 2)
            ])
        
        return candles
    
    def _generate_mock_ticker(self, symbol: str) -> dict:
        """Generate mock ticker data"""
        base_prices = {
            "ETH/USDT": 3200,
            "BTC/USDT": 65000,
            "SOL/USDT": 180,
            "MATIC/USDT": 0.85
        }
        
        base_price = base_prices.get(symbol, 3200)
        price_variation = base_price * 0.01  # 1% variation
        
        last_price = base_price + random.uniform(-price_variation, price_variation)
        
        return {
            "symbol": symbol,
            "last": round(last_price, 2),
            "bid": round(last_price * 0.999, 2),
            "ask": round(last_price * 1.001, 2),
            "high": round(last_price * 1.02, 2),
            "low": round(last_price * 0.98, 2),
            "volume": round(random.uniform(10000, 100000), 2),
            "change_percent": round(random.uniform(-5, 5), 2),
            "timestamp": int(time.time() * 1000)
        }

    async def close(self):
        """Close the exchange connection"""
        if hasattr(self, 'exchange'):
            await self.exchange.close()
    
    def __del__(self):
        """Cleanup on deletion"""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(self.close())
            else:
                loop.run_until_complete(self.close())
        except:
            pass
