import { useWriteContract, useReadContract } from "wagmi";
import { FACTORY_ADDRESS } from "../../constants";
import { FACTORY_ABI } from "../../constants";

export const useFactory = () => {
  const { data: hash, writeContract } = useWriteContract();

  const createCampaign = async (_owner, _name, _desc, _goal, _duration, _imgURL) => {
    try {
      writeContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "createCampaign",
        args: [_owner, _name, _desc, _goal, _duration, _imgURL],
      });

      console.log("Transaction Hash:", hash);
      return hash;
    } catch (error) {
      console.error("Fehler bei der Abstimmung:", error);
      throw error;
    }
  };

  return { createCampaign, hash };
};