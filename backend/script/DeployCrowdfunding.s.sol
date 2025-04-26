//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { Script } from "forge-std/Script.sol";
import { Crowdfunding } from "../src/Crowdfunding.sol";

contract DeployCrowdfunding is Script {

    function run(address _owner) external returns (Crowdfunding) {
        vm.startBroadcast();
        Crowdfunding fundMe = new Crowdfunding(_owner, "Test Campagne", "Some crowdfunding stuff...", 15000000000000000000, 30, "Foto von MD SHAHJALAL JOMODDER von Pexels: https://www.pexels.com/de-de/foto/31601281/");
        vm.stopBroadcast();
        return fundMe;
    }

}