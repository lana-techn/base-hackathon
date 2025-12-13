"""
Signal Generation Engine
Implements trading strategy and backtesting for signal generation
"""

from dataclasses import dataclass
from typing import List, Tuple
from .indicators import calculate_rsi, calculate_bollinger_bands, get_price_position


@dataclass
class TradingSignal:
    """Trading signal data class"""
    signal: str  # "BUY_CALL", "BUY_PUT", "HOLD", "CLOSE_POSITION"
    confidence: float  # 0-100
    win_rate: float  # Historical win rate percentage
    reasoning: str


class SignalGenerator:
    """
    Trading Signal Generator with Backtesting
    
    Strategy:
    - If Price < Lower Band AND RSI < 30 → BUY_CALL (oversold condition)
    - If Price > Upper Band AND RSI > 70 → BUY_PUT (overbought condition)
    - Otherwise → HOLD
    """
    
    # Strategy parameters
    RSI_OVERSOLD = 30
    RSI_OVERBOUGHT = 70
    MIN_CONFIDENCE_THRESHOLD = 60  # Minimum confidence to recommend trade
    BACKTEST_LOOKAHEAD = 24  # Hours to look ahead for win/loss determination
    
    def __init__(self):
        pass
    
    def generate_signal(self, candles: List[List]) -> TradingSignal:
        """
        Generate trading signal based on current market conditions and backtesting
        
        Args:
            candles: List of [timestamp, open, high, low, close, volume]
        
        Returns:
            TradingSignal with signal, confidence, win_rate, and reasoning
        """
        if len(candles) < 100:
            return TradingSignal(
                signal="HOLD",
                confidence=0,
                win_rate=0,
                reasoning="Insufficient data for analysis"
            )
        
        # Extract close prices
        closes = [c[4] for c in candles]
        
        # Calculate current indicators
        current_rsi = calculate_rsi(closes, period=14)
        bb_upper, bb_middle, bb_lower = calculate_bollinger_bands(closes, period=20, std_dev=2)
        current_price = closes[-1]
        
        # Run backtest to get win rate
        win_rate, total_signals = self._backtest_strategy(candles)
        
        # Determine signal based on strategy
        signal, reasoning = self._evaluate_conditions(
            current_price, current_rsi, bb_upper, bb_lower, bb_middle
        )
        
        # Calculate confidence based on:
        # 1. Win rate from backtesting
        # 2. Strength of the signal (how extreme RSI and price position are)
        confidence = self._calculate_confidence(
            signal, current_rsi, current_price, bb_upper, bb_lower, win_rate
        )
        
        return TradingSignal(
            signal=signal,
            confidence=round(confidence, 1),
            win_rate=round(win_rate, 1),
            reasoning=reasoning
        )
    
    def _evaluate_conditions(
        self,
        price: float,
        rsi: float,
        bb_upper: float,
        bb_lower: float,
        bb_middle: float
    ) -> Tuple[str, str]:
        """Evaluate trading conditions and return signal with reasoning"""
        
        position = get_price_position(price, bb_upper, bb_lower)
        
        # BUY_CALL: Oversold condition
        if price <= bb_lower and rsi < self.RSI_OVERSOLD:
            return (
                "BUY_CALL",
                f"Oversold: Price ${price:.2f} below lower Bollinger Band ${bb_lower:.2f}, "
                f"RSI {rsi:.1f} < {self.RSI_OVERSOLD}. Expecting upward reversal."
            )
        
        # BUY_PUT: Overbought condition
        if price >= bb_upper and rsi > self.RSI_OVERBOUGHT:
            return (
                "BUY_PUT",
                f"Overbought: Price ${price:.2f} above upper Bollinger Band ${bb_upper:.2f}, "
                f"RSI {rsi:.1f} > {self.RSI_OVERBOUGHT}. Expecting downward reversal."
            )
        
        # Strong BUY_CALL signal (close to conditions)
        if price < bb_middle and rsi < 40:
            return (
                "HOLD",
                f"Approaching oversold: Price ${price:.2f} below middle band ${bb_middle:.2f}, "
                f"RSI {rsi:.1f}. Waiting for stronger signal."
            )
        
        # Strong BUY_PUT signal (close to conditions)
        if price > bb_middle and rsi > 60:
            return (
                "HOLD",
                f"Approaching overbought: Price ${price:.2f} above middle band ${bb_middle:.2f}, "
                f"RSI {rsi:.1f}. Waiting for stronger signal."
            )
        
        # Neutral
        return (
            "HOLD",
            f"Neutral: Price ${price:.2f} within Bollinger Bands, RSI {rsi:.1f} in normal range. "
            f"No clear trading opportunity."
        )
    
    def _backtest_strategy(self, candles: List[List]) -> Tuple[float, int]:
        """
        Backtest the strategy on historical data
        
        Returns:
            Tuple of (win_rate_percentage, total_signals_generated)
        """
        closes = [c[4] for c in candles]
        wins = 0
        total_signals = 0
        
        # Need enough data for indicators and lookahead
        min_lookback = 50  # For indicators
        
        for i in range(min_lookback, len(candles) - self.BACKTEST_LOOKAHEAD):
            historical_closes = closes[:i+1]
            
            try:
                rsi = calculate_rsi(historical_closes, period=14)
                bb_upper, bb_middle, bb_lower = calculate_bollinger_bands(historical_closes, period=20, std_dev=2)
                price = historical_closes[-1]
                
                # Check for BUY_CALL signal
                if price <= bb_lower and rsi < self.RSI_OVERSOLD:
                    total_signals += 1
                    # Check if price went up within lookahead period
                    future_closes = closes[i+1:i+1+self.BACKTEST_LOOKAHEAD]
                    if max(future_closes) > price * 1.01:  # 1% profit threshold
                        wins += 1
                
                # Check for BUY_PUT signal
                elif price >= bb_upper and rsi > self.RSI_OVERBOUGHT:
                    total_signals += 1
                    # Check if price went down within lookahead period
                    future_closes = closes[i+1:i+1+self.BACKTEST_LOOKAHEAD]
                    if min(future_closes) < price * 0.99:  # 1% profit threshold
                        wins += 1
                        
            except ValueError:
                continue
        
        if total_signals == 0:
            return 50.0, 0  # Default 50% if no signals
        
        win_rate = (wins / total_signals) * 100
        return win_rate, total_signals
    
    def _calculate_confidence(
        self,
        signal: str,
        rsi: float,
        price: float,
        bb_upper: float,
        bb_lower: float,
        win_rate: float
    ) -> float:
        """
        Calculate confidence score based on multiple factors
        
        Confidence is weighted:
        - 50% from historical win rate
        - 30% from RSI extremity
        - 20% from Bollinger Band position
        """
        if signal == "HOLD":
            return 0.0
        
        # Win rate component (50%)
        win_rate_score = win_rate * 0.5
        
        # RSI extremity component (30%)
        if signal == "BUY_CALL":
            # More extreme RSI (lower) = higher confidence
            rsi_score = max(0, (self.RSI_OVERSOLD - rsi) / self.RSI_OVERSOLD) * 100 * 0.3
        else:  # BUY_PUT
            # More extreme RSI (higher) = higher confidence
            rsi_score = max(0, (rsi - self.RSI_OVERBOUGHT) / (100 - self.RSI_OVERBOUGHT)) * 100 * 0.3
        
        # BB position component (20%)
        bb_range = bb_upper - bb_lower
        if signal == "BUY_CALL":
            bb_score = max(0, (bb_lower - price) / bb_range) * 100 * 0.2
        else:  # BUY_PUT
            bb_score = max(0, (price - bb_upper) / bb_range) * 100 * 0.2
        
        confidence = win_rate_score + rsi_score + bb_score
        return min(100, max(0, confidence))
