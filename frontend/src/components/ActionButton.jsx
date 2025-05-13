import {useState} from "react";
import { CAMPAIGN_ABI } from "../../constants";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";

const ActionButton = ({ label, action, contractAddress }) => {

    const [loading, setLoading] = useState(false);

    const { writeContract } = useWriteContract()


    const withdraw = async() => {
        setLoading(true);
        try {
            writeContract({
                    abi: CAMPAIGN_ABI,
                    address: contractAddress,
                    functionName: "withdraw",
                  });
        } catch (error) {
            alert("Error withdrawing funds: " + error.message);
            console.error("Error withdrawing funds:", error);
        }
        finally {
            setLoading(false);
        }
    }

    const refund = async() => {

    }

  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      onClick={action == "withdraw" ? withdraw : refund}
    >
      {label}
    </button>
  );
};

export default ActionButton;
