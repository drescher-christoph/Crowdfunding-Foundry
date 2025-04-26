import React from "react";

const StatsCard = ({amount, label, bg="#DEFBB6", textColor="black"}) => {
  return (
    <div className={`flex flex-col px-20 py-15 border-2 gap-2 rounded-xl`} style={{ backgroundColor: bg }}>
      <h1 className="font-bold text-4xl" style={{ color: textColor}}>{amount}</h1>
      <p className="text-black font-medium text-center" style={{ color: textColor}}>{label}</p>
    </div>
  );
};

export default StatsCard;
