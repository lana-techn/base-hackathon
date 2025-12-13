"""
Technical Indicators Module
Implements RSI and Bollinger Bands calculations
"""

import numpy as np
from typing import List, Tuple


def calculate_rsi(prices: List[float], period: int = 14) -> float:
    """
    Calculate the Relative Strength Index (RSI)
    
    RSI = 100 - (100 / (1 + RS))
    RS = Average Gain / Average Loss
    
    Args:
        prices: List of closing prices (oldest to newest)
        period: RSI period (default: 14)
    
    Returns:
        Current RSI value (0-100)
    """
    if len(prices) < period + 1:
        raise ValueError(f"Need at least {period + 1} prices for RSI calculation")
    
    # Convert to numpy array for efficient calculation
    prices_array = np.array(prices, dtype=float)
    
    # Calculate price changes
    deltas = np.diff(prices_array)
    
    # Separate gains and losses
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)
    
    # Calculate initial average gain and loss
    avg_gain = np.mean(gains[:period])
    avg_loss = np.mean(losses[:period])
    
    # Calculate subsequent values using smoothed moving average
    for i in range(period, len(gains)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
    
    # Avoid division by zero
    if avg_loss == 0:
        return 100.0
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return float(rsi)


def calculate_bollinger_bands(
    prices: List[float],
    period: int = 20,
    std_dev: float = 2.0
) -> Tuple[float, float, float]:
    """
    Calculate Bollinger Bands
    
    Middle Band = SMA(period)
    Upper Band = Middle Band + (std_dev * Standard Deviation)
    Lower Band = Middle Band - (std_dev * Standard Deviation)
    
    Args:
        prices: List of closing prices (oldest to newest)
        period: Moving average period (default: 20)
        std_dev: Number of standard deviations (default: 2)
    
    Returns:
        Tuple of (upper_band, middle_band, lower_band)
    """
    if len(prices) < period:
        raise ValueError(f"Need at least {period} prices for Bollinger Bands calculation")
    
    # Use the most recent 'period' prices
    recent_prices = np.array(prices[-period:], dtype=float)
    
    # Calculate Simple Moving Average (Middle Band)
    middle_band = np.mean(recent_prices)
    
    # Calculate Standard Deviation
    std = np.std(recent_prices, ddof=1)  # Sample standard deviation
    
    # Calculate Upper and Lower Bands
    upper_band = middle_band + (std_dev * std)
    lower_band = middle_band - (std_dev * std)
    
    return float(upper_band), float(middle_band), float(lower_band)


def calculate_sma(prices: List[float], period: int) -> float:
    """
    Calculate Simple Moving Average
    
    Args:
        prices: List of prices
        period: SMA period
    
    Returns:
        SMA value
    """
    if len(prices) < period:
        raise ValueError(f"Need at least {period} prices for SMA calculation")
    
    return float(np.mean(prices[-period:]))


def calculate_ema(prices: List[float], period: int) -> float:
    """
    Calculate Exponential Moving Average
    
    Args:
        prices: List of prices
        period: EMA period
    
    Returns:
        EMA value
    """
    if len(prices) < period:
        raise ValueError(f"Need at least {period} prices for EMA calculation")
    
    prices_array = np.array(prices, dtype=float)
    
    # Calculate multiplier
    multiplier = 2 / (period + 1)
    
    # Start with SMA for initial EMA
    ema = np.mean(prices_array[:period])
    
    # Calculate EMA
    for price in prices_array[period:]:
        ema = (price - ema) * multiplier + ema
    
    return float(ema)


def get_price_position(
    current_price: float,
    upper_band: float,
    lower_band: float
) -> str:
    """
    Determine price position relative to Bollinger Bands
    
    Args:
        current_price: Current price
        upper_band: Upper Bollinger Band
        lower_band: Lower Bollinger Band
    
    Returns:
        "UPPER", "LOWER", or "MIDDLE"
    """
    if current_price >= upper_band:
        return "UPPER"
    elif current_price <= lower_band:
        return "LOWER"
    else:
        return "MIDDLE"
