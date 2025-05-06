import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CampaignCard from "../components/CampaignCard";
import StatsCard from "../components/StatsCard";
import CreateTierModal from "../components/CreateTierModal";
import { decodeEventLog } from "viem";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FACTORY_ADDRESS } from "../../constants";
import { FACTORY_ABI } from "../../constants";
import { IoCloseOutline } from "react-icons/io5";

const Dashboard = () => {
  const [campaignAddress, setCampaignAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const account = useAccount();

  // Verwende useContractRead, um die Daten direkt zu lesen
  const {
    data: campaignsData,
    isLoading,
    isError,
  } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getAllCampaigns",
    watch: true, // Automatische Aktualisierung bei Änderungen
  });

  useEffect(() => {
    if (!isLoading && !isError && campaignsData) {
      console.log("Campaigns fetched: ", campaignsData);
      setCampaigns(campaignsData); // Aktualisiere den Zustand mit den Daten
    }
  }, [campaignsData, isLoading, isError]);

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
        {!account.address ? (
          <p className="text-center col-span-3 text-gray-500">
            Bitte verbinde deine Wallet, um Kampagnen zu sehen.
          </p>
        ) : isLoading ? (
          <div className="col-span-3 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">
            Es gibt derzeit keine offenen Kampagnen.
          </p>
        ) : (
          campaigns.map((campaign) => (
            <Link
              key={campaign.campaignAddress}
              to={`/campaigns/${campaign.campaignAddress}`}
              state={{ campaign }}
            >
              <CampaignCard
                img={campaign.imageURL}
                title={campaign.title}
                description={campaign.description}
                daysLeft={campaign.deadline}
                progress={campaign.progress}
                goal={campaign.goal}
                address={campaign.campaignAddress}
              />
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          setIsTierModalOpen={setIsTierModalOpen}
          setCampaignAddress={setCampaignAddress}
          // refetch={refetch}
        />
      )}

      {isTierModalOpen && campaignAddress && (
        <CreateTierModal
          setIsTierModalOpen={setIsTierModalOpen}
          campaignAddress={campaignAddress}
          // refetch={refetch}
        />
      )}
    </div>
  );
};

export default Dashboard;

const CreateCampaignModal = ({
  setIsModalOpen,
  setIsTierModalOpen,
  setCampaignAddress,
}) => {
  const account = useAccount();

  const [transactionState, setTransactionState] = useState("open"); // "initial", "signing", "confirming", "success", "failed"
  const [errorMessage, setErrorMessage] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignGoal, setCampaignGoal] = useState(1);
  const [campaignDeadline, setCampaignDeadline] = useState(1);
  const [campaignImageURL, setCampaignImageURL] = useState("");
  const [createdCampaignAddress, setCreatedCampaignAddress] = useState("");

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    data: receipt, // Receipt hinzugefügt
    isLoading: isConfirming,
    isSuccess,
    isError: isTransactionError,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    hash,
  });

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

  useEffect(() => {
    if (receipt) {
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: FACTORY_ABI,
            data: log.data,
            topics: log.topics,
          });

          if (event.eventName === "CampaignCreated") {
            setCreatedCampaignAddress(event.args.campaignAddress);
            setCampaignAddress(event.args.campaignAddress);
            break;
          }
        } catch (error) {
          console.error("Error decoding event log:", error);
        }
      }
    }
  }, [receipt]);

  // Deploy contract from CrowdfundingFactory
  const handleDeployContract = async () => {
    try {
      console.log("Deploying contract...");
      writeContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "createCampaign",
        args: [
          account.address,
          campaignName,
          campaignDescription,
          campaignGoal,
          campaignDeadline,
          campaignImageURL,
        ],
      });
    } catch (error) {
      console.error(error);
      setTransactionState("failed");
      setErrorMessage(error.message || "Error while creating campaign.");
    }
  };

  const handleCampaignGoal = (value) => {
    if (value < 1) {
      setCampaignGoal(1);
    } else {
      setCampaignGoal(value);
    }
  };

  const handleCampaignLengthChange = (value) => {
    if (value < 1) {
      setCampaignDeadline(1);
    } else {
      setCampaignDeadline(value);
    }
  };

  const resetForm = () => {
    setTransactionState("initial");
    setErrorMessage("");
  };

  const renderInitialForm = () => (
    <div className="flex flex-col">
      <label>Campaign Name:</label>
      <input
        type="text"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        placeholder="Campaign Name"
        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
      />
      <label>Campaign Description:</label>
      <textarea
        value={campaignDescription}
        onChange={(e) => setCampaignDescription(e.target.value)}
        placeholder="Campaign Description"
        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
      ></textarea>
      <label>Campaign Goal (Ether):</label>
      <input
        type="number"
        value={campaignGoal}
        onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
      />
      <label>{`Campaign Length (Days)`}</label>
      <div className="flex space-x-4">
        <input
          type="number"
          value={campaignDeadline}
          disabled={true}
          onChange={(e) => handleCampaignLengthChange(parseInt(e.target.value))}
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        />
      </div>
      <label>{`Campaign Image URL`}</label>
      <div className="flex flex-col">
        <input
          type="text"
          value={campaignImageURL}
          placeholder="Campaign Image URL"
          onChange={(e) => setCampaignImageURL(e.target.value)}
          className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
        />
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleDeployContract}
      >
        Create Campaign
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
        Your campaign has been successfully created and is now live.
      </p>
      {hash && (
        <div className="mt-6 bg-gray-100 p-3 rounded-md w-full max-w-md">
          <p className="text-sm font-medium text-gray-700">Transaction Hash:</p>
          <p className="text-xs text-gray-500 break-all">{hash}</p>
        </div>
      )}
      {isSuccess && createdCampaignAddress && (
        <div className="mt-6 bg-gray-100 p-3 rounded-md w-full max-w-md">
          <p className="text-sm font-medium text-gray-700">
            Campaign deployed at:
          </p>
          <p className="text-xs text-gray-500 break-all">
            {createdCampaignAddress}
          </p>
        </div>
      )}
      <button
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => {
          setIsModalOpen(false);
          setIsTierModalOpen(true);
        }}
      >
        Create Tiers
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
          onClick={() => setIsModalOpen(false)}
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
        return "Creating Campaign";
      case "success":
        return "Campaign Created";
      case "failed":
        return "Transaction Failed";
      default:
        return "Create a Campaign";
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-15 flex justify-center items-center">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md border-2">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">{getModalTitle()}</p>
          <button
            className="px-3 py-3 bg-slate-600 text-white rounded-full hover:bg-slate-700"
            onClick={() => setIsModalOpen(false)}
          >
            <IoCloseOutline />
          </button>
          {(transactionState === "initial" ||
            transactionState === "success" ||
            transactionState === "failed") && (
            <button
              className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
              onClick={() => setIsModalOpen(false)}
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
