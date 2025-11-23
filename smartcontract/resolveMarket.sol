// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./placeBet.sol";

using SafeERC20 for IERC20Metadata;

contract ResolveMarket is PlaceBet{

    constructor(address initialOwner) PlaceBet(initialOwner) {}

    event MarketCancelled(uint256 indexed marketId, uint256 totalRefunds, address cancelledBy);
    event BetRefunded(uint256 indexed marketId, address indexed bettor, uint256 amount);

    event MarketResolved(uint256 indexed marketId, Outcome outcome, uint256 totalPrizePool, uint256 winningBettors);
    event PrizeDistributed(uint256 indexed marketId, address indexed bettor, uint256 betAmount, uint256 prizeAmount);

    /**
     * @dev Cancel a market and refund all bets to bettors
     * @param marketId The ID of the market to cancel
     */

    function cancelAndRefundAll(uint256 marketId) external nonReentrant {
        require(marketId < marketCount, "Market does not exist");
        
        Market storage market = markets[marketId];
        
        require(!market.isResolved, "Market is already resolved");
        require(
            market.outcome == Outcome.Pending, 
            "Market outcome already determined"
        );

        // Check if caller is either contract owner OR market creator
        require(
            msg.sender == owner() || msg.sender == market.marketCreator,
            "Only smart contract owner or market creator can cancel"
        );

        // Mark market as resolved and cancelled
        market.isResolved = true;
        market.outcome = Outcome.Cancelled;

        IERC20Metadata erc20 = IERC20Metadata(market.token);
        uint256 totalRefunded = 0;

        // Refund all YES bets
        for (uint256 i = 0; i < market.yesBets.length; i++) {
            Bet memory bet = market.yesBets[i];
            if (bet.amount > 0) {
                erc20.safeTransfer(bet.bettor, bet.amount);
                totalRefunded += bet.amount;
                emit BetRefunded(marketId, bet.bettor, bet.amount);
            }
        }

        // Refund all NO bets
        for (uint256 i = 0; i < market.noBets.length; i++) {
            Bet memory bet = market.noBets[i];
            if (bet.amount > 0) {
                erc20.safeTransfer(bet.bettor, bet.amount);
                totalRefunded += bet.amount;
                emit BetRefunded(marketId, bet.bettor, bet.amount);
            }
        }

        emit MarketCancelled(marketId, totalRefunded, msg.sender);
    }

      /**
     * @dev Resolve market and distribute prizes to winners based on their stake size
     * @param marketId The ID of the market to resolve
     * @param outcome The outcome of the market (YesWon or NoWon)
     */
    function resolvedFinalResult(uint256 marketId, Outcome outcome) external onlyOwner nonReentrant {
        require(marketId < marketCount, "Market does not exist");
        
        Market storage market = markets[marketId];
        
        require(!market.isResolved, "Market is already resolved");
        require(outcome == Outcome.YesWon || outcome == Outcome.NoWon, "Invalid outcome for resolution");
        require(market.outcome == Outcome.Pending, "Market outcome already determined");

        // Mark market as resolved
        market.isResolved = true;
        market.outcome = outcome;

        IERC20Metadata erc20 = IERC20Metadata(market.token);

        // Get the winning and losing bets
        Bet[] storage winningBets = (outcome == Outcome.YesWon) ? market.yesBets : market.noBets;
        Bet[] storage losingBets = (outcome == Outcome.YesWon) ? market.noBets : market.yesBets;

        // Calculate total pools
        uint256 totalWinningPool = _calculateTotalPool(winningBets);
        uint256 totalLosingPool = _calculateTotalPool(losingBets);
        uint256 totalPrizePool = totalWinningPool + totalLosingPool;

        // If there are no winning bets, refund all (edge case)
        if (winningBets.length == 0) {
            _refundAllBets(marketId, market.yesBets, erc20);
            _refundAllBets(marketId, market.noBets, erc20);
            emit MarketResolved(marketId, outcome, totalPrizePool, 0);
            return;
        }

        // Distribute prizes to winners based on their stake proportion
        uint256 winningBettorsCount = 0;
        
        for (uint256 i = 0; i < winningBets.length; i++) {
            Bet memory winningBet = winningBets[i];
            
            if (winningBet.amount > 0) {
                // Calculate winner's share of the total prize pool
                // prize = original bet + (betAmount / totalWinningPool) * totalLosingPool
                uint256 prizeAmount = winningBet.amount + 
                    (winningBet.amount * totalLosingPool) / totalWinningPool;
                
                // Transfer prize to winner
                erc20.safeTransfer(winningBet.bettor, prizeAmount);
                winningBettorsCount++;
                
                emit PrizeDistributed(marketId, winningBet.bettor, winningBet.amount, prizeAmount);
            }
        }

        emit MarketResolved(marketId, outcome, totalPrizePool, winningBettorsCount);
    }

    /**
     * @dev Calculate total amount in a bet array
     * @param bets Array of bets to calculate total for
     * @return total Total amount in the bets array
     */
    function _calculateTotalPool(Bet[] storage bets) internal view returns (uint256 total) {
        for (uint256 i = 0; i < bets.length; i++) {
            total += bets[i].amount;
        }
        return total;
    }

    /**
     * @dev Refund all bets in an array (used for edge cases)
     * @param marketId The market ID for event emission
     * @param bets Array of bets to refund
     * @param erc20 The token contract
     */
    function _refundAllBets(uint256 marketId, Bet[] storage bets, IERC20Metadata erc20) internal {
        for (uint256 i = 0; i < bets.length; i++) {
            Bet memory bet = bets[i];
            if (bet.amount > 0) {
                erc20.safeTransfer(bet.bettor, bet.amount);
                emit BetRefunded(marketId, bet.bettor, bet.amount);
            }
        }
    }
}