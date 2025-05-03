// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {CrowdfundingFactory} from "../../src/CrowdfundingFactory.sol";
import {Crowdfunding} from "../../src/Crowdfunding.sol";

contract CrowdfundingFactoryTest is Test {
    CrowdfundingFactory public factory;
    address public owner;
    address public user1;
    address public user2;
    address public user3;

    string public constant TEST_TITLE = "Test Campaign";
    string public constant TEST_DESC = "This is a test campaign";
    uint256 public constant TEST_GOAL = 1 ether;
    uint256 public constant TEST_GOAL_2 = 20 ether;
    uint256 public constant TEST_DURATION = 30;
    string public constant TEST_IMAGE = "https://example.com/image.png";

    event CampaignCreated(
        address indexed campaignAddress,
        string title,
        string description,
        uint256 goal,
        uint256 deadline,
        string imageURL
    );
    event CampaignFactoryPaused(bool paused);

    function setUp() public {
        owner = address(1);
        user1 = address(2);
        user2 = address(3);

        vm.startPrank(owner);
        factory = new CrowdfundingFactory();
        vm.stopPrank();
    }

    function testCreateCampaign() public {
        vm.startPrank(user1);
        factory.createCampaign(
            msg.sender,
            TEST_TITLE,
            TEST_DESC,
            TEST_GOAL,
            TEST_DURATION,
            TEST_IMAGE
        );
        vm.stopPrank();

        assertEq(factory.getCamapaignsCount(), 1);

        (
            ,,
            string memory title,
            string memory description,
            uint256 goal,
            ,
            string memory imageURL
        ) = factory.campaigns(0);
        assertEq(title, TEST_TITLE);
        assertEq(description, TEST_DESC);
        assertEq(goal, TEST_GOAL);
        assertEq(imageURL, TEST_IMAGE);

        CrowdfundingFactory.Campaign[] memory userCampaigns = factory
            .getUserCampaigns(user1);
        assertEq(userCampaigns.length, 1);
        assertEq(userCampaigns[0].title, TEST_TITLE);
    }

    function testFundCampaign() public {
        vm.startPrank(user1);
        factory.createCampaign(
            user1,
            TEST_TITLE,
            TEST_DESC,
            TEST_GOAL,
            TEST_DURATION,
            TEST_IMAGE
        );
        (, address campaignAddress, , , , , ) = factory.userCampaigns(user1, 0);
        Crowdfunding campaign = Crowdfunding(campaignAddress);
        campaign.addTier("Tier 1", 0.5 ether);
        campaign.addTier("Tier 2", 0.75 ether);
        vm.stopPrank();

        assertEq(campaign.owner(), user1);

        uint256 campaignCount = factory.getCamapaignsCount();
        assertEq(campaignCount, 1);

        vm.startPrank(user2);
        vm.deal(user2, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.deal(user3, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        assertEq(address(campaign).balance, 1 ether);
    }

    function testWithdrawWhenSuccessful() public {
        vm.startPrank(user1);
        factory.createCampaign(
            user1,
            TEST_TITLE,
            TEST_DESC,
            TEST_GOAL,
            TEST_DURATION,
            TEST_IMAGE
        );
        (, address campaignAddress, , , , , ) = factory.userCampaigns(user1, 0);
        Crowdfunding campaign = Crowdfunding(campaignAddress);
        campaign.addTier("Tier 1", 0.5 ether);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.deal(user2, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.deal(user3, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        vm.startPrank(user1);
        campaign.withdraw();
        vm.stopPrank();

        assertEq(address(campaign).balance, 0);
    }

    function testWithdrawWhenNotSuccessful() public {
        vm.startPrank(user1);
        factory.createCampaign(
            user1,
            TEST_TITLE,
            TEST_DESC,
            TEST_GOAL,
            TEST_DURATION,
            TEST_IMAGE
        );
        (, address campaignAddress, , , , , ) = factory.userCampaigns(user1, 0);
        Crowdfunding campaign = Crowdfunding(campaignAddress);
        campaign.addTier("Tier 1", 0.5 ether);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.deal(user2, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(Crowdfunding.CampaignNotSuccessful.selector);
        campaign.withdraw();
        vm.stopPrank();
    }

    function testRefundSupporters() public {
        vm.startPrank(user1);
        factory.createCampaign(
            user1,
            TEST_TITLE,
            TEST_DESC,
            TEST_GOAL_2,
            TEST_DURATION,
            TEST_IMAGE
        );
        (, address campaignAddress, , , , , ) = factory.userCampaigns(user1, 0);
        Crowdfunding campaign = Crowdfunding(campaignAddress);
        campaign.addTier("Tier 1", 0.5 ether);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.deal(user2, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.deal(user3, 2 ether);
        campaign.fund{value: 0.5 ether}(0);
        vm.stopPrank();

        uint256 timeOver = 32 days;
        vm.warp(block.timestamp + timeOver);

        vm.startPrank(user2);
        campaign.refund();
        vm.stopPrank();

        vm.startPrank(user3);
        campaign.refund();
        vm.stopPrank();

        assertEq(address(campaign).balance, 0);
        assertEq(campaign.supporters(user2), 0);
    }

    function testTogglePause() public {
        assertEq(factory.paused(), false);

        vm.prank(owner);
        factory.togglePaused();
        assertEq(factory.paused(), true);

        vm.prank(owner);
        factory.togglePaused();
        assertEq(factory.paused(), false);
    }

    function testPausedFunctionality() public {
        vm.prank(owner);
        factory.togglePaused();

        vm.prank(user1);
        vm.expectRevert("The campaign is currently paused!");
        factory.createCampaign(
            msg.sender,
            TEST_TITLE,
            TEST_DESC,
            TEST_GOAL,
            TEST_DURATION,
            TEST_IMAGE
        );
    }
}
