"""
Property-Based Tests for Technical Indicators
**Feature: bethna-ai-trader, Property 2: Technical Analysis Accuracy**
**Validates: Requirements 2.2, 2.3**

For any market data input, Agent Alpha's technical indicator calculations 
should produce mathematically correct Bollinger Bands (20-period, 2 std dev) 
and RSI (14-period) values.
"""

import pytest
import numpy as np
from hypothesis import given, strategies as st, settings, assume
from typing import List
import sys
sys.path.insert(0, '..')

from services.indicators import (
    calculate_rsi,
    calculate_bollinger_bands,
    get_price_position
)


# Strategy: Generate realistic price data
price_strategy = st.floats(min_value=1.0, max_value=100000.0, allow_nan=False, allow_infinity=False)
price_list_strategy = st.lists(price_strategy, min_size=50, max_size=1000)


class TestPropertyTechnicalAnalysisAccuracy:
    """
    **Feature: bethna-ai-trader, Property 2: Technical Analysis Accuracy**
    
    For any valid market data, technical indicators should produce
    mathematically correct values within expected ranges.
    """
    
    @settings(max_examples=100)
    @given(prices=price_list_strategy)
    def test_rsi_always_returns_value_between_0_and_100(self, prices: List[float]):
        """
        Property: RSI must always be between 0 and 100 for any valid price data.
        """
        # Need at least 15 prices for RSI(14)
        assume(len(prices) >= 15)
        
        rsi = calculate_rsi(prices, period=14)
        
        assert 0 <= rsi <= 100, f"RSI {rsi} should be between 0 and 100"
    
    @settings(max_examples=100)
    @given(prices=price_list_strategy)
    def test_bollinger_bands_maintain_correct_order(self, prices: List[float]):
        """
        Property: Bollinger Bands must always maintain order: upper > middle > lower
        """
        # Need at least 20 prices for BB(20)
        assume(len(prices) >= 20)
        
        upper, middle, lower = calculate_bollinger_bands(prices, period=20, std_dev=2)
        
        assert upper >= middle >= lower, \
            f"Bollinger Bands order violated: upper={upper}, middle={middle}, lower={lower}"
    
    @settings(max_examples=100)
    @given(prices=price_list_strategy)
    def test_bollinger_bands_symmetry_around_middle(self, prices: List[float]):
        """
        Property: Upper and lower bands should be equidistant from middle band.
        """
        assume(len(prices) >= 20)
        
        upper, middle, lower = calculate_bollinger_bands(prices, period=20, std_dev=2)
        
        upper_distance = upper - middle
        lower_distance = middle - lower
        
        # Allow small floating point tolerance
        assert abs(upper_distance - lower_distance) < 0.0001, \
            f"Bands should be symmetric: upper_dist={upper_distance}, lower_dist={lower_distance}"
    
    @settings(max_examples=100)
    @given(
        current_price=st.floats(min_value=1.0, max_value=100000.0, allow_nan=False, allow_infinity=False),
        upper_band=st.floats(min_value=1.0, max_value=100000.0, allow_nan=False, allow_infinity=False),
        lower_band=st.floats(min_value=1.0, max_value=100000.0, allow_nan=False, allow_infinity=False)
    )
    def test_price_position_returns_valid_category(self, current_price, upper_band, lower_band):
        """
        Property: Price position should always return one of: UPPER, MIDDLE, LOWER
        """
        # Ensure upper > lower
        assume(upper_band > lower_band)
        
        position = get_price_position(current_price, upper_band, lower_band)
        
        assert position in ["UPPER", "MIDDLE", "LOWER"], \
            f"Invalid position: {position}"
        
        # Verify correctness
        if current_price >= upper_band:
            assert position == "UPPER"
        elif current_price <= lower_band:
            assert position == "LOWER"
        else:
            assert position == "MIDDLE"
    
    @settings(max_examples=100)
    @given(
        base_price=st.floats(min_value=100.0, max_value=10000.0, allow_nan=False, allow_infinity=False),
        std_dev_mult=st.floats(min_value=1.0, max_value=3.0, allow_nan=False, allow_infinity=False)
    )
    def test_bollinger_bands_width_increases_with_std_dev(self, base_price, std_dev_mult):
        """
        Property: Higher std_dev multiplier should produce wider bands.
        """
        # Generate random prices around base_price
        np.random.seed(42)
        prices = [base_price + np.random.uniform(-50, 50) for _ in range(30)]
        
        upper_2, _, lower_2 = calculate_bollinger_bands(prices, period=20, std_dev=2.0)
        upper_3, _, lower_3 = calculate_bollinger_bands(prices, period=20, std_dev=std_dev_mult + 1.0)
        
        width_2 = upper_2 - lower_2
        width_3 = upper_3 - lower_3
        
        assert width_3 >= width_2, \
            f"Higher std_dev should create wider bands: width_2={width_2}, width_3={width_3}"
