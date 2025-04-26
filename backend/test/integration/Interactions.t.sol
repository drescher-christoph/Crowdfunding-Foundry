// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { Test, console } from "forge-std/Test.sol";
import { Crowdfunding } from "../../src/Crowdfunding.sol";
import {DeployCrowdfunding} from "../../script/DeployCrowdfunding.s.sol";
import { Interactions } from "../../script/Interactions.s.sol";

contract InteractionsTest is Test {

    Crowdfunding campaign;

    address USER = makeAddr("user");
    uint256 constant STARTING_BALANCE = 10 ether;
    uint256 constant GAS_PRICE = 1;

    function setUp() external {
        DeployCrowdfunding deployCF = new DeployCrowdfunding();
        campaign = deployCF.run(msg.sender);
        vm.deal(USER, STARTING_BALANCE);
    }

    function test_OwnerCanCreateTier() public {
        Interactions deployedCampaign = new Interactions();
        deployedCampaign.createTier(address(campaign), "Tier 1", 0.01 ether, "Reward 1");

        uint256 tiersCount = campaign.getTiersCount();

        assert(tiersCount != 0);
    }

    function test_UserCanFundTier() public {
        Interactions deployedCampaign = new Interactions();
        deployedCampaign.createTier(address(campaign), "Tier 1", 0.01 ether, "Reward 1");
        deployedCampaign.createTier(address(campaign), "Tier 2", 0.025 ether, "Reward 2");
        vm.startPrank(USER);
        vm.deal(USER, STARTING_BALANCE);
        
        campaign.fund{value: 0.01 ether}(0);
        uint256 camapignBalance = address(campaign).balance;

        assert(camapignBalance == 0.01 ether);
    }
}