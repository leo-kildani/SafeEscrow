"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import { ethers } from "ethers";
import { Escrow } from "@contract-types/Escrow";

enum PackageState {
  UNDEFINED = 0,
  AWAITING = 1,
  PROCESSING = 2,
  SHIPPED = 3,
  DELIVERED = 4,
  CANCELLED = 5,
}

export default function TestPage() {
  const { seller, deployContract, getContract } = useWeb3();
  const [deployedAddress, setDeployedAddress] = useState<string>("");
  const [itemValue, setItemValue] = useState<string>("0.1");
  const [status, setStatus] = useState<string>("");
  const [escrowState, setEscrowState] = useState<{
    currentState: PackageState;
    contractBalance: bigint;
    buyerDepositAmount: bigint;
    buyerAddr: string;
    sellerDepositAmount: bigint;
    sellerAddr: string;
  } | null>(null);

  const handleDeploy = async () => {
    try {
      setStatus("Deploying contract...");
      const valueInWei = ethers.parseEther(itemValue);
      const contract = await deployContract(valueInWei);
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

  const updateEscrowStatus = async (contract: Escrow) => {
    const status = await contract.getEscrowStatus();
    setEscrowState({
      currentState: Number(status.currentState) as PackageState,
      contractBalance: status.contractBalance,
      buyerDepositAmount: status.buyerDepositAmount,
      buyerAddr: status.buyerAddr,
      sellerDepositAmount: status.sellerDepositAmount,
      sellerAddr: status.sellerAddr,
    });
  };

  const handleGetStatus = async () => {
    if (!deployedAddress) {
      setStatus("No contract deployed yet!");
      return;
    }

    try {
      setStatus("Fetching contract status...");
      const contract = await getContract(deployedAddress);
      await updateEscrowStatus(contract);
      setStatus("Status fetched successfully!");
    } catch (error) {
      console.error("Error fetching status:", error);
      setStatus("Failed to fetch status! Check console for details.");
    }
  };

  const getStateString = (state: PackageState): string => {
    const states = [
      "Undefined",
      "Awaiting",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    return states[state];
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Escrow Contract Test Page</h1>

      {seller && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Seller Account:</h2>
          <p className="font-mono break-all">{seller}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl mb-2">Deploy New Contract</h2>
        <div className="flex gap-2 mb-2">
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
        <div className="mb-6">
          <h2 className="text-xl mb-2">Deployed Contract</h2>
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

      {escrowState && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Contract Status</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="mb-2">
              <span className="font-semibold">State: </span>
              {getStateString(escrowState.currentState)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Contract Balance: </span>
              {(Number(escrowState.contractBalance) / 1e18).toFixed(4)} ETH
            </p>
            <p className="mb-2">
              <span className="font-semibold">Buyer Deposit: </span>
              {(Number(escrowState.buyerDepositAmount) / 1e18).toFixed(4)} ETH
            </p>
            <p className="mb-2">
              <span className="font-semibold">Seller Deposit: </span>
              {(Number(escrowState.sellerDepositAmount) / 1e18).toFixed(4)} ETH
            </p>
            <p className="mb-2">
              <span className="font-semibold">Buyer Address: </span>
              <span className="font-mono break-all">
                {escrowState.buyerAddr ===
                "0x0000000000000000000000000000000000000000"
                  ? "Not set"
                  : escrowState.buyerAddr}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Seller Address: </span>
              <span className="font-mono break-all">
                {escrowState.sellerAddr}
              </span>
            </p>
          </div>
        </div>
      )}

      {status && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h2 className="text-xl mb-2">Status:</h2>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
