// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "../interfaces/IThetanutsRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockThetanutsRouter
 * @notice Mock router for testing SentientTrader
 * @dev Simulates Thetanuts V4 Router swap functionality
 */
contract MockThetanutsRouter is IThetanutsRouter {
    using SafeERC20 for IERC20;

    /// @notice Exchange rate multiplier (1e18 = 1:1)
    uint256 public exchangeRate = 1e18;

    /// @notice Whether to simulate a failed swap
    bool public shouldFail;

    /// @notice Whether to return less than minAmountOut
    bool public simulateSlippage;

    /// @notice Owner of the mock contract
    address public owner;

    event SwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address recipient
    );

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Set the exchange rate for swaps
     * @param _exchangeRate New exchange rate (1e18 = 1:1)
     */
    function setExchangeRate(uint256 _exchangeRate) external {
        require(msg.sender == owner, "Not owner");
        exchangeRate = _exchangeRate;
    }

    /**
     * @notice Set whether swaps should fail
     * @param _shouldFail Whether to fail
     */
    function setShouldFail(bool _shouldFail) external {
        require(msg.sender == owner, "Not owner");
        shouldFail = _shouldFail;
    }

    /**
     * @notice Set whether to simulate slippage (return less than minAmountOut)
     * @param _simulateSlippage Whether to simulate slippage
     */
    function setSimulateSlippage(bool _simulateSlippage) external {
        require(msg.sender == owner, "Not owner");
        simulateSlippage = _simulateSlippage;
    }

    /**
     * @inheritdoc IThetanutsRouter
     */
    function swapExactInput(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
    ) external override returns (uint256 amountOut) {
        require(!shouldFail, "MockRouter: Swap failed");

        // Transfer tokens from sender
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Calculate output amount based on exchange rate
        amountOut = (amountIn * exchangeRate) / 1e18;

        // Simulate slippage if enabled
        if (simulateSlippage) {
            amountOut = minAmountOut > 0 ? minAmountOut - 1 : 0;
        }

        // Check slippage (this should be handled by caller, but we check anyway)
        require(amountOut >= minAmountOut, "MockRouter: Slippage exceeded");

        // Transfer output tokens to recipient
        // Note: In tests, we need to ensure this contract has tokenOut balance
        IERC20(tokenOut).safeTransfer(recipient, amountOut);

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut, recipient);

        return amountOut;
    }

    /**
     * @notice Mint tokens to this contract for testing
     * @dev Requires MockERC20 tokens with mint function
     */
    function fundRouter(address token, uint256 amount) external {
        // This is called by tests after minting to the router
    }
}
