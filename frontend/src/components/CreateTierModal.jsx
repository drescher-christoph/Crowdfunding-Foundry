import React from "react";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers } from "ethers";
import { CAMPAIGN_ABI } from "../../constants";

const CreateTierModal = ({ setIsTierModalOpen, campaignAddress }) => {

  const account = useAccount();

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isTransactionError,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [transactionState, setTransactionState] = useState("initial"); // "initial", "signing", "confirming", "success", "failed"
  const [errorMessage, setErrorMessage] = useState("");
  const [tierName, setTierName] = useState("");
  const [tierDesc, setTierDesc] = useState("");
  const [tierAmount, setTierAmount] = useState("");
  

  // Update transaction state based on transaction status
  useEffect(() => {
    if (isWritePending) {
      setTransactionState("signing");
    } else if (hash && isConfirming) {
      setTransactionState("confirming");
    } else if (hash && isSuccess) {
      setTransactionState("success");
    } else if (writeError || isTransactionError) {
      setTransactionState("failed");
      // Determine the appropriate error message
      if (writeError) {
        if (writeError.message.includes("user rejected transaction")) {
          setErrorMessage("Transaction was rejected by the user.");
        } else {
          setErrorMessage(
            writeError.message || "Error while creating campaign."
          );
        }
      } else if (transactionError) {
        setErrorMessage(
          transactionError.message || "Transaction failed to confirm."
        );
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  }, [
    hash,
    isConfirming,
    isSuccess,
    isWritePending,
    writeError,
    isTransactionError,
    transactionError,
  ]);

  // Deploy contract from CrowdfundingFactory
  const handleCreateTiers = async () => {
    try {
      console.log("Creating Tiers...");
      writeContract({
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
        functionName: "addTier",
        args: [
          tierName,
          ethers.parseUnits(String(tierAmount), 18),
        ],
      });
    } catch (error) {
      console.error(error);
      setTransactionState("failed");
      setErrorMessage(error.message || "Error while creating fund tier");
    }
  };

  const resetForm = () => {
    setTransactionState("initial");
    setErrorMessage("");
  };

  const renderInitialForm = () => (
    <div className="flex flex-col">
      <div className="flex flex-col mb-4 rounded-md bg-slate-200 p-4">
        <label>Tier#1 Name:</label>
        <input
          type="text"
          value={tierName}
          onChange={(e) => setTierName(e.target.value)}
          placeholder="Campaign Name"
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        />
        <label>Tier#1 Description:</label>
        <textarea
          value={tierDesc}
          onChange={(e) => setTierDesc(e.target.value)}
          placeholder="Campaign Description"
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        ></textarea>
        <label>Tier#1 Amount (Ether):</label>
        <input
          type="text"
          value={tierAmount}
          placeholder="0.05"
          onChange={(e) => setTierAmount(e.target.value)}
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        />
      </div>


      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleCreateTiers}
      >
        Confirm
      </button>
    </div>
  );

  const renderSigningTransaction = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-6"></div>
      <p className="text-lg font-medium text-gray-700">
        Waiting for Signature...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Please sign the transaction in your wallet
      </p>
    </div>
  );

  const renderConfirmingTransaction = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-6"></div>
      <p className="text-lg font-medium text-gray-700">
        Confirming Transaction...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Please wait while your transaction is being confirmed
      </p>
      {hash && (
        <p className="text-xs text-gray-500 mt-4 break-all max-w-xs text-center">
          Transaction Hash: <br />
          {hash}
        </p>
      )}
    </div>
  );

  const renderSuccessTransaction = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">
        Congratulations on Your New Campaign!
      </h3>
      <p className="text-gray-600 mt-2 text-center">
        Your support tier has been successfully created and is now live.
      </p>
      {hash && (
        <div className="mt-6 bg-gray-100 p-3 rounded-md w-full max-w-md">
          <p className="text-sm font-medium text-gray-700">Transaction Hash:</p>
          <p className="text-xs text-gray-500 break-all">{hash}</p>
        </div>
      )}
      <button
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => setIsTierModalOpen(false)}
      >
        Close
      </button>
    </div>
  );

  const renderFailedTransaction = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">Transaction Failed</h3>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        {errorMessage || "There was an error while creating your campaign."}
      </p>
      <div className="flex space-x-4 mt-8">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={resetForm}
        >
          Try Again
        </button>
        <button
          className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
          onClick={() => setIsTierModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (transactionState) {
      case "signing":
        return renderSigningTransaction();
      case "confirming":
        return renderConfirmingTransaction();
      case "success":
        return renderSuccessTransaction();
      case "failed":
        return renderFailedTransaction();
      default:
        return renderInitialForm();
    }
  };

  const getModalTitle = () => {
    switch (transactionState) {
      case "signing":
        return "Sign Transaction";
      case "confirming":
        return "Creating Tiers";
      case "success":
        return "Tiers Created";
      case "failed":
        return "Transaction Failed";
      default:
        return "Create Support Tiers";
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-15 flex justify-center items-center backdrop-blur-md z-5">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">{getModalTitle()}</p>
          {(transactionState === "initial" ||
            transactionState === "success" ||
            transactionState === "failed") && (
            <button
              className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
              onClick={() => setIsTierModalOpen(false)}
            >
              Close
            </button>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default CreateTierModal;
