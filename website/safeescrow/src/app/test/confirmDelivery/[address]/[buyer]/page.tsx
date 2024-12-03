"use client";

import { ContractEvents } from "@/components/ContractEvents";
import { EscrowStatusCard } from "@/components/EscrowStatusCard";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContractEvents } from "@/hooks/UseContractEvents";
import { useEscrowStatus } from "@/hooks/UseEscrowStatus";
import { Escrow } from "@contract-types/Escrow";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TestConfirmDeliveryPage() {
  const params = useParams();
  const contractAddress = params.address as string;
  const buyer = params.buyer as string;
  const { getContract } = useWeb3();
  const { escrowStatus, updateEscrowStatus } = useEscrowStatus();
  const [contract, setContract] = useState<Escrow | null>(null);
  const events = useContractEvents(contract);

  const handleConfirmDelivery = async () => {
    try {
      const retrievedContract = await getContract(contractAddress, buyer);
      setContract(retrievedContract);
      await retrievedContract.confirmDelivery();
      await updateEscrowStatus(retrievedContract);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Confirm Delivery
      </h1>
      <button
        onClick={handleConfirmDelivery}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Confirm Delivery
      </button>
      <div className="mt-8">
        <EscrowStatusCard escrowStatus={escrowStatus} />
      </div>
      <div className="mt-8">
        <ContractEvents events={events} />
      </div>
    </div>
  );
}
