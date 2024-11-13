"use client";

import { EscrowStatus, PackageState } from "@/constants";
import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Escrow } from "@contract-types/Escrow";

export default function TestConfirmPurchasePage() {
  const params = useParams();
  const contractAddress = params.address as string;
  const { seller, getRandomBuyer, getContract } = useWeb3();
  const [buyer, setBuyer] = useState<string>("");
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRandomBuyer = async () => {
    try {
      setLoading(true);
      setError("");
      const newBuyer = await getRandomBuyer();
      setBuyer(newBuyer);
    } catch (error) {
      setError("Failed to get random buyer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      setLoading(true);
      setError("");
      const contract = await getContract(contractAddress, buyer);
      const itemValue = await contract.itemValue();
      await contract.confirmPurchase({ value: itemValue * 2n });
      await updateEscrowStatus(contract);
    } catch (error) {
      setError("Failed to confirm purchase");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEscrowStatus = async (contract: Escrow) => {
    const status = await contract.getEscrowStatus();
    setEscrowStatus({
      currentState: Number(status.currentState) as PackageState,
      contractBalance: status.contractBalance,
      buyerDepositAmount: status.buyerDepositAmount,
      buyerAddr: status.buyerAddr,
      sellerDepositAmount: status.sellerDepositAmount,
      sellerAddr: status.sellerAddr,
    } as EscrowStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Confirm Purchase
        </h1>

        <div className="space-y-6">
          {/* Contract Info */}
          <div className="bg-gray-50 rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Contract Details
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span>{" "}
              <span className="font-mono">{contractAddress}</span>
            </p>
          </div>

          {/* Buyer Section */}
          <div className="bg-gray-50 rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Buyer</h2>
            <p className="text-sm text-gray-600 mb-4 font-mono">
              {buyer || "No buyer selected"}
            </p>
            <button
              onClick={handleRandomBuyer}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Loading..." : "Get Random Buyer"}
            </button>
          </div>

          {/* Purchase Action */}
          <div className="bg-gray-50 rounded-md p-4">
            <button
              onClick={handleConfirmPurchase}
              disabled={!buyer || loading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : "Confirm Purchase"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Escrow Status */}
          {escrowStatus && (
            <div className="bg-gray-50 rounded-md p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Escrow Status
              </h2>
              <div className="space-y-2 text-sm text-black">
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {PackageState[escrowStatus.currentState]}
                </p>
                <p>
                  <span className="font-medium">Contract Balance:</span>{" "}
                  {(Number(escrowStatus.contractBalance) / 1e18).toString()} ETH
                </p>
                <p>
                  <span className="font-medium">Buyer Deposit:</span>{" "}
                  {(Number(escrowStatus.buyerDepositAmount) / 1e18).toString()}{" "}
                  ETH
                </p>
                <p>
                  <span className="font-medium">Seller Deposit:</span>{" "}
                  {(Number(escrowStatus.sellerDepositAmount) / 1e18).toString()}{" "}
                  ETH
                </p>
                <p className="font-mono">
                  <span className="font-medium">Buyer:</span>{" "}
                  {escrowStatus.buyerAddr}
                </p>
                <p className="font-mono">
                  <span className="font-medium">Seller:</span>{" "}
                  {escrowStatus.sellerAddr}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
