"""
CoinGecko Market Data Service
Fetches price and OHLC data from CoinGecko API (free tier)
"""

import aiohttp
from typing import List, Dict, Optional
import asyncio
import time


# Coin ID mapping for CoinGecko
COIN_IDS = {
    'ETH': 'ethereum',
    'BTC': 'bitcoin',
    'SOL': 'solana',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'AAVE': 'aave',
    'ARB': 'arbitrum',
    'OP': 'optimism',
}

COINGECKO_BASE = 'https://api.coingecko.com/api/v3'


class CoinGeckoService:
    """Service for fetching market data from CoinGecko"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize CoinGecko service
        
        Args:
            api_key: Optional API key for higher rate limits (Pro tier)
        """
        self.api_key = api_key
        self.headers = {}
        if api_key:
            self.headers['x-cg-demo-api-key'] = api_key
        
        self._last_request_time = 0
        self._min_request_interval = 1.5  # 1.5 seconds between requests for free tier
    
    async def _rate_limit(self):
        """Ensure we don't exceed rate limits"""
        elapsed = time.time() - self._last_request_time
        if elapsed < self._min_request_interval:
            await asyncio.sleep(self._min_request_interval - elapsed)
        self._last_request_time = time.time()
    
    def _get_coin_id(self, symbol: str) -> str:
        """Convert symbol to CoinGecko coin ID"""
        # Handle trading pairs like "ETH/USDT"
        base_symbol = symbol.split('/')[0].upper()
        return COIN_IDS.get(base_symbol, base_symbol.lower())
    
    async def fetch_price(self, symbol: str) -> Dict:
        """
        Fetch current price for a coin
        
        Args:
            symbol: Trading pair or coin symbol (e.g., "ETH/USDT" or "ETH")
        
        Returns:
            Dict with price data
        """
        await self._rate_limit()
        coin_id = self._get_coin_id(symbol)
        
        url = f"{COINGECKO_BASE}/simple/price"
        params = {
            'ids': coin_id,
            'vs_currencies': 'usd',
            'include_24hr_change': 'true',
            'include_24hr_vol': 'true',
            'include_market_cap': 'true'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=self.headers) as response:
                if response.status != 200:
                    raise Exception(f"CoinGecko API error: {response.status}")
                
                data = await response.json()
                
                if coin_id not in data:
                    raise Exception(f"Coin {symbol} not found")
                
                return {
                    'symbol': symbol,
                    'price': data[coin_id]['usd'],
                    'change_24h': data[coin_id].get('usd_24h_change', 0),
                    'volume_24h': data[coin_id].get('usd_24h_vol', 0),
                    'market_cap': data[coin_id].get('usd_market_cap', 0),
                }
    
    async def fetch_ohlc(
        self,
        symbol: str = "ETH/USDT",
        days: int = 30
    ) -> List[List]:
        """
        Fetch OHLC data from CoinGecko
        
        Args:
            symbol: Trading pair (e.g., "ETH/USDT")
            days: Number of days (1, 7, 14, 30, 90, 180, 365, max)
        
        Returns:
            List of [timestamp, open, high, low, close]
        """
        await self._rate_limit()
        coin_id = self._get_coin_id(symbol)
        
        url = f"{COINGECKO_BASE}/coins/{coin_id}/ohlc"
        params = {
            'vs_currency': 'usd',
            'days': str(days)
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=self.headers) as response:
                if response.status != 200:
                    raise Exception(f"CoinGecko API error: {response.status}")
                
                data = await response.json()
                
                # CoinGecko returns [timestamp, open, high, low, close]
                # Convert to standard OHLCV format (add 0 volume)
                ohlcv = []
                for candle in data:
                    ohlcv.append([
                        candle[0],  # timestamp
                        candle[1],  # open
                        candle[2],  # high
                        candle[3],  # low
                        candle[4],  # close
                        0           # volume (not provided by OHLC endpoint)
                    ])
                
                return ohlcv
    
    async def fetch_market_chart(
        self,
        symbol: str = "ETH/USDT",
        days: int = 30
    ) -> Dict:
        """
        Fetch market chart data including prices, volumes, and market caps
        
        Args:
            symbol: Trading pair (e.g., "ETH/USDT")
            days: Number of days
        
        Returns:
            Dict with prices, market_caps, total_volumes arrays
        """
        await self._rate_limit()
        coin_id = self._get_coin_id(symbol)
        
        url = f"{COINGECKO_BASE}/coins/{coin_id}/market_chart"
        params = {
            'vs_currency': 'usd',
            'days': str(days)
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=self.headers) as response:
                if response.status != 200:
                    raise Exception(f"CoinGecko API error: {response.status}")
                
                data = await response.json()
                return data
    
    async def fetch_market_data(self, symbol: str) -> Dict:
        """
        Fetch comprehensive market data for a coin
        
        Args:
            symbol: Trading pair or coin symbol
        
        Returns:
            Dict with comprehensive market data
        """
        await self._rate_limit()
        coin_id = self._get_coin_id(symbol)
        
        url = f"{COINGECKO_BASE}/coins/markets"
        params = {
            'vs_currency': 'usd',
            'ids': coin_id,
            'order': 'market_cap_desc',
            'per_page': '1',
            'page': '1',
            'sparkline': 'false'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=self.headers) as response:
                if response.status != 200:
                    raise Exception(f"CoinGecko API error: {response.status}")
                
                data = await response.json()
                
                if not data:
                    raise Exception(f"Coin {symbol} not found")
                
                return data[0]
    
    async def close(self):
        """Cleanup resources"""
        pass  # aiohttp sessions are created per-request
