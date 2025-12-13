// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IThetanutsRouter.sol";

/**
 * @title SentientTrader
 * @author BethNa AI Trading System
 * @notice Smart contract for autonomous options trading on Thetanuts Finance V4
 * @dev Used by Agent Beta to execute trades based on Agent Alpha's signals
 * 
 * This contract provides three main functions:
 * - openLongCall: Swap USDC for Call Option Tokens (bullish bet)
 * - openLongPut: Swap USDC for Put Option Tokens (bearish bet)
 * - closePosition: Swap Option Tokens back to USDC
 * 
 * Security features:
 * - ReentrancyGuard: Prevents reentrancy attacks
 * - Ownable: Access control for admin functions
 * - Pausable: Emergency pause functionality
 * - Slippage protection: minAmountOut parameter
 */
contract SentientTrader is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    /// @notice The Thetanuts V4 Router contract
    IThetanutsRouter public immutable thetanutsRouter;

    /// @notice The USDC token contract (base currency)
    IERC20 public immutable usdc;

    /// @notice Mapping of authorized traders (agents)
    mapping(address => bool) public authorizedTraders;

    /// @notice Default slippage tolerance in basis points (e.g., 100 = 1%)
    uint256 public defaultSlippageBps;

    /// @notice Maximum slippage tolerance allowed (10%)
    uint256 public constant MAX_SLIPPAGE_BPS = 1000;

    /// @notice Basis points denominator
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ============ Events ============

    /**
     * @notice Emitted when a trade is executed
     * @param trader Address that executed the trade
     * @param optionToken Address of the option token traded
     * @param amountIn Amount of input tokens used
     * @param amountOut Amount of output tokens received
     * @param action String describing the action (OPEN_LONG_CALL, OPEN_LONG_PUT, CLOSE_POSITION)
     */
    event TradeExecuted(
        address indexed trader,
        address indexed optionToken,
        uint256 amountIn,
        uint256 amountOut,
        string action
    );

    /// @notice Emitted when a trader is authorized or deauthorized
    event TraderAuthorizationChanged(address indexed trader, bool authorized);

    /// @notice Emitted when default slippage is updated
    event SlippageUpdated(uint256 oldSlippage, uint256 newSlippage);

    // ============ Errors ============

    error UnauthorizedTrader();
    error InvalidAmount();
    error InvalidSlippage();
    error SlippageExceeded();
    error InvalidAddress();

    // ============ Modifiers ============

    modifier onlyAuthorized() {
        if (!authorizedTraders[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedTrader();
        }
        _;
    }

    // ============ Constructor ============

    /**
     * @notice Initialize the SentientTrader contract
     * @param _thetanutsRouter Address of the Thetanuts V4 Router
     * @param _usdc Address of the USDC token
     * @param _owner Address of the contract owner
     * @param _defaultSlippageBps Default slippage tolerance in basis points
     */
    constructor(
        address _thetanutsRouter,
        address _usdc,
        address _owner,
        uint256 _defaultSlippageBps
    ) Ownable(_owner) {
        if (_thetanutsRouter == address(0) || _usdc == address(0)) {
            revert InvalidAddress();
        }
        if (_defaultSlippageBps > MAX_SLIPPAGE_BPS) {
            revert InvalidSlippage();
        }

        thetanutsRouter = IThetanutsRouter(_thetanutsRouter);
        usdc = IERC20(_usdc);
        defaultSlippageBps = _defaultSlippageBps;

        // Owner is automatically an authorized trader
        authorizedTraders[_owner] = true;
    }

    // ============ External Functions ============

    /**
     * @notice Open a long call position by swapping USDC for Call Option Tokens
     * @param amount Amount of USDC to swap
     * @param optionToken Address of the Call Option Token
     * @return amountOut Amount of Call Option Tokens received
     */
    function openLongCall(
        uint256 amount,
        address optionToken
    ) external nonReentrant whenNotPaused onlyAuthorized returns (uint256 amountOut) {
        return _executeSwap(amount, optionToken, "OPEN_LONG_CALL", true);
    }

    /**
     * @notice Open a long put position by swapping USDC for Put Option Tokens
     * @param amount Amount of USDC to swap
     * @param optionToken Address of the Put Option Token
     * @return amountOut Amount of Put Option Tokens received
     */
    function openLongPut(
        uint256 amount,
        address optionToken
    ) external nonReentrant whenNotPaused onlyAuthorized returns (uint256 amountOut) {
        return _executeSwap(amount, optionToken, "OPEN_LONG_PUT", true);
    }

    /**
     * @notice Close a position by swapping Option Tokens back to USDC
     * @param optionToken Address of the Option Token to close
     * @param amount Amount of Option Tokens to swap
     * @return amountOut Amount of USDC received
     */
    function closePosition(
        address optionToken,
        uint256 amount
    ) external nonReentrant whenNotPaused onlyAuthorized returns (uint256 amountOut) {
        return _executeSwap(amount, optionToken, "CLOSE_POSITION", false);
    }

    /**
     * @notice Open a long call position with custom slippage tolerance
     * @param amount Amount of USDC to swap
     * @param optionToken Address of the Call Option Token
     * @param minAmountOut Minimum amount of Option Tokens to receive
     * @return amountOut Amount of Call Option Tokens received
     */
    function openLongCallWithSlippage(
        uint256 amount,
        address optionToken,
        uint256 minAmountOut
    ) external nonReentrant whenNotPaused onlyAuthorized returns (uint256 amountOut) {
        return _executeSwapWithSlippage(amount, optionToken, minAmountOut, "OPEN_LONG_CALL", true);
    }

    /**
     * @notice Open a long put position with custom slippage tolerance
     * @param amount Amount of USDC to swap
     * @param optionToken Address of the Put Option Token
     * @param minAmountOut Minimum amount of Option Tokens to receive
     * @return amountOut Amount of Put Option Tokens received
     */
    function openLongPutWithSlippage(
        uint256 amount,
        address optionToken,
        uint256 minAmountOut
    ) external nonReentrant whenNotPaused onlyAuthorized returns (uint256 amountOut) {
        return _executeSwapWithSlippage(amount, optionToken, minAmountOut, "OPEN_LONG_PUT", true);
    }

    /**
     * @notice Close a position with custom slippage tolerance
     * @param optionToken Address of the Option Token to close
     * @param amount Amount of Option Tokens to swap
     * @param minAmountOut Minimum amount of USDC to receive
     * @return amountOut Amount of USDC received
     */
    function closePositionWithSlippage(
        address optionToken,
        uint256 amount,
        uint256 minAmountOut
    ) external nonReentrant whenNotPaused onlyAuthorized returns (uint256 amountOut) {
        return _executeSwapWithSlippage(amount, optionToken, minAmountOut, "CLOSE_POSITION", false);
    }

    // ============ Admin Functions ============

    /**
     * @notice Authorize or deauthorize a trader
     * @param trader Address of the trader
     * @param authorized Whether to authorize or deauthorize
     */
    function setTraderAuthorization(address trader, bool authorized) external onlyOwner {
        if (trader == address(0)) {
            revert InvalidAddress();
        }
        authorizedTraders[trader] = authorized;
        emit TraderAuthorizationChanged(trader, authorized);
    }

    /**
     * @notice Update default slippage tolerance
     * @param newSlippageBps New slippage tolerance in basis points
     */
    function setDefaultSlippage(uint256 newSlippageBps) external onlyOwner {
        if (newSlippageBps > MAX_SLIPPAGE_BPS) {
            revert InvalidSlippage();
        }
        uint256 oldSlippage = defaultSlippageBps;
        defaultSlippageBps = newSlippageBps;
        emit SlippageUpdated(oldSlippage, newSlippageBps);
    }

    /**
     * @notice Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw tokens stuck in contract
     * @param token Address of the token to withdraw
     * @param to Address to send tokens to
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        if (to == address(0)) {
            revert InvalidAddress();
        }
        IERC20(token).safeTransfer(to, amount);
    }

    // ============ Internal Functions ============

    /**
     * @dev Execute a swap with default slippage
     */
    function _executeSwap(
        uint256 amount,
        address optionToken,
        string memory action,
        bool isOpenPosition
    ) internal returns (uint256 amountOut) {
        // Calculate minimum output with default slippage
        // For simplicity, we use amount as the expected output (1:1 ratio assumption)
        // In production, this should query price oracle first
        uint256 minAmountOut = (amount * (BPS_DENOMINATOR - defaultSlippageBps)) / BPS_DENOMINATOR;
        
        return _executeSwapWithSlippage(amount, optionToken, minAmountOut, action, isOpenPosition);
    }

    /**
     * @dev Execute a swap with custom slippage
     */
    function _executeSwapWithSlippage(
        uint256 amount,
        address optionToken,
        uint256 minAmountOut,
        string memory action,
        bool isOpenPosition
    ) internal returns (uint256 amountOut) {
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (optionToken == address(0)) {
            revert InvalidAddress();
        }

        address tokenIn;
        address tokenOut;

        if (isOpenPosition) {
            // Opening position: USDC -> Option Token
            tokenIn = address(usdc);
            tokenOut = optionToken;
        } else {
            // Closing position: Option Token -> USDC
            tokenIn = optionToken;
            tokenOut = address(usdc);
        }

        // Transfer input tokens from sender to this contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amount);

        // Approve router to spend tokens
        IERC20(tokenIn).safeIncreaseAllowance(address(thetanutsRouter), amount);

        // Execute swap via Thetanuts Router
        amountOut = thetanutsRouter.swapExactInput(
            tokenIn,
            tokenOut,
            amount,
            minAmountOut,
            msg.sender
        );

        // Verify slippage
        if (amountOut < minAmountOut) {
            revert SlippageExceeded();
        }

        emit TradeExecuted(msg.sender, optionToken, amount, amountOut, action);

        return amountOut;
    }

    // ============ View Functions ============

    /**
     * @notice Check if an address is an authorized trader
     * @param trader Address to check
     * @return bool True if authorized
     */
    function isAuthorizedTrader(address trader) external view returns (bool) {
        return authorizedTraders[trader] || trader == owner();
    }

    /**
     * @notice Get contract configuration
     * @return router Thetanuts Router address
     * @return usdcToken USDC token address
     * @return slippageBps Default slippage in basis points
     */
    function getConfig() external view returns (
        address router,
        address usdcToken,
        uint256 slippageBps
    ) {
        return (address(thetanutsRouter), address(usdc), defaultSlippageBps);
    }
}
