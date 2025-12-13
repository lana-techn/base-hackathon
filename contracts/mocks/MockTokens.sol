// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockERC20
 * @notice Mock ERC20 token for testing
 */
contract MockERC20 is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}

/**
 * @title MockUSDC
 * @notice Mock USDC token with 6 decimals
 */
contract MockUSDC is MockERC20 {
    constructor() MockERC20("USD Coin", "USDC", 6) {}
}

/**
 * @title MockOptionToken
 * @notice Mock Option Token with 18 decimals
 */
contract MockOptionToken is MockERC20 {
    constructor(string memory name, string memory symbol) MockERC20(name, symbol, 18) {}
}
