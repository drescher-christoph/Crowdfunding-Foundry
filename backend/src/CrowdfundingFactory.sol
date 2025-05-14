//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Crowdfunding} from "./Crowdfunding.sol";

contract CrowdfundingFactory is Ownable {

    bool public paused;

    struct Campaign {
        address owner;
        address campaignAddress;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        string imageURL;
    }

    Campaign[] public campaigns;
    mapping(address => Campaign[]) public userCampaigns;

    event CampaignCreated(
        address indexed campaignAddress,
        string title,
        string description,
        uint256 goal,
        uint256 deadline,
        string imageURL
    );
    event CampaignFactoryPaused(bool paused);

    modifier notPaused() {
        require(!paused, "The campaign is currently paused!");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _desc,
        uint256 _goal,
        uint256 _durationInDays,
        string memory _imageURL
    ) external notPaused {
        Crowdfunding newCampaign = new Crowdfunding(
            _owner,
            _title,
            _desc,
            _goal,
            _durationInDays,
            _imageURL
        );
        Campaign memory newCampaignStruct = Campaign({
            owner: _owner,
            campaignAddress: address(newCampaign),
            title: _title,
            description: _desc,
            goal: _goal,
            deadline: block.timestamp + (_durationInDays * 1 days),
            imageURL: _imageURL
        });

        campaigns.push(newCampaignStruct);
        userCampaigns[msg.sender].push(newCampaignStruct);

        emit CampaignCreated(
            address(newCampaign),
            _title,
            _desc,
            _goal,
            block.timestamp + 30 days,
            _imageURL
        );
    }

    function togglePaused() public onlyOwner {
        paused = !paused;
        emit CampaignFactoryPaused(paused);
    }

    function getSupportedCampaigns(
    address _user
) external view returns (Campaign[] memory) {
    uint256 supportedCount = 0;

    // Zähle die Anzahl der unterstützten Kampagnen
    for (uint256 i = 0; i < campaigns.length; i++) {
        Crowdfunding campaign = Crowdfunding(campaigns[i].campaignAddress);
        if (campaign.supporters(_user) > 0) {
            supportedCount++;
        }
    }

    // Erstelle ein Array für die unterstützten Kampagnen
    Campaign[] memory supportedCampaigns = new Campaign[](supportedCount);
    uint256 index = 0;

    for (uint256 i = 0; i < campaigns.length; i++) {
        Crowdfunding campaign = Crowdfunding(campaigns[i].campaignAddress);
        if (campaign.supporters(_user) > 0) {
            supportedCampaigns[index] = campaigns[i];
            index++;
        }
    }

    return supportedCampaigns;
}

    function getUserCampaigns(
        address _user
    ) external view returns (Campaign[] memory) {
        return userCampaigns[_user];
    }

    function getCampaign(
        uint256 _index
    ) external view returns (Campaign memory) {
        require(_index < campaigns.length, "Campaign does not exist");
        return campaigns[_index];
    }

    function getCamapaignsCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

}
