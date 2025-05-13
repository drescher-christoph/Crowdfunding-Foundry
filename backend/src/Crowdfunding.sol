//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    error CampaignEnded();
    error InvalidTierIndex();
    error IncorrectFundingAmount();
    error CampaignNotActive();
    error CampaignNotSuccessful();
    error CampaignNotFailed();
    error NoFundsToWithdraw();

    address public owner;
    string public title;
    string public description;
    uint256 public goal;
    uint256 public deadline;
    string public imageURL;

    enum CampaignState {
        Active,
        Successful,
        Failed,
        Paused
    }

    CampaignState public state;

    struct Tier {
        string name;
        uint256 amount;
        uint256 backers;
    }

    struct Supporter {
        uint256 totalContributed;
        mapping(uint256 => bool) fundedTiers;
    }

    Tier[] public tiers;
    mapping(address => Supporter) public supporters;

    event CampaignFunded(
        address indexed supporter,
        uint256 tierIndex,
        uint256 amount
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event FundsRefunded(address supporter, uint256 amount);
    event FundTierCreated(string tierName, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier campaignOpen() {
        require(
            state == CampaignState.Active || state == CampaignState.Successful,
            "Campaign is not active"
        );
        _;
    }

    constructor(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays,
        string memory _imgURL
    ) {
        owner = _owner;
        title = _title;
        description = _description;
        goal = _goal;
        deadline = block.timestamp + _durationInDays * 1 days;
        imageURL = _imgURL;
        state = CampaignState.Active;
    }

    function checkAndUpdateState() public {
    if (block.timestamp >= deadline) {  
        if (address(this).balance >= goal) {
            state = CampaignState.Successful; 
        } else {
            state = CampaignState.Failed; 
        }
    } else {  
        state = CampaignState.Active; 
    }
}

    function fund(uint256 _tierIndex) public payable campaignOpen {
        if (block.timestamp >= deadline) revert CampaignEnded();
        if (_tierIndex >= tiers.length) revert InvalidTierIndex();
        if (msg.value < tiers[_tierIndex].amount)
            revert IncorrectFundingAmount();

        supporters[msg.sender].totalContributed += msg.value;
        supporters[msg.sender].fundedTiers[_tierIndex] = true;

        emit CampaignFunded(msg.sender, _tierIndex, msg.value);

        checkAndUpdateState();
    }

    function withdraw() public onlyOwner {
        checkAndUpdateState();

        if (state != CampaignState.Successful) revert CampaignNotSuccessful();
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoFundsToWithdraw();

        payable(owner).transfer(balance);

        emit FundsWithdrawn(owner, balance);
    }

    function refund() public {
        checkAndUpdateState();

        if (state != CampaignState.Failed) revert CampaignNotFailed();
        uint256 balance = supporters[msg.sender].totalContributed;
        if (balance == 0) revert NoFundsToWithdraw();

        supporters[msg.sender].totalContributed = 0;
        payable(msg.sender).transfer(balance);
        emit FundsRefunded(msg.sender, balance);
    }

    function addTier(string memory _name, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0.");
        tiers.push(Tier(_name, _amount, 0));

        emit FundTierCreated(_name, _amount);
    }

    function removeTier(uint256 _index) public onlyOwner {
        require(_index < tiers.length, "Tier does not exist.");
        tiers[_index] = tiers[tiers.length - 1];
        tiers.pop();
    }

    function getTiersCount() public view returns (uint256) {
        return tiers.length;
    }

    function getTiers() public view returns (Tier[] memory) {
        return tiers;
    }
}
