import React from "react";

const TierButton = ({ key, name, price, reward }) => {
  return (
    <button
      key={key}
      className="flex-1 min-w-[150px] px-4 py-2 text-black font-semibold hover:bg-[#DEFBB6] rounded-2xl shadow-sm border-2 transition-transform hover:border-black hover:scale-[1.02] duration-200"
    >
      <div className="flex flex-col gap-2">
        {name}
        <span className="font-bold text-4xl">${price}</span>
        {reward}
      </div>
    </button>
  );
};

export default TierButton;
