import { useState, useEffect } from "react";
import { useBalance, useReadContract } from "wagmi";
import { ethers } from "ethers";
import { CAMPAIGN_ABI } from "../../constants";

const CampaignCard = ({
  img,
  title,
  description,
  daysLeft,
  progress,
  goal,
  address,
}) => {
  const [campaignState, setCampaignState] = useState("loading");
  const [stateColor, setStateColor] = useState("#A0C878");

  const { data: contractBalance } = useBalance({
    address: address,
  });

  const { data: cState } = useReadContract({
    address: address,
    abi: CAMPAIGN_ABI,
    functionName: "state",
    watch: true,
  });

  useEffect(() => {
    if (cState === undefined) return;
    if (cState === 0) {
      setCampaignState("Active");
      setStateColor("#A0C878");
    } else if (cState === 1) {
      setCampaignState("Successful");
      setStateColor("#DAD2FF");
    } else if (cState === 2) {
      setCampaignState("Failed");
      setStateColor("#E55050");
    } else if (cState === 3) {
      setCampaignState("Paused");
      setStateColor("bg-yellow-500");
    } else {
      setCampaignState("unknown");
    }
  }, [cState]);

  const timeLeft = (unixTimestamp) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = Number(unixTimestamp) - currentTime;

    if (timeDifference <= 0) {
      return 0;
    }

    const daysLeft = Math.floor(timeDifference / (60 * 60 * 24)); // Sekunden in Tage umrechnen
    return daysLeft;
  };

  const calcProgress = () => {
    if (!contractBalance || !goal) {
      console.log("No contract balance or goal provided");
      return 0;
    }

    const numericBalance = ethers.formatUnits(contractBalance.value);
    const numericGoal = ethers.formatUnits(goal, 18);

    if (numericGoal === 0) return 0;
    const progress = (numericBalance / numericGoal) * 1000;
    console.log("Numeric Balance: ", numericBalance);
    console.log("Numeric Goal: ", numericGoal);
    console.log("Progress: ", progress);
    return progress > 100 ? 100 : progress;
  };

  return (
    <div className="flex flex-col justify-between w-full max-w-sm bg-white border-2 rounded-2xl shadow-md transition-transform hover:scale-[1.02] duration-200">
      {/* Image */}
      <div className="w-full h-48 overflow-hidden rounded-t-2xl relative">
        <img className="w-full h-full object-cover" src={img} alt="Campaign" />
        <div className="absolute top-2 right-2 z-30 text-black font-medium rounded-2xl border border-black px-2 py-1" style={{ backgroundColor: stateColor, opacity: 0.8 }}>
          {campaignState}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${calcProgress() > 100 ? 100 : calcProgress()}%` }}
          />
        </div>

        {/* Info Row */}
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>{timeLeft(daysLeft)} days left</span>
          <span>{calcProgress()}% funded</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
