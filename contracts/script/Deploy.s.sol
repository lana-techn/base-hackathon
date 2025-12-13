// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../SentientTrader.sol";

/**
 * @title DeploySentientTrader
 * @notice Deployment script for SentientTrader contract
 * @dev Usage:
 *   - Local: forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast
 *   - Testnet: forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
 *   - Mainnet: forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
 */
contract DeploySentientTrader is Script {
    // Base Sepolia addresses (testnet)
    address constant USDC_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // Circle's bridged USDC on Base Sepolia
    address constant THETANUTS_ROUTER_SEPOLIA = address(0); // TODO: Get from Thetanuts team

    // Base Mainnet addresses
    address constant USDC_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // USDC on Base
    address constant THETANUTS_ROUTER_MAINNET = address(0); // TODO: Get from Thetanuts docs

    // Default slippage: 1%
    uint256 constant DEFAULT_SLIPPAGE_BPS = 100;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying SentientTrader with deployer:", deployer);

        // Determine which addresses to use based on chain ID
        uint256 chainId = block.chainid;
        address usdc;
        address router;

        if (chainId == 8453) {
            // Base Mainnet
            usdc = USDC_MAINNET;
            router = THETANUTS_ROUTER_MAINNET;
            console.log("Deploying to Base Mainnet");
        } else if (chainId == 84532) {
            // Base Sepolia
            usdc = USDC_SEPOLIA;
            router = THETANUTS_ROUTER_SEPOLIA;
            console.log("Deploying to Base Sepolia");
        } else {
            revert("Unsupported chain");
        }

        require(router != address(0), "Thetanuts Router address not set");
        require(usdc != address(0), "USDC address not set");

        vm.startBroadcast(deployerPrivateKey);

        SentientTrader trader = new SentientTrader(
            router,
            usdc,
            deployer,
            DEFAULT_SLIPPAGE_BPS
        );

        console.log("SentientTrader deployed at:", address(trader));

        vm.stopBroadcast();
    }
}

/**
 * @title DeployMocks
 * @notice Deploy mock contracts for local testing
 */
contract DeployMocks is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed at:", address(usdc));

        // Deploy mock router
        MockThetanutsRouter router = new MockThetanutsRouter();
        console.log("MockThetanutsRouter deployed at:", address(router));

        // Deploy mock option tokens
        MockOptionToken callOption = new MockOptionToken("ETH Call Option", "ETH-CALL");
        MockOptionToken putOption = new MockOptionToken("ETH Put Option", "ETH-PUT");
        console.log("MockCallOption deployed at:", address(callOption));
        console.log("MockPutOption deployed at:", address(putOption));

        // Deploy SentientTrader with mocks
        address deployer = vm.addr(deployerPrivateKey);
        SentientTrader trader = new SentientTrader(
            address(router),
            address(usdc),
            deployer,
            100 // 1% slippage
        );
        console.log("SentientTrader deployed at:", address(trader));

        vm.stopBroadcast();
    }
}

// Import mocks for deployment
import "../mocks/MockTokens.sol";
import "../mocks/MockThetanutsRouter.sol";
