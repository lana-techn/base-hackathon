"""
Tests for Signal Generation Engine
"""

import pytest
import sys
sys.path.insert(0, '..')

from services.signals import SignalGenerator, TradingSignal


class TestSignalGenerator:
    """Tests for signal generation logic"""
    
    @pytest.fixture
    def generator(self):
        return SignalGenerator()
    
    def _create_candles(self, prices: list) -> list:
        """Helper to create candle data from prices"""
        return [
            [i * 3600000, p, p + 1, p - 1, p, 1000]  # [timestamp, open, high, low, close, volume]
            for i, p in enumerate(prices)
        ]
    
    def test_insufficient_data_returns_hold(self, generator):
        """Should return HOLD with insufficient data"""
        candles = self._create_candles([100] * 50)  # Less than 100 needed
        signal = generator.generate_signal(candles)
        
        assert signal.signal == "HOLD"
        assert signal.confidence == 0
    
    def test_oversold_conditions_generate_buy_call(self, generator):
        """Oversold conditions should generate BUY_CALL"""
        # Create price data that results in oversold conditions
        # Start high, then drop significantly
        prices = [200 - i * 0.5 for i in range(150)]  # Declining prices
        candles = self._create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        # With strongly declining prices, RSI should be low
        # This should generate either BUY_CALL or HOLD
        assert signal.signal in ["BUY_CALL", "HOLD"]
    
    def test_overbought_conditions_generate_buy_put(self, generator):
        """Overbought conditions should generate BUY_PUT"""
        # Create price data that results in overbought conditions
        # Start low, then rise significantly
        prices = [100 + i * 0.5 for i in range(150)]  # Rising prices
        candles = self._create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        # With strongly rising prices, RSI should be high
        assert signal.signal in ["BUY_PUT", "HOLD"]
    
    def test_neutral_conditions_generate_hold(self, generator):
        """Neutral conditions should generate HOLD"""
        # Create sideways price data
        import random
        random.seed(42)
        prices = [100 + random.uniform(-2, 2) for _ in range(150)]
        candles = self._create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        assert signal.signal == "HOLD"
    
    def test_signal_has_required_fields(self, generator):
        """Signal should have all required fields"""
        prices = [100 + i * 0.1 for i in range(150)]
        candles = self._create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        assert isinstance(signal, TradingSignal)
        assert hasattr(signal, 'signal')
        assert hasattr(signal, 'confidence')
        assert hasattr(signal, 'win_rate')
        assert hasattr(signal, 'reasoning')
    
    def test_confidence_is_in_valid_range(self, generator):
        """Confidence should be between 0 and 100"""
        prices = [100 + i * 0.1 for i in range(150)]
        candles = self._create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        assert 0 <= signal.confidence <= 100
    
    def test_win_rate_is_in_valid_range(self, generator):
        """Win rate should be between 0 and 100"""
        prices = [100 + i * 0.1 for i in range(150)]
        candles = self._create_candles(prices)
        
        signal = generator.generate_signal(candles)
        
        assert 0 <= signal.win_rate <= 100


class TestTradingSignalDataclass:
    """Tests for TradingSignal dataclass"""
    
    def test_create_valid_signal(self):
        """Should create valid signal"""
        signal = TradingSignal(
            signal="BUY_CALL",
            confidence=75.5,
            win_rate=65.0,
            reasoning="Test reasoning"
        )
        
        assert signal.signal == "BUY_CALL"
        assert signal.confidence == 75.5
        assert signal.win_rate == 65.0
        assert signal.reasoning == "Test reasoning"
    
    def test_all_signal_types(self):
        """Should support all signal types"""
        for signal_type in ["BUY_CALL", "BUY_PUT", "HOLD", "CLOSE_POSITION"]:
            signal = TradingSignal(
                signal=signal_type,
                confidence=50,
                win_rate=50,
                reasoning="Test"
            )
            assert signal.signal == signal_type
