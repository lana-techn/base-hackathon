"""
Binance Market Data Service
Fetches OHLCV data using ccxt library
"""

import ccxt.async_support as ccxt
from typing import List, Tuple
import asyncio


class BinanceService:
    """Service for fetching market data from Binance"""
    
    def __init__(self):
        self.exchange = ccxt.binance({
            'enableRateLimit': True,
            'options': {
                'defaultType': 'spot'
            }
        })
    
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
            raise Exception(f"Failed to fetch OHLCV data: {str(e)}")
    
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
            raise Exception(f"Failed to fetch ticker: {str(e)}")
    
    async def close(self):
        """Close the exchange connection"""
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
