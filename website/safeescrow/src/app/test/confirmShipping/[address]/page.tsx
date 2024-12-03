"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEscrowStatus } from "@/hooks/UseEscrowStatus";
import { EscrowStatusCard } from "@/components/EscrowStatusCard";
import { useContractEvents } from "@/hooks/UseContractEvents";
import { Escrow } from "@contract-types/Escrow";
import { ContractEvents } from "@/components/ContractEvents";

export default function TestConfirmShippingPage() {
  const params = useParams();
  const router = useRouter();
  const contractAddress = params.address as string;
  const { seller, getContract } = useWeb3();
  const { escrowStatus, updateEscrowStatus } = useEscrowStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isShippingConfirmed, setIsShippingConfirmed] = useState(false);
  const [contract, setContract] = useState<Escrow | null>(null);
  const [buyer, setBuyer] = useState<string>("");
  const events = useContractEvents(contract);

  const handleConfirmShipping = async () => {
    try {
      setLoading(true);
      setError("");

      // Get initial contract state
      if (!seller) {
        throw new Error("Seller address is not available");
      }

      const retrievedContract = await getContract(contractAddress);
      setContract(retrievedContract);
      await retrievedContract.confirmShipping();
      await updateEscrowStatus(retrievedContract);
      setIsShippingConfirmed(true);
      setBuyer(await retrievedContract.buyer());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDelivery = () => {
    router.push(`/test/confirmDelivery/${contractAddress}/${buyer}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div style={{ position: "absolute", top: 0, right: 0, padding: "10px" }}>
        <h2>You are Seller.</h2>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Confirm Shipping
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

          {/* Shipping Action */}
          <div className="bg-gray-50 rounded-md p-4">
            <button
              onClick={handleConfirmShipping}
              disabled={loading || isShippingConfirmed}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading
                ? "Processing..."
                : isShippingConfirmed
                ? "Shipping Confirmed"
                : "Confirm Shipping"}
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

          <div className="bg-gray-50 rounded-md p-4">
            <button
              onClick={handleConfirmDelivery}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Test Confirm Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
