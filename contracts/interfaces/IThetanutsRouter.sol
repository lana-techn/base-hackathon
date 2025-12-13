// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/**
 * @title IThetanutsRouter
 * @notice Interface for Thetanuts Finance V4 Router
 * @dev Used by SentientTrader to swap between USDC and Option Tokens
 * 
 * Reference: https://docs.thetanuts.finance/
 * Integration Guide: https://www.notion.so/Thetanuts-v4-Guide-for-implementing-Option-Book
 */
interface IThetanutsRouter {
    /**
     * @notice Swap exact input amount of tokenIn for tokenOut
     * @param tokenIn Address of the input token (e.g., USDC or Option Token)
     * @param tokenOut Address of the output token (e.g., Option Token or USDC)
     * @param amountIn Exact amount of input token to swap
     * @param minAmountOut Minimum amount of output token to receive (slippage protection)
     * @param recipient Address to receive the output tokens
     * @return amountOut Actual amount of output tokens received
     */
    function swapExactInput(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
    ) external returns (uint256 amountOut);
}
