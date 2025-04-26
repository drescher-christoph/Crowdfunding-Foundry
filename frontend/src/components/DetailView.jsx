import React from 'react'
import { useCampaigns } from '../contexts/CampaignsContext';
import { useParams, useLocation } from 'react-router-dom';
import TierButton from './TierButton';

const DetailView = () => {

    const { state } = useLocation();
    const campaigns = useCampaigns();
    const { postId } = useParams();

    const postIdNumber = parseInt(postId, 10);
    const campaign = campaigns.find(c => c.id === postIdNumber);

    console.log("Empfangener State:", state); // 👈 Was kommt hier an?
    console.log("Post-ID aus URL:", postId);

    if (!campaign) return <div>Kampagne nicht gefunden</div>;
    
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col gap-6">
        {/* Bild */}
        <div className="w-full h-72 overflow-hidden rounded-xl">
          <img
            src={campaign.img}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Titel und Beschreibung */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-slate-800">{campaign.title}</h1>
          <p className="text-slate-600 text-base">{campaign.description}</p>
        </div>
  
        {/* Fortschrittsanzeige + Info */}
        <div className="flex flex-col gap-2">
          <div className="w-full bg-slate-100 h-3 rounded-full">
            <div
              className="bg-purple-600 h-3 rounded-full"
              style={{ width: `${campaign.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>{campaign.daysLeft} Tage verbleibend</span>
            <span>{campaign.progress}% finanziert</span>
          </div>
        </div>
  
        {/* Tiers */}
        <div className="flex flex-wrap gap-4">
          { campaign.tiers && campaign.tiers.map((tier) => (
           <TierButton key={tier.id} name={tier.tier} price={tier.amount} reward={tier.reward} />
          ))}
        </div>
      </div>
    );
  };

export default DetailView