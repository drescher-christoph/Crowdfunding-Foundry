import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { FACTORY_ADDRESS } from "../../constants";
import { FACTORY_ABI } from "../../constants";
import AnimatedPurpleSpinner from "../components/AnimatedPurpleSpinner";

const UserFundings = () => {
  const [fundingData, setFundingData] = useState();

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

  return (
    <div>
      {isLoading ? (
        <AnimatedPurpleSpinner />
      ) : (
        fundingData && (
          <div className="flex m-10">
            <p className="text-4xl font-semibold">Open Campaigns</p>
            <div className="flex flex-col items-center justify-center m-10">
              {fundingData.map((campaign, idx) => (
                <p key={idx}>{campaign.owner}</p>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UserFundings;
