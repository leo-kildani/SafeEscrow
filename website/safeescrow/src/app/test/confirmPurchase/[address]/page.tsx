"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEscrowStatus } from "@/hooks/UseEscrowStatus";
import { EscrowStatusCard } from "@/components/EscrowStatusCard";
import { useContractEvents } from "@/hooks/UseContractEvents";
import { Escrow } from "@contract-types/Escrow";
import { ContractEvents } from "@/components/ContractEvents";

export default function TestConfirmPurchasePage() {
  const params = useParams();
  const contractAddress = params.address as string;
  const router = useRouter();
  const { getRandomBuyer, getContract } = useWeb3();
  const { escrowStatus, updateEscrowStatus } = useEscrowStatus();
  const [buyer, setBuyer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false);
  const [contract, setContract] = useState<Escrow | null>(null);
  const events = useContractEvents(contract);

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
      setContract(contract);
      const itemValue = await contract.itemValue();
      await contract.confirmPurchase({ value: itemValue * 2n });
      await updateEscrowStatus(contract);
      setIsPurchaseConfirmed(true); // Set confirmation state
    } catch (error) {
      setError("Failed to confirm purchase");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPurhcaseButton = () => {
    router.push(`/test/cancelPurchase/${contractAddress}/${buyer}`);
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
              disabled={!buyer || loading || isPurchaseConfirmed}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading
                ? "Processing..."
                : isPurchaseConfirmed
                ? "Purchase Confirmed"
                : "Confirm Purchase"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <EscrowStatusCard escrowStatus={escrowStatus} />
          <ContractEvents events={events} />
        </div>
      </div>

      {/* Cancel Purchase Button - only show when purchase is confirmed */}
      {buyer && isPurchaseConfirmed && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleCancelPurhcaseButton}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Test Cancel Purchase
          </button>
          <button
            onClick={() =>
              router.push(`/test/confirmShipping/${contractAddress}`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors ml-4"
          >
            Test Confirm Shipping
          </button>
        </div>
      )}
    </div>
  );
}
