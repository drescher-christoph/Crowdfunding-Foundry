import React from "react";

const CampaignCard = ({img, title, description, daysLeft, progress}) => {
  return (
    <div className="flex flex-col justify-between w-full max-w-sm bg-white border-2 rounded-2xl shadow-md transition-transform hover:scale-[1.02] duration-200">
      {/* Image */}
      <div className="w-full h-48 overflow-hidden rounded-t-2xl">
        <img
          className="w-full h-full object-cover"
          src={img}
          alt="Campaign"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${progress >= 100 ? 100 : progress}%` }}
          />
        </div>

        {/* Info Row */}
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>{daysLeft} days left</span>
          <span>{progress}% funded</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
