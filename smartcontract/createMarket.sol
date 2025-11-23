// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./manageCurrencies.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20Metadata;

contract CreateMarket is ReentrancyGuard, ManageCurrencies  {
    constructor(address initialOwner) ManageCurrencies(initialOwner) {}

    struct Bet {
        address bettor;
        uint256 amount;
        uint256 timestamp;
    }
    enum Outcome {
        Pending,
        YesWon,
        NoWon,
        Cancelled
    }

    struct Market {
        uint256 id;
        address marketCreator;
        address token;
        Bet[] yesBets;
        Bet[] noBets;
        bool isResolved;
        Outcome outcome;
    }

    // State variables
    mapping(uint256 => Market) public markets;
    uint256 public marketCount;

    event MarketCreated(uint256 indexed marketId, address indexed creator, address token);


    function createMarket(address token) external onlyOwner nonReentrant returns (uint256) {
                // Check if the token is supported
        require(supportedCurrencies[token], "Token is not supported");
        require(token != address(0), "Invalid token address");
        
        uint256 marketId = marketCount;

        Market storage newMarket = markets[marketId];
        newMarket.id = marketId;
        newMarket.marketCreator = msg.sender;
        newMarket.token = token;
        newMarket.isResolved = false;
        newMarket.outcome = Outcome.Pending;

        marketCount++;
        emit MarketCreated(marketId, msg.sender, token);
        return marketId;
    }
}
