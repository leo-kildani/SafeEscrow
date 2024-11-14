"use client";

import { ContractEvents } from "@/components/ContractEvents";
import { EscrowStatusCard } from "@/components/EscrowStatusCard";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContractEvents } from "@/hooks/UseContractEvents";
import { useEscrowStatus } from "@/hooks/UseEscrowStatus";
import { Escrow } from "@contract-types/Escrow";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TestCancelPurchase() {
  const params = useParams();
  const contractAddress = params.contractAddress as string;
  const buyer = params.buyer as string;
  const { getContract } = useWeb3();
  const { escrowStatus, updateEscrowStatus } = useEscrowStatus();
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Escrow | null>(null);
  const events = useContractEvents(contract);

  const handleCancelPurchase = async () => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract(contractAddress, buyer);
      setContract(contract);
      await contract.cancelPurchase();
      await updateEscrowStatus(contract);
      setCancelled(true);
    } catch (error) {
      console.error(error);
      setError("Failed to cancel purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Cancel Purchase
        </h1>

        <div className="space-y-6">
          {/* Contract Info */}
          <div className="bg-gray-50 rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Contract Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Contract Address:</p>
                <p className="font-mono">{contractAddress}</p>
              </div>
              <div>
                <p className="text-gray-500">Buyer Address:</p>
                <p className="font-mono">{buyer}</p>
              </div>
            </div>
          </div>

          <EscrowStatusCard escrowStatus={escrowStatus} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleCancelPurchase}
              disabled={loading || cancelled}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Cancelling..."
                : cancelled
                ? "Purchase Cancelled"
                : "Cancel Purchase"}
            </button>
          </div>
          <ContractEvents events={events} />
        </div>
      </div>
    </div>
  );
}
