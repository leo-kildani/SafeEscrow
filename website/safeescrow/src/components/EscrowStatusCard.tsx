// src/components/EscrowStatusCard.tsx
import { EscrowStatus, PackageState } from "@/constants";

interface EscrowStatusCardProps {
  escrowStatus: EscrowStatus | null;
  className?: string;
}

export const EscrowStatusCard = ({
  escrowStatus,
  className = "",
}: EscrowStatusCardProps) => {
  if (!escrowStatus) return null;

  return (
    <div className={`mb-6 text-black ${className}`}>
      <h2 className="text-xl mb-2 text-white">Contract Status</h2>
      <div className="bg-gray-100 p-4 rounded">
        <p className="mb-2">
          <span className="font-semibold">State: </span>
          {PackageState[escrowStatus.currentState]}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Contract Balance: </span>
          {(Number(escrowStatus.contractBalance) / 1e18).toFixed(4)} ETH
        </p>
        <p className="mb-2">
          <span className="font-semibold">Buyer Deposit: </span>
          {(Number(escrowStatus.buyerDepositAmount) / 1e18).toFixed(4)} ETH
        </p>
        <p className="mb-2">
          <span className="font-semibold">Seller Deposit: </span>
          {(Number(escrowStatus.sellerDepositAmount) / 1e18).toFixed(4)} ETH
        </p>
        <p className="mb-2">
          <span className="font-semibold">Buyer Address: </span>
          <span className="font-mono break-all">
            {escrowStatus.buyerAddr ===
            "0x0000000000000000000000000000000000000000"
              ? "Not set"
              : escrowStatus.buyerAddr}
          </span>
        </p>
        <p className="mb-2 text-black">
          <span className="font-semibold">Seller Address: </span>
          <span className="font-mono break-all">{escrowStatus.sellerAddr}</span>
        </p>
      </div>
    </div>
  );
};
