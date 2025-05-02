import React from "react";
import { writeContract } from "viem/actions";
import { CAMPAIGN_ABI } from "../../constants";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";


const TierButton = ({ tierIndex, name, price, reward, contractAddress }) => {

  const { writeContract } = useWriteContract()

  if (!CAMPAIGN_ABI || !contractAddress) {
    console.error("ABI or campaign address is missing.");
    return;
  }

  const handleFund = async () => {
    try {
      writeContract({
        abi: CAMPAIGN_ABI,
        address: contractAddress,
        functionName: "fund",
        args: [tierIndex],
        value: ethers.parseUnits(String(price)),
      });
    } catch (error) {
      console.error("Error supporting tier:", error);
    } finally {
      // Reset the form or handle any cleanup if necessary
    }
  };

  return (
    <button
      onClick={handleFund}
      className="flex-1 min-w-[150px] px-4 py-2 text-black font-semibold hover:bg-[#DEFBB6] rounded-2xl shadow-sm border-2 transition-transform hover:border-black hover:scale-[1.02] duration-200"
    >
      <div className="flex flex-col gap-2">
        {name}
        <span className="font-bold text-4xl">{price} ETH</span>
        {reward}
      </div>
    </button>
  );
};

export default TierButton;
