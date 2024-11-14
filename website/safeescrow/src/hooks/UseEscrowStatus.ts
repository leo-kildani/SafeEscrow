import { useState } from "react";
import { Escrow } from "@contract-types/Escrow";
import { PackageState, EscrowStatus } from "@/constants";

export const useEscrowStatus = (initialStatus?: EscrowStatus) => {
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus | null>(
    initialStatus ?? null
  );

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

  return {
    escrowStatus,
    updateEscrowStatus,
  };
};
