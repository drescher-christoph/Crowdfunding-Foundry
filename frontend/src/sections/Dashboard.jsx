import { useState } from "react";
import { Link } from 'react-router-dom';
import CampaignCard from "../components/CampaignCard";
import StatsCard from "../components/StatsCard";
import { useCampaigns } from '../contexts/CampaignsContext';

const Dashboard = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const campaigns = useCampaigns();

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-center items-center mb-10 gap-8">
        <StatsCard amount={"$350,000"} label={"Total raised"} bg={"#DEFBB6"} />
        <StatsCard amount={"250"} label={"Backers"} bg={"#DAD2FF"} />
        <StatsCard
          amount={"$12,000"}
          label={"Funded"}
          bg={"#0C0D0F"}
          textColor="white"
        />
      </div>
      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-4xl font-semibold">Open Campaigns</p>
        <button
          className="px-4 py-2 text-black font-bold rounded-2xl border-2 border-black shadow-md transition-transform hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          Create Campaign
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* {!isLoadingMyCampaigns &&
          (myCampaigns && myCampaigns.length > 0 ? (
            myCampaigns.map((campaign, index) => (
            //   <MyCampaignCard
            //     key={index}
            //     contractAddress={campaign.campaignAddress}
            //   />
            
            ))
          ) : (
            <p>No campaigns</p>
          ))} */}
        {campaigns.map((campaign) => {
          return (
            <Link key={campaign.id} to={`/posts/${campaign.id}`} state={{ campaign }}>
              <CampaignCard
                img={campaign.img}
                title={campaign.title}
                description={campaign.description}
                daysLeft={campaign.daysLeft}
                progress={campaign.progress}
              />
            </Link>
          );
        })}
      </div>

      {/* {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )} */}
    </div>
  );
};

export default Dashboard;
