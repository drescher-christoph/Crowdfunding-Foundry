// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { Test, console } from "forge-std/Test.sol";
import { Crowdfunding } from "../../src/Crowdfunding.sol";

contract CrowdfundingTest is Test {

    Crowdfunding crowdfunding;

    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");
    address user3 = makeAddr("user3");
    address user4 = makeAddr("user4");
    address user5 = makeAddr("user5");

    uint256 constant STARTING_BALANCE = 100 ether;

    function setUp() external {
        vm.deal(user1, STARTING_BALANCE);
        vm.deal(user2, STARTING_BALANCE);
        vm.deal(user3, STARTING_BALANCE);
        vm.deal(user4, STARTING_BALANCE);
        vm.deal(user5, STARTING_BALANCE);

        createCampaign();
    }

    function createCampaign() internal {
        vm.startPrank(user1);
        crowdfunding = new Crowdfunding(user1, "Test Campaign", "Some crowdfunding stuff...", 0.1 ether, 30, "Foto von MD SHAHJALAL JOMODDER von Pexels: https://www.pexels.com/de-de/foto/31601281/");
        vm.stopPrank();
    }

    function createTiers() internal {
        vm.startPrank(user1);
        crowdfunding.createFundTier("Tier 1", 0.01 ether, "Reward 1");
        crowdfunding.createFundTier("Tier 2", 0.025 ether, "Reward 2");
        crowdfunding.createFundTier("Tier 3", 0.05 ether, "Reward 3");
        vm.stopPrank();
    }

    function test_UserCanCreateTier() public {
        createTiers();

        uint256 tiersCount = crowdfunding.getTiersCount();
        assert(tiersCount == 3);
    }

    function test_UserCanFundCampaignTier() public {
        createTiers();

        vm.startPrank(user2);
        crowdfunding.fund{value: 0.01 ether}(0);
        vm.stopPrank();

        uint256 campaignBalance = address(crowdfunding).balance;
        assert(campaignBalance == 0.01 ether);
        assert(crowdfunding.supporters(user2) == 0.01 ether);
    }

    function test_OwnerCanWithdraw() public {
        createTiers();

        vm.startPrank(user2);
        crowdfunding.fund{value: 0.05 ether}(2);
        vm.stopPrank();

        vm.startPrank(user3);
        crowdfunding.fund{value: 0.05 ether}(2);
        vm.stopPrank();

        vm.startPrank(user4);
        crowdfunding.fund{value: 0.05 ether}(2);
        vm.stopPrank();

        vm.startPrank(user1);
        crowdfunding.withdraw();
        vm.stopPrank();
        
        uint256 ownerBalance = address(user1).balance;
        uint256 crowdfundingBalance = address(crowdfunding).balance;

        assert(crowdfunding.state() == Crowdfunding.CampaignState.Successful);
        assert(ownerBalance > STARTING_BALANCE);
        assert(crowdfundingBalance == 0);
    }
    
}