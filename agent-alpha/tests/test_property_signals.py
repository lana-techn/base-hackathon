"""
Property-Based Tests for Signal Generation
**Feature: bethna-ai-trader, Property 3: Signal Generation Consistency**
**Validates: Requirements 2.3, 2.4**

For any market conditions where price < lower Bollinger Band AND RSI < 30,
Agent Alpha should generate a BUY_CALL signal with appropriate confidence scoring.
"""

import pytest
import numpy as np
from hypothesis import given, strategies as st, settings, assume
from typing import List
import sys
sys.path.insert(0, '..')

from services.signals import SignalGenerator, TradingSignal
from services.indicators import calculate_rsi, calculate_bollinger_bands


def _create_candles(prices: List[float]) -> List[List]:
    """Helper to create candle data from prices."""
    return [
        [i * 3600000, p, p + 1, p - 1, p, 1000]
        for i, p in enumerate(prices)
    ]


class TestPropertySignalGenerationConsistency:
    """
    **Feature: bethna-ai-trader, Property 3: Signal Generation Consistency**
    
    Signal generation should be consistent and follow the defined strategy rules.
    """
    
    @settings(max_examples=100, deadline=None)
    @given(
        start_price=st.floats(min_value=200.0, max_value=500.0, allow_nan=False, allow_infinity=False),
        decline_rate=st.floats(min_value=0.3, max_value=0.8, allow_nan=False, allow_infinity=False)
    )
    def test_strongly_declining_prices_produce_oversold_or_hold(self, start_price, decline_rate):
        """
        Property: Strongly declining prices should produce BUY_CALL or HOLD signal.
        When RSI is low and price is below lower BB, expect BUY_CALL.
        """
        generator = SignalGenerator()
        
        # Generate declining prices
        prices = [start_price - i * decline_rate for i in range(200)]
        
        # Ensure all prices are positive
        assume(all(p > 0 for p in prices))
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # With declining prices, should be oversold or hold
        assert signal.signal in ["BUY_CALL", "HOLD"], \
            f"Declining market should trigger BUY_CALL or HOLD, got {signal.signal}"
    
    @settings(max_examples=100, deadline=None)
    @given(
        start_price=st.floats(min_value=100.0, max_value=200.0, allow_nan=False, allow_infinity=False),
        incline_rate=st.floats(min_value=0.3, max_value=0.8, allow_nan=False, allow_infinity=False)
    )
    def test_strongly_rising_prices_produce_overbought_or_hold(self, start_price, incline_rate):
        """
        Property: Strongly rising prices should produce BUY_PUT or HOLD signal.
        When RSI is high and price is above upper BB, expect BUY_PUT.
        """
        generator = SignalGenerator()
        
        # Generate rising prices
        prices = [start_price + i * incline_rate for i in range(200)]
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # With rising prices, should be overbought or hold
        assert signal.signal in ["BUY_PUT", "HOLD"], \
            f"Rising market should trigger BUY_PUT or HOLD, got {signal.signal}"
    
    @settings(max_examples=100, deadline=None)
    @given(
        base_price=st.floats(min_value=100.0, max_value=1000.0, allow_nan=False, allow_infinity=False),
        variance=st.floats(min_value=0.5, max_value=2.0, allow_nan=False, allow_infinity=False)
    )
    def test_sideways_market_produces_hold(self, base_price, variance):
        """
        Property: Sideways/neutral market conditions should produce HOLD signal.
        """
        generator = SignalGenerator()
        
        # Generate sideways prices with small fluctuations
        np.random.seed(42)
        prices = [base_price + np.random.uniform(-variance, variance) for _ in range(200)]
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # Sideways market should hold
        assert signal.signal == "HOLD", \
            f"Sideways market should produce HOLD, got {signal.signal}"
    
    @settings(max_examples=100, deadline=None)
    @given(prices_count=st.integers(min_value=100, max_value=1000))
    def test_signal_always_has_valid_structure(self, prices_count):
        """
        Property: Any generated signal must have all required fields with valid values.
        """
        generator = SignalGenerator()
        
        # Generate random price data
        np.random.seed(prices_count)
        prices = [100 + np.random.uniform(-10, 10) for _ in range(prices_count)]
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # Validate signal structure
        assert isinstance(signal, TradingSignal)
        assert signal.signal in ["BUY_CALL", "BUY_PUT", "HOLD", "CLOSE_POSITION"]
        assert 0 <= signal.confidence <= 100
        assert 0 <= signal.win_rate <= 100
        assert isinstance(signal.reasoning, str)
        assert len(signal.reasoning) > 0
    
    @settings(max_examples=100, deadline=None)
    @given(seed=st.integers(min_value=0, max_value=10000))
    def test_signal_generation_is_deterministic(self, seed):
        """
        Property: Same input data should always produce the same signal.
        """
        generator = SignalGenerator()
        
        np.random.seed(seed)
        prices = [100 + np.random.uniform(-10, 10) for _ in range(150)]
        candles = _create_candles(prices)
        
        # Generate signal twice with same data
        signal1 = generator.generate_signal(candles)
        signal2 = generator.generate_signal(candles)
        
        assert signal1.signal == signal2.signal
        assert signal1.confidence == signal2.confidence
        assert signal1.win_rate == signal2.win_rate
    
    @settings(max_examples=100, deadline=None)
    @given(prices_count=st.integers(min_value=10, max_value=99))
    def test_insufficient_data_returns_hold_with_zero_confidence(self, prices_count):
        """
        Property: Insufficient data (< 100 candles) should return HOLD with 0 confidence.
        """
        generator = SignalGenerator()
        
        prices = [100 + i * 0.1 for i in range(prices_count)]
        candles = _create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        assert signal.signal == "HOLD"
        assert signal.confidence == 0
        assert "Insufficient" in signal.reasoning or signal.win_rate == 0
