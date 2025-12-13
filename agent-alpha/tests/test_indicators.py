"""
Property-Based Tests for Technical Indicators
Tests RSI and Bollinger Bands calculations for accuracy and edge cases
"""

import pytest
import numpy as np
from typing import List
import sys
sys.path.insert(0, '..')

from services.indicators import (
    calculate_rsi,
    calculate_bollinger_bands,
    calculate_sma,
    get_price_position
)


class TestRSICalculation:
    """Tests for RSI calculation accuracy"""
    
    def test_rsi_with_valid_data(self):
        """RSI should return value between 0 and 100"""
        # Generate realistic price data
        prices = [100 + i * 0.5 + np.random.uniform(-2, 2) for i in range(50)]
        rsi = calculate_rsi(prices, period=14)
        
        assert 0 <= rsi <= 100, f"RSI {rsi} should be between 0 and 100"
    
    def test_rsi_all_gains_should_be_100(self):
        """RSI should be 100 when all price changes are gains"""
        prices = [100 + i for i in range(20)]  # Monotonically increasing
        rsi = calculate_rsi(prices, period=14)
        
        assert rsi == 100, f"RSI should be 100 for all gains, got {rsi}"
    
    def test_rsi_all_losses_should_be_0(self):
        """RSI should be 0 when all price changes are losses"""
        prices = [100 - i for i in range(20)]  # Monotonically decreasing
        rsi = calculate_rsi(prices, period=14)
        
        assert rsi == 0, f"RSI should be 0 for all losses, got {rsi}"
    
    def test_rsi_insufficient_data_raises_error(self):
        """RSI should raise error when insufficient data"""
        prices = [100, 101, 102]  # Only 3 prices
        
        with pytest.raises(ValueError):
            calculate_rsi(prices, period=14)
    
    def test_rsi_neutral_market(self):
        """RSI should be around 50 for neutral market"""
        # Alternating gains and losses of same magnitude
        prices = [100]
        for i in range(30):
            if i % 2 == 0:
                prices.append(prices[-1] + 1)
            else:
                prices.append(prices[-1] - 1)
        
        rsi = calculate_rsi(prices, period=14)
        
        # Should be close to 50 (neutral)
        assert 40 <= rsi <= 60, f"RSI {rsi} should be near 50 for neutral market"


class TestBollingerBands:
    """Tests for Bollinger Bands calculation accuracy"""
    
    def test_bollinger_bands_order(self):
        """Upper band should be > middle > lower"""
        prices = [100 + np.random.uniform(-5, 5) for _ in range(30)]
        upper, middle, lower = calculate_bollinger_bands(prices, period=20, std_dev=2)
        
        assert upper > middle > lower, "Bands should be in order: upper > middle > lower"
    
    def test_bollinger_bands_symmetry(self):
        """Upper and lower should be equidistant from middle"""
        prices = [100 + np.random.uniform(-5, 5) for _ in range(30)]
        upper, middle, lower = calculate_bollinger_bands(prices, period=20, std_dev=2)
        
        upper_distance = upper - middle
        lower_distance = middle - lower
        
        assert abs(upper_distance - lower_distance) < 0.0001, \
            "Bands should be symmetric around middle"
    
    def test_bollinger_bands_constant_prices(self):
        """Bands should collapse when prices are constant"""
        prices = [100.0] * 30
        upper, middle, lower = calculate_bollinger_bands(prices, period=20, std_dev=2)
        
        assert upper == middle == lower == 100.0, \
            "All bands should equal price when constant"
    
    def test_bollinger_bands_insufficient_data(self):
        """Should raise error when insufficient data"""
        prices = [100, 101, 102]  # Only 3 prices
        
        with pytest.raises(ValueError):
            calculate_bollinger_bands(prices, period=20, std_dev=2)
    
    def test_bollinger_bands_std_dev_multiplier(self):
        """Higher std_dev should create wider bands"""
        prices = [100 + np.random.uniform(-5, 5) for _ in range(30)]
        
        upper_2, middle_2, lower_2 = calculate_bollinger_bands(prices, period=20, std_dev=2)
        upper_3, middle_3, lower_3 = calculate_bollinger_bands(prices, period=20, std_dev=3)
        
        width_2 = upper_2 - lower_2
        width_3 = upper_3 - lower_3
        
        assert width_3 > width_2, "Higher std_dev should create wider bands"


class TestPricePosition:
    """Tests for price position determination"""
    
    def test_price_above_upper_band(self):
        """Price above upper band should return UPPER"""
        result = get_price_position(110, 105, 95)
        assert result == "UPPER"
    
    def test_price_below_lower_band(self):
        """Price below lower band should return LOWER"""
        result = get_price_position(90, 105, 95)
        assert result == "LOWER"
    
    def test_price_in_middle(self):
        """Price between bands should return MIDDLE"""
        result = get_price_position(100, 105, 95)
        assert result == "MIDDLE"
    
    def test_price_at_upper_band(self):
        """Price at upper band should return UPPER"""
        result = get_price_position(105, 105, 95)
        assert result == "UPPER"
    
    def test_price_at_lower_band(self):
        """Price at lower band should return LOWER"""
        result = get_price_position(95, 105, 95)
        assert result == "LOWER"


class TestSMACalculation:
    """Tests for Simple Moving Average"""
    
    def test_sma_calculation(self):
        """SMA should be average of last N prices"""
        prices = [10, 20, 30, 40, 50]
        sma = calculate_sma(prices, period=5)
        
        expected = (10 + 20 + 30 + 40 + 50) / 5
        assert sma == expected, f"SMA should be {expected}, got {sma}"
    
    def test_sma_uses_recent_prices(self):
        """SMA should use only the most recent N prices"""
        prices = [100, 200, 10, 20, 30, 40, 50]
        sma = calculate_sma(prices, period=5)
        
        expected = (10 + 20 + 30 + 40 + 50) / 5
        assert sma == expected, f"SMA should be {expected}, got {sma}"
