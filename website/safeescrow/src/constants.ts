export enum PackageState {
  UNDEFINED = 0,
  AWAITING = 1,
  PROCESSING = 2,
  SHIPPED = 3,
  DELIVERED = 4,
  CANCELLED = 5,
}

export interface EscrowStatus {
  currentState: PackageState;
  contractBalance: bigint;
  buyerDepositAmount: bigint;
  buyerAddr: string;
  sellerDepositAmount: bigint;
  sellerAddr: string;
}
