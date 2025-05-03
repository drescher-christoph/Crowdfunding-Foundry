import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import TierButton from "./TierButton";
import CreateTierModal from "./CreateTierModal";
import { CAMPAIGN_ABI } from "../../constants";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useBalance,
  useBlockNumber,
  useWatchContractEvent,
} from "wagmi";
import { ethers } from "ethers";

const DetailView = () => {
  
  const [tiers, setTiers] = useState([]);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [lastUpdateBlock, setLastUpdateBlock] = useState(0);

  const account = useAccount();

  const { state } = useLocation();
  const { postId } = useParams();

  const postIdNumber = parseInt(postId, 10);
  const campaign = state.campaign;

  const {
    data: tiersData,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: campaign.campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "getTiers",
    enabled: false,
  });

  const { data: tiersCount } = useReadContract({
    address: campaign.campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "getTiersCount",
    watch: true,
  });

  const contractBalance = useBalance({
    address: campaign.campaignAddress,
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching tiers:", error);
    }
    if (!isLoading && tiersData) {
      console.log("Tiers fetched: ", tiersData);
      setTiers(tiersData);
    }
  }, [tiersCount]);

  const calcProgress = () => {
    if (contractBalance.isLoading) {
      console.log("Balance is still loading...");
      return 0; // Zeige 0% Fortschritt, solange die Daten geladen werden
    }
  
    if (!contractBalance.data || !contractBalance.data.value || !campaign.goal) {
      console.log("No contract balance or goal provided");
      return 0;
    }
  
    try {
      const numericBalance = ethers.formatUnits(contractBalance.data.value, 18); // 18 ist die Standard-Dezimalstelle für ETH
      const numericGoal = typeof campaign.goal === "number" ? campaign.goal : parseFloat(campaign.goal || 0);
  
      if (numericGoal === 0) return 0;
  
      const progress = (parseFloat(numericBalance) / numericGoal) * 100;
      return Math.min(progress, 100); // Begrenze den Fortschritt auf maximal 100%
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  };

  const timeLeft = (unixTimestamp) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = Number(unixTimestamp) - currentTime;

    if (timeDifference <= 0) {
      return 0;
    }

    const daysLeft = Math.floor(timeDifference / (60 * 60 * 24)); // Sekunden in Tage umrechnen
    return daysLeft;
  };

  if (!campaign) return <div>Kampagne nicht gefunden</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col gap-6">
      {/* Bild */}
      <div className="w-full h-72 overflow-hidden rounded-xl">
        <img
          src={campaign.imageURL}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Titel und Beschreibung */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-800">
          {campaign.title}
        </h1>
        <p className="text-slate-600 text-base">{campaign.description}</p>
        <p>Goal: <span className="font-bold">{campaign.goal}ETH</span></p>
      </div>

      {/* Fortschrittsanzeige + Info */}
      <div className="flex flex-col gap-2">
      <div>
  {contractBalance.isLoading ? (
    <p>Loading balance...</p>
  ) : (
    <div>
      <div className="w-full bg-slate-100 h-3 rounded-full">
        <div
          className="bg-purple-600 h-3 rounded-full"
          style={{ width: `${calcProgress()}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-slate-500">
        <span>{timeLeft(campaign.deadline)} Tage verbleibend</span>
        <span>{calcProgress()}% finanziert</span>
      </div>
    </div>
  )}
</div>
      </div>

      {/* Tiers */}
      <div className="flex flex-wrap gap-4">
        {tiers &&
          tiers.length > 0 &&
          !isError && timeLeft(campaign.deadline) > 0 ? (
          tiers.map((tier, tierIndex) => (
            <TierButton
              key={tierIndex}
              tierIndex={tierIndex}
              name={tier.name}
              price={ethers.formatUnits(String(tier.amount))}
              reward={tier.reward}
              contractAddress={campaign.campaignAddress}
              abi={CAMPAIGN_ABI}
            />
          ))) : (
            <p>Campaign is over</p>
          )}

        {campaign.owner === account.address && (
          <button
            className="px-4 py-2 text-black font-bold rounded-2xl border-2 border-black shadow-md transition-transform hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200"
            onClick={() => setIsTierModalOpen(true)}
          >
            Create Support Tier
          </button>
        )}
      </div>

      <p>Contract Address: {campaign.campaignAddress}</p>
      {/* <p>Contract Balance: {balance}</p> */}

      {isTierModalOpen && (
        <CreateTierModal
          setIsTierModalOpen={setIsTierModalOpen}
          campaignAddress={campaign.campaignAddress}
          // refetch={refetch}
        />
      )}
    </div>
  );
};

export default DetailView;
