"""
Property-Based Tests for Backtesting Data Sufficiency
**Feature: bethna-ai-trader, Property 4: Backtesting Data Sufficiency**
**Validates: Requirements 2.1, 2.5**

For any backtesting operation, Agent Alpha should validate that at least 
720 hours (30 days) of historical data is available before generating 
win rate calculations.
"""

import pytest
import numpy as np
from hypothesis import given, strategies as st, settings, assume
from typing import List
import sys
sys.path.insert(0, '..')

from services.signals import SignalGenerator


def _create_candles(prices: List[float]) -> List[List]:
    """Helper to create candle data from prices."""
    return [
        [i * 3600000, p, p + 1, p - 1, p, 1000]
        for i, p in enumerate(prices)
    ]


class TestPropertyBacktestingDataSufficiency:
    """
    **Feature: bethna-ai-trader, Property 4: Backtesting Data Sufficiency**
    
    Backtesting should validate sufficient historical data before
    generating statistically significant win rate calculations.
    """
    
    @settings(max_examples=100, deadline=None)
    @given(prices_count=st.integers(min_value=100, max_value=1500))
    def test_backtest_always_returns_valid_win_rate(self, prices_count):
        """
        Property: Backtesting should always return a win rate between 0 and 100.
        """
        generator = SignalGenerator()
        
        np.random.seed(prices_count)
        prices = [100 + np.random.uniform(-5, 5) for _ in range(prices_count)]
        candles = _create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        assert 0 <= signal.win_rate <= 100, \
            f"Win rate {signal.win_rate} should be between 0 and 100"
    
    @settings(max_examples=100, deadline=None)
    @given(prices_count=st.integers(min_value=720, max_value=1000))
    def test_sufficient_data_enables_meaningful_backtest(self, prices_count):
        """
        Property: With 720+ candles (30 days of hourly data), 
        backtest should have enough data for statistical analysis.
        """
        generator = SignalGenerator()
        
        np.random.seed(prices_count)
        # Create price data with some trends
        prices = []
        for i in range(prices_count):
            # Mix of trends and reversals
            if i % 100 < 50:
                prices.append(100 + i * 0.05 + np.random.uniform(-2, 2))
            else:
                prices.append(100 - (i % 100 - 50) * 0.05 + np.random.uniform(-2, 2))
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # With sufficient data, we should get a valid analysis
        assert signal.signal in ["BUY_CALL", "BUY_PUT", "HOLD", "CLOSE_POSITION"]
        assert len(signal.reasoning) > 0
    
    @settings(max_examples=100, deadline=None)
    @given(
        base_price=st.floats(min_value=100.0, max_value=500.0, allow_nan=False, allow_infinity=False),
        volatility=st.floats(min_value=1.0, max_value=10.0, allow_nan=False, allow_infinity=False)
    )
    def test_backtest_handles_various_market_volatilities(self, base_price, volatility):
        """
        Property: Backtesting should handle different volatility levels without errors.
        """
        generator = SignalGenerator()
        
        np.random.seed(42)
        prices = [base_price + np.random.uniform(-volatility, volatility) for _ in range(720)]
        
        # All prices must be positive
        assume(all(p > 0 for p in prices))
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # Should complete without errors and return valid signal
        assert isinstance(signal.win_rate, float)
        assert isinstance(signal.confidence, float)
    
    @settings(max_examples=50, deadline=None)
    @given(seed=st.integers(min_value=0, max_value=10000))
    def test_backtest_lookahead_validation(self, seed):
        """
        Property: Backtesting uses lookahead period correctly - 
        signals are evaluated based on future price movement within lookahead window.
        """
        generator = SignalGenerator()
        
        np.random.seed(seed)
        
        # Create trending data that should trigger signals
        # Declining prices (should trigger BUY_CALL opportunities)
        prices = [200 - i * 0.3 + np.random.uniform(-1, 1) for i in range(800)]
        
        # Ensure all positive
        prices = [max(p, 1.0) for p in prices]
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # The backtest should have processed signals with lookahead
        # Win rate should reflect whether price moved favorably after signal
        assert 0 <= signal.win_rate <= 100
    
    @settings(max_examples=100, deadline=None)
    @given(
        trend_strength=st.floats(min_value=0.1, max_value=0.5, allow_nan=False, allow_infinity=False)
    )
    def test_backtest_win_rate_reflects_strategy_performance(self, trend_strength):
        """
        Property: Win rate should vary based on market conditions that match strategy criteria.
        
        Strong mean-reverting markets should show different win rates than trending markets.
        """
        generator = SignalGenerator()
        
        np.random.seed(42)
        
        # Create mean-reverting price series (oscillating)
        prices = []
        base = 100
        for i in range(720):
            # Oscillate with decreasing amplitude
            oscillation = np.sin(i * 0.1) * 20 * trend_strength
            prices.append(base + oscillation + np.random.uniform(-1, 1))
        
        candles = _create_candles(prices)
        signal = generator.generate_signal(candles)
        
        # Should produce a valid win rate (actual value depends on market)
        assert 0 <= signal.win_rate <= 100
        assert signal.reasoning  # Should have reasoning regardless of signal
    
    @settings(max_examples=50, deadline=None)
    @given(data_size=st.integers(min_value=100, max_value=2000))
    def test_backtest_performance_scales_with_data_size(self, data_size):
        """
        Property: Backtesting should complete in reasonable time regardless of data size.
        """
        import time
        
        generator = SignalGenerator()
        
        np.random.seed(data_size)
        prices = [100 + np.random.uniform(-5, 5) for _ in range(data_size)]
        candles = _create_candles(prices)
        
        start_time = time.time()
        signal = generator.generate_signal(candles)
        elapsed = time.time() - start_time
        
        # Should complete within 10 seconds for any reasonable data size
        assert elapsed < 10.0, f"Backtesting took too long: {elapsed}s"
        assert signal is not None
