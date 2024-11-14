"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useEscrowStatus } from "@/hooks/UseEscrowStatus";
import { EscrowStatusCard } from "@/components/EscrowStatusCard";
import { useContractEvents } from "@/hooks/UseContractEvents";
import { Escrow } from "@contract-types/Escrow";
import { ContractEvents } from "@/components/ContractEvents";

export default function TestDeployPage() {
  const router = useRouter();
  const { seller, deployContract, getContract } = useWeb3();
  const { escrowStatus, updateEscrowStatus } = useEscrowStatus();
  const [deployedAddress, setDeployedAddress] = useState<string>("");
  const [itemValue, setItemValue] = useState<string>("0.1");
  const [status, setStatus] = useState<string>("");
  const [contract, setContract] = useState<Escrow | null>(null);
  const events = useContractEvents(contract);

  const handleDeploy = async () => {
    try {
      setStatus("Deploying contract...");
      const valueInWei = ethers.parseEther(itemValue);
      const contract = await deployContract(valueInWei);
      setContract(contract);
      const address = await contract.getAddress();
      setDeployedAddress(address);
      setStatus("Contract deployed successfully!");

      // Get initial status
      await updateEscrowStatus(contract);
    } catch (error) {
      console.error("Deployment error:", error);
      setStatus("Deployment failed! Check console for details.");
    }
  };

  const handleGetStatus = async () => {
    if (!deployedAddress) {
      setStatus("No contract deployed yet!");
      return;
    }

    try {
      setStatus("Fetching contract status...");
      if (!seller) {
        setStatus("Seller address is not available!");
        return;
      }
      const contract = await getContract(deployedAddress, seller);
      await updateEscrowStatus(contract);
      setStatus("Status fetched successfully!");
    } catch (error) {
      console.error("Error fetching status:", error);
      setStatus("Failed to fetch status! Check console for details.");
    }
  };

  const handleConfirmPurchaseClick = (contractAddress: string) => {
    router.push(`/test/confirmPurchase/${contractAddress}`);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Escrow Contract Test Page</h1>

      {seller && (
        <div className="mb-4 p-4 bg-gray-100 rounded text-black">
          <h2 className="text-lg font-semibold mb-2">Seller Account:</h2>
          <p className="font-mono break-all">{seller}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl mb-2">Deploy New Contract</h2>
        <div className="flex gap-2 mb-2 text-black">
          <input
            type="number"
            value={itemValue}
            onChange={(e) => setItemValue(e.target.value)}
            placeholder="Item Value in ETH"
            className="border p-2 rounded flex-grow"
            step="0.01"
          />
          <button
            onClick={handleDeploy}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Deploy Contract
          </button>
        </div>
      </div>

      {deployedAddress && (
        <div className="mb-6 text-black">
          <h2 className="text-xl mb-2 text-white">Deployed Contract</h2>
          <p className="font-mono bg-gray-100 p-2 rounded break-all mb-2">
            {deployedAddress}
          </p>
          <button
            onClick={handleGetStatus}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh Status
          </button>
        </div>
      )}

      <EscrowStatusCard escrowStatus={escrowStatus} />

      {status && (
        <div className="mt-4 p-4 bg-blue-50 rounded text-black">
          <h2 className="text-xl mb-2">Status:</h2>
          <p>{status}</p>
        </div>
      )}
      {deployedAddress && (
        <button
          onClick={() => handleConfirmPurchaseClick(deployedAddress)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Confirm Purchase
        </button>
      )}
      <ContractEvents events={events} />
    </div>
  );
}
