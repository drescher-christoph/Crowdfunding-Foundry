import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import TierButton from "./TierButton";
import CreateTierModal from "./CreateTierModal";
import ActionButton from "./ActionButton";
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
  const [campaignState, setCampaignState] = useState("loading");
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
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

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

  const { data: cState } = useReadContract({
    address: campaign.campaignAddress,
    abi: CAMPAIGN_ABI,
    functionName: "state",
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

  useEffect(() => {
    if (cState === undefined) return;
    console.log("Campaign state: ", cState);
    if (cState === 0) {
      setCampaignState("open");
    } else if (cState === 1) {
      setCampaignState("successful");
    } else if (cState === 2) {
      setCampaignState("failed");
    } else if (cState === 3) {
      setCampaignState("paused");
    } else {
      setCampaignState("unknown");
    }
  }, [cState]);

  const updateCampaign = async() => {
    try {
      writeContract({
              address: campaign.campaignAddress,
              abi: CAMPAIGN_ABI,
              functionName: "checkAndUpdateState",
            });
    } catch (e) {
      console.log("Error updating contract: ", e)
    }
  }

  const calcProgress = () => {
    if (contractBalance.isLoading) {
      console.log("Balance is still loading...");
      return 0; // Zeige 0% Fortschritt, solange die Daten geladen werden
    }

    if (
      !contractBalance.data ||
      !contractBalance.data.value ||
      !campaign.goal
    ) {
      console.log("No contract balance or goal provided");
      return 0;
    }

    try {
      const numericBalance = ethers.formatUnits(contractBalance.data.value, 18); // 18 ist die Standard-Dezimalstelle für ETH
      const numericGoal = ethers.formatUnits(campaign.goal, 18);

      if (numericGoal === 0) return 0;
      console.log("Numeric Balance: ", numericBalance);
      console.log("Numeric Goal: ", numericGoal);
      const progress = (numericBalance / numericGoal) * 100;
      console.log("Calculated Progress: ", progress);
      return progress; // Begrenze den Fortschritt auf maximal 100%
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
    const hoursLeft = Math.floor((timeDifference % (60 * 60 * 24)) / (60 * 60));
    const minutesLeft = Math.floor((timeDifference % (60 * 60)) / 60);
    const timeLeftString = `${daysLeft} days, ${hoursLeft} hours, ${minutesLeft} minutes`;
    return timeLeftString;
  };

  console.log("Time left: ", timeLeft(campaign.deadline));

  if (!campaign) return <div>Kampagne nicht gefunden</div>;

  const renderTiers = () => {
    return tiers.map((tier, tierIndex) => (
      <TierButton
        key={tierIndex}
        tierIndex={tierIndex}
        name={tier.name}
        price={ethers.formatUnits(String(tier.amount))}
        reward={tier.reward}
        contractAddress={campaign.campaignAddress}
        abi={CAMPAIGN_ABI}
      />
    ));
  };

  const renderWithdrawMask = () => {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-800">
          The Campaign has been successfully funded!
        </h1>
        <p className="text-slate-600 text-base">
          {account.address === campaign.owner ? ("Congrats, you can now withdraw your collected funds") : ("The creator is grateful for the support and looks forward to the implementation of the project")}
        </p>
        {account.address === campaign.owner && (
          <ActionButton
          label="Withdraw Funds"
          action="withdraw"
          contractAddress={campaign.campaignAddress}
        />
        )}
      </div>
    );
  };

  const renderRefundMask = () => {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-800">
          The Campaign has failed!
        </h1>
        <p className="text-slate-600 text-base">
          This is a refund mask for the supporter to refund his donation.
        </p>
        {account.address === campaign.owner ? (
          <p>The Supporters are now able to refund their donation</p>
        ) : (
          <ActionButton
            label="Refund"
            action="refund"
            contractAddress={campaign.campaignAddress}
          />
        )}
      </div>
    );
  };

  const renderTierContent = () => {
    if (isError) {
      return <p className="text-slate-500">Error loading tiers.</p>;
    }

    if (!tiers || tiers.length === 0) {
      return <p className="text-slate-500">No tiers available</p>;
    }

    // Wenn Tiers vorhanden sind, entscheide basierend auf dem Campaign-Status
    switch (campaignState) {
      case "open":
        return renderTiers();
      case "successful":
        return renderWithdrawMask();
      case "failed":
        return renderRefundMask();
      default:
        return renderTiers();
    }
  };

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
        <p>
          Goal:{" "}
          <span className="font-bold">
            {ethers.formatEther(campaign.goal)}ETH
          </span>
        </p>
        <p>
          Campaign State: <span className="font-bold">{campaignState}</span>
        </p>
        <p>
          Campaign Creator: <span className="font-bold">{campaign.owner}</span>
        </p>
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
                  style={{
                    width: `${calcProgress() > 100 ? 100 : calcProgress()}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-500 mt-2">
                <span>{timeLeft(campaign.deadline)}</span>
                <span>{calcProgress()}% funded</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tiers */}
      <div className="flex flex-wrap gap-4">
        {renderTierContent()}

        {campaign.owner === account.address && tiersCount <= 2 && campaignState != "failed" && campaignState != "successful" && (
          <button
            className="px-4 py-2 text-black font-bold rounded-2xl border-2 border-black shadow-md transition-transform hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200"
            onClick={() => setIsTierModalOpen(true)}
          >
            Create Support Tier
          </button>
        )}
      </div>

      {!contractBalance.isLoading && (
        <div>
          <p>Contract Address: <a className="text-blue-500" href={`https://sepolia.etherscan.io/address/${campaign.campaignAddress}`}>{campaign.campaignAddress}</a></p>
          <p>
            Contract Balance:{" "}
            {ethers.formatUnits(contractBalance.data.value, 18)} ETH
          </p>

          <button
          className="px-4 py-2 mt-10 text-black font-bold rounded-2xl border-2 border-black shadow-md transition-transform hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200"
          onClick={updateCampaign}
        >
          Update
        </button>
        </div>
      )}

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
