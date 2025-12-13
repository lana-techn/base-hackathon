// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import "../SentientTrader.sol";
import "../mocks/MockTokens.sol";
import "../mocks/MockThetanutsRouter.sol";

/**
 * @title SentientTraderTest
 * @notice Comprehensive tests for SentientTrader contract
 * @dev Tests cover:
 * - openLongCall: Open call option positions
 * - openLongPut: Open put option positions
 * - closePosition: Close option positions
 * - Access control: Authorized traders only
 * - Error conditions: Invalid inputs, slippage, etc.
 * - Event emission: TradeExecuted events
 * 
 * **Feature: bethna-ai-trader, Property 9: Smart Contract Function Availability**
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
 * 
 * **Feature: bethna-ai-trader, Property 10: Event Emission Consistency**
 * **Validates: Requirements 5.5**
 */
contract SentientTraderTest is Test {
    // Contracts
    SentientTrader public trader;
    MockThetanutsRouter public router;
    MockUSDC public usdc;
    MockOptionToken public callOption;
    MockOptionToken public putOption;

    // Actors
    address public owner;
    address public agent;
    address public unauthorized;

    // Constants
    uint256 constant INITIAL_BALANCE = 1_000_000e6; // 1M USDC
    uint256 constant INITIAL_OPTIONS = 1_000_000e18; // 1M Options
    uint256 constant DEFAULT_SLIPPAGE_BPS = 100; // 1%

    // Events (for testing emission)
    event TradeExecuted(
        address indexed trader,
        address indexed optionToken,
        uint256 amountIn,
        uint256 amountOut,
        string action
    );
    event TraderAuthorizationChanged(address indexed trader, bool authorized);
    event SlippageUpdated(uint256 oldSlippage, uint256 newSlippage);

    function setUp() public {
        // Setup actors
        owner = address(this);
        agent = makeAddr("agent");
        unauthorized = makeAddr("unauthorized");

        // Deploy mock tokens
        usdc = new MockUSDC();
        callOption = new MockOptionToken("ETH Call Option", "ETH-CALL");
        putOption = new MockOptionToken("ETH Put Option", "ETH-PUT");

        // Deploy mock router
        router = new MockThetanutsRouter();

        // Deploy SentientTrader
        trader = new SentientTrader(
            address(router),
            address(usdc),
            owner,
            DEFAULT_SLIPPAGE_BPS
        );

        // Setup balances
        usdc.mint(agent, INITIAL_BALANCE);
        usdc.mint(owner, INITIAL_BALANCE);
        callOption.mint(address(router), INITIAL_OPTIONS);
        putOption.mint(address(router), INITIAL_OPTIONS);
        callOption.mint(agent, INITIAL_OPTIONS);
        putOption.mint(agent, INITIAL_OPTIONS);
        usdc.mint(address(router), INITIAL_BALANCE);

        // Authorize agent
        trader.setTraderAuthorization(agent, true);

        // Approve tokens
        vm.startPrank(agent);
        usdc.approve(address(trader), type(uint256).max);
        callOption.approve(address(trader), type(uint256).max);
        putOption.approve(address(trader), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(owner);
        usdc.approve(address(trader), type(uint256).max);
        callOption.approve(address(trader), type(uint256).max);
        putOption.approve(address(trader), type(uint256).max);
        vm.stopPrank();
    }

    // ============ Constructor Tests ============

    function test_constructor_setsCorrectValues() public view {
        assertEq(address(trader.thetanutsRouter()), address(router));
        assertEq(address(trader.usdc()), address(usdc));
        assertEq(trader.owner(), owner);
        assertEq(trader.defaultSlippageBps(), DEFAULT_SLIPPAGE_BPS);
        assertTrue(trader.authorizedTraders(owner));
    }

    function test_constructor_revertsOnZeroRouterAddress() public {
        vm.expectRevert(SentientTrader.InvalidAddress.selector);
        new SentientTrader(address(0), address(usdc), owner, 100);
    }

    function test_constructor_revertsOnZeroUsdcAddress() public {
        vm.expectRevert(SentientTrader.InvalidAddress.selector);
        new SentientTrader(address(router), address(0), owner, 100);
    }

    function test_constructor_revertsOnInvalidSlippage() public {
        vm.expectRevert(SentientTrader.InvalidSlippage.selector);
        new SentientTrader(address(router), address(usdc), owner, 1001);
    }

    // ============ openLongCall Tests ============

    function test_openLongCall_successfulSwap() public {
        uint256 amount = 1000e6; // 1000 USDC
        uint256 balanceBefore = usdc.balanceOf(agent);

        vm.prank(agent);
        uint256 amountOut = trader.openLongCall(amount, address(callOption));

        assertGt(amountOut, 0);
        assertEq(usdc.balanceOf(agent), balanceBefore - amount);
        assertGt(callOption.balanceOf(agent), INITIAL_OPTIONS);
    }

    function test_openLongCall_emitsTradeExecutedEvent() public {
        uint256 amount = 1000e6;
        uint256 expectedOut = (amount * (10000 - DEFAULT_SLIPPAGE_BPS)) / 10000;

        vm.expectEmit(true, true, false, false);
        emit TradeExecuted(agent, address(callOption), amount, expectedOut, "OPEN_LONG_CALL");

        vm.prank(agent);
        trader.openLongCall(amount, address(callOption));
    }

    function test_openLongCall_revertsForUnauthorized() public {
        vm.prank(unauthorized);
        vm.expectRevert(SentientTrader.UnauthorizedTrader.selector);
        trader.openLongCall(1000e6, address(callOption));
    }

    function test_openLongCall_revertsOnZeroAmount() public {
        vm.prank(agent);
        vm.expectRevert(SentientTrader.InvalidAmount.selector);
        trader.openLongCall(0, address(callOption));
    }

    function test_openLongCall_revertsOnZeroOptionToken() public {
        vm.prank(agent);
        vm.expectRevert(SentientTrader.InvalidAddress.selector);
        trader.openLongCall(1000e6, address(0));
    }

    // ============ openLongPut Tests ============

    function test_openLongPut_successfulSwap() public {
        uint256 amount = 1000e6;
        uint256 balanceBefore = usdc.balanceOf(agent);

        vm.prank(agent);
        uint256 amountOut = trader.openLongPut(amount, address(putOption));

        assertGt(amountOut, 0);
        assertEq(usdc.balanceOf(agent), balanceBefore - amount);
        assertGt(putOption.balanceOf(agent), INITIAL_OPTIONS);
    }

    function test_openLongPut_emitsTradeExecutedEvent() public {
        uint256 amount = 1000e6;

        vm.expectEmit(true, true, false, false);
        emit TradeExecuted(agent, address(putOption), amount, 0, "OPEN_LONG_PUT");

        vm.prank(agent);
        trader.openLongPut(amount, address(putOption));
    }

    // ============ closePosition Tests ============

    function test_closePosition_successfulSwap() public {
        uint256 amount = 1000e6; // 1000 Option Tokens (use smaller amount for 1:1 exchange rate)
        uint256 balanceBefore = callOption.balanceOf(agent);

        vm.prank(agent);
        uint256 amountOut = trader.closePosition(address(callOption), amount);

        assertGt(amountOut, 0);
        assertEq(callOption.balanceOf(agent), balanceBefore - amount);
    }

    function test_closePosition_emitsTradeExecutedEvent() public {
        uint256 amount = 1000e6; // Use smaller amount for 1:1 exchange rate

        vm.expectEmit(true, true, false, false);
        emit TradeExecuted(agent, address(callOption), amount, 0, "CLOSE_POSITION");

        vm.prank(agent);
        trader.closePosition(address(callOption), amount);
    }

    // ============ Slippage Tests ============

    function test_openLongCallWithSlippage_customSlippage() public {
        uint256 amount = 1000e6;
        uint256 minAmountOut = 900e6; // 10% slippage tolerance

        vm.prank(agent);
        uint256 amountOut = trader.openLongCallWithSlippage(amount, address(callOption), minAmountOut);

        assertGe(amountOut, minAmountOut);
    }

    // ============ Access Control Tests ============

    function test_setTraderAuthorization_authorizes() public {
        address newTrader = makeAddr("newTrader");
        assertFalse(trader.authorizedTraders(newTrader));

        vm.expectEmit(true, false, false, true);
        emit TraderAuthorizationChanged(newTrader, true);

        trader.setTraderAuthorization(newTrader, true);
        assertTrue(trader.authorizedTraders(newTrader));
    }

    function test_setTraderAuthorization_deauthorizes() public {
        trader.setTraderAuthorization(agent, false);
        assertFalse(trader.authorizedTraders(agent));
    }

    function test_setTraderAuthorization_revertsForNonOwner() public {
        vm.prank(agent);
        vm.expectRevert();
        trader.setTraderAuthorization(unauthorized, true);
    }

    function test_setTraderAuthorization_revertsOnZeroAddress() public {
        vm.expectRevert(SentientTrader.InvalidAddress.selector);
        trader.setTraderAuthorization(address(0), true);
    }

    // ============ Admin Function Tests ============

    function test_setDefaultSlippage_updates() public {
        uint256 newSlippage = 200;

        vm.expectEmit(false, false, false, true);
        emit SlippageUpdated(DEFAULT_SLIPPAGE_BPS, newSlippage);

        trader.setDefaultSlippage(newSlippage);
        assertEq(trader.defaultSlippageBps(), newSlippage);
    }

    function test_setDefaultSlippage_revertsOnExceedMax() public {
        vm.expectRevert(SentientTrader.InvalidSlippage.selector);
        trader.setDefaultSlippage(1001);
    }

    function test_pause_preventsTrading() public {
        trader.pause();

        vm.prank(agent);
        vm.expectRevert();
        trader.openLongCall(1000e6, address(callOption));
    }

    function test_unpause_allowsTrading() public {
        trader.pause();
        trader.unpause();

        vm.prank(agent);
        uint256 amountOut = trader.openLongCall(1000e6, address(callOption));
        assertGt(amountOut, 0);
    }

    function test_emergencyWithdraw_withdrawsTokens() public {
        usdc.mint(address(trader), 1000e6);
        uint256 balanceBefore = usdc.balanceOf(owner);

        trader.emergencyWithdraw(address(usdc), owner, 1000e6);

        assertEq(usdc.balanceOf(owner), balanceBefore + 1000e6);
    }

    function test_emergencyWithdraw_revertsOnZeroAddress() public {
        usdc.mint(address(trader), 1000e6);

        vm.expectRevert(SentientTrader.InvalidAddress.selector);
        trader.emergencyWithdraw(address(usdc), address(0), 1000e6);
    }

    // ============ View Function Tests ============

    function test_isAuthorizedTrader_returnsCorrectly() public view {
        assertTrue(trader.isAuthorizedTrader(owner));
        assertTrue(trader.isAuthorizedTrader(agent));
        assertFalse(trader.isAuthorizedTrader(unauthorized));
    }

    function test_getConfig_returnsCorrectly() public view {
        (address routerAddr, address usdcAddr, uint256 slippageBps) = trader.getConfig();
        assertEq(routerAddr, address(router));
        assertEq(usdcAddr, address(usdc));
        assertEq(slippageBps, DEFAULT_SLIPPAGE_BPS);
    }

    // ============ Fuzz Tests ============

    /**
     * @notice Fuzz test for openLongCall with varying amounts
     * **Feature: bethna-ai-trader, Property 9: Smart Contract Function Availability**
     */
    function testFuzz_openLongCall_varyingAmounts(uint256 amount) public {
        // Bound amount to realistic range
        amount = bound(amount, 1, INITIAL_BALANCE);

        vm.prank(agent);
        uint256 amountOut = trader.openLongCall(amount, address(callOption));

        assertGt(amountOut, 0);
    }

    /**
     * @notice Fuzz test for closePosition with varying amounts
     */
    function testFuzz_closePosition_varyingAmounts(uint256 amount) public {
        // Bound amount to realistic range - use USDC balance since exchange rate is 1:1
        amount = bound(amount, 1, INITIAL_BALANCE);

        vm.prank(agent);
        uint256 amountOut = trader.closePosition(address(callOption), amount);

        assertGt(amountOut, 0);
    }

    /**
     * @notice Fuzz test for slippage settings
     */
    function testFuzz_setDefaultSlippage_validRange(uint256 slippage) public {
        // Bound to valid range
        slippage = bound(slippage, 0, 1000);

        trader.setDefaultSlippage(slippage);
        assertEq(trader.defaultSlippageBps(), slippage);
    }

    // ============ Integration Tests ============

    function test_fullTradingFlow() public {
        // 1. Open Call Position
        uint256 usdcAmount = 10000e6;
        vm.prank(agent);
        uint256 callTokens = trader.openLongCall(usdcAmount, address(callOption));
        assertGt(callTokens, 0);

        // 2. Open Put Position
        vm.prank(agent);
        uint256 putTokens = trader.openLongPut(usdcAmount, address(putOption));
        assertGt(putTokens, 0);

        // 3. Close Call Position
        vm.prank(agent);
        uint256 usdcFromCall = trader.closePosition(address(callOption), callTokens);
        assertGt(usdcFromCall, 0);

        // 4. Close Put Position
        vm.prank(agent);
        uint256 usdcFromPut = trader.closePosition(address(putOption), putTokens);
        assertGt(usdcFromPut, 0);
    }
}
