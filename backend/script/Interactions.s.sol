//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { Script } from "forge-std/Script.sol";
import { Crowdfunding } from "../src/Crowdfunding.sol";
import { DevOpsTools } from "foundry-devops/src/DevOpsTools.sol";

contract Interactions is Script {

    function addTier(address _mostRecentlyDeployed, string memory _tierName, uint256 _tierAmount) public {
        vm.startBroadcast();
        Crowdfunding campaign = Crowdfunding(_mostRecentlyDeployed);
        campaign.addTier(_tierName, _tierAmount);
        vm.stopBroadcast();
    }

    function fundCampaign(address _mostRecentlyDeployed, uint256 _tierId) public {
        vm.startBroadcast();
        Crowdfunding campaign = Crowdfunding(_mostRecentlyDeployed);
        campaign.fund{value: 0.01 ether}(_tierId);
        vm.stopBroadcast();
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("Crowdfunding", block.chainid);
        addTier(mostRecentlyDeployed, "Tier 1", 0.01 ether);
        addTier(mostRecentlyDeployed, "Tier 2", 0.05 ether);
        addTier(mostRecentlyDeployed, "Tier 3", 0.1 ether);
        fundCampaign(mostRecentlyDeployed, 1);
    }

}