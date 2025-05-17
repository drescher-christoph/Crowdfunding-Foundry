import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { FACTORY_ADDRESS } from "../../constants";
import { FACTORY_ABI } from "../../constants";
import AnimatedPurpleSpinner from "../components/AnimatedPurpleSpinner";
import { ethers } from "ethers";

const UserFundings = () => {
  const [fundingData, setFundingData] = useState([]);

  const account = useAccount();

  const {
    data: userFundings,
    isLoading,
    isError,
  } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getSupportedCampaigns",
    args: [account.address],
    watch: true,
  });

  useEffect(() => {
    if (isLoading) {
      console.log("Loading user fundings...");
    } else if (isError) {
      console.error("Error fetching user fundings");
    } else if (userFundings) {
      console.log("User fundings:", userFundings);
      setFundingData(userFundings);
    }
  }, [userFundings]);

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

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center m-10">
        <p className="text-4xl font-semibold mb-10">Supported Campaigns</p>
        {isLoading ? (
          <AnimatedPurpleSpinner />
        ) : fundingData.length > 0 ? (
          <div className="flex flex-col items-center justify-center m-10">
            <div className="flex flex-row items-center justify-between w-[80%]">
              <p className="text-black text-2xl text-center font-bold w-[25%]">
                Title
              </p>
              <p className="text-black text-2xl text-center font-bold w-[25%]">
                Description
              </p>
              <p className="text-black text-2xl text-center font-bold w-[25%]">
                Time left
              </p>
              <p className="text-black text-2xl text-center font-bold w-[25%]">
                Goal
              </p>
              <p className="text-black text-2xl text-center font-bold w-[25%]">
                Campaign
              </p>
            </div>
            {fundingData.map((campaign, idx) => (
              <div className="flex flex-row bg-white items-center justify-between p-5 mt-5 w-[80%] rounded-md border-2 shadow-md transition-transform hover:scale-[1.02] duration-200">
                <p className="text-black text-center font-bold flex-1">
                  {campaign.title}
                </p>
                <p className="text-black text-center font-bold flex-1">
                  {campaign.description}
                </p>
                <p className="text-black text-center font-bold flex-1">
                  {timeLeft(campaign.deadline)}
                </p>
                <p className="text-black text-center font-bold flex-1">
                  {ethers.formatEther(campaign.goal)} ETH
                </p>
                <div className="flex-1 flex justify-center">
                  <Link
                    key={campaign.campaignAddress}
                    to={`/campaigns/${campaign.campaignAddress}`}
                    state={{ campaign }}
                    className="w-full flex"
                  >
                    <button
                      className="w-full py-2 text-black font-bold rounded-2xl border-2 border-black shadow-md transition-transform hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Open
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No funds available</p>
        )}
      </div>
    </div>
  );
};

export default UserFundings;
