import React from "react";

const HowItWorks = () => {
  return (
    <>
      {/* Header */}
      <div className="h-20 bg-[#eedac6] flex justify-center items-center">
        <h2 className="font-semibold text-2xl text-gray-800">
          How OpenRaise works
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-6 p-6 bg-white rounded-2xl my-10 mx-20">
        <div>
          <p className="text-left text-lg font-bold text-gray-700">
            1. Connect Your Wallet
          </p>
          <p className="text-left text-gray-600 leading-relaxed">
            OpenRaise is 100% decentralized. This means:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 pl-4">
            <li className="hover:text-gray-800 transition-colors">
              All you need is a crypto wallet like MetaMask
            </li>
            <li className="hover:text-gray-800 transition-colors">
              No sign-up, no email required
            </li>
            <li className="hover:text-gray-800 transition-colors">
              You remain in full control of your campaign and funds
            </li>
          </ul>
          <p className="text-left text-gray-600 leading-relaxed">Your project is then stored on the blockchain — transparent and tamper-proof.</p>
        </div>
      </div>
      
      <div className="flex flex-col justify-center gap-2 p-6 bg-white rounded-2xl my-10 mx-20">
        <div>
          <p className="text-left text-lg font-bold text-gray-700">
            2. Create a Campaign
          </p>
          <p className="text-left text-gray-600 leading-relaxed">
            Set up your own campaign in just a few minutes — no coding required.
            Simply provide:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 pl-4">
            <li className="hover:text-gray-800 transition-colors">
              Title
            </li>
            <li className="hover:text-gray-800 transition-colors">
              Description
            </li>
            <li className="hover:text-gray-800 transition-colors">
              Funding goal
            </li>
            <li className="hover:text-gray-800 transition-colors">
              Campaign duration
            </li>
            <li className="hover:text-gray-800 transition-colors">
              Support tiers
            </li>
          </ul>
          <p className="text-left text-gray-600 leading-relaxed">Your project is then stored on the blockchain — transparent and tamper-proof.</p>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;