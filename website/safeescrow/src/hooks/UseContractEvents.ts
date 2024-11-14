import { useState, useEffect } from "react";
import { Escrow } from "@contract-types/Escrow";

export type EventLog = {
  eventName: string;
  data: any;
  timestamp: number;
};

export function useContractEvents(contract: Escrow | null) {
  const [events, setEvents] = useState<EventLog[]>([]);

  useEffect(() => {
    if (!contract) return;

    const handleDeliveryCancelled = async (
      initiator: string,
      timestamp: bigint
    ) => {
      setEvents((prev) => [
        ...prev,
        {
          eventName: "DeliveryCancelled",
          data: { initiator, timestamp: timestamp.toString() },
          timestamp: Date.now(),
        },
      ]);
    };

    const handleDepositMade = async (
      from: string,
      amount: bigint,
      timestamp: bigint
    ) => {
      setEvents((prev) => [
        ...prev,
        {
          eventName: "DepositMade",
          data: {
            from,
            amount: amount.toString(),
            timestamp: timestamp.toString(),
          },
          timestamp: Date.now(),
        },
      ]);
    };

    const handleFundsDistributed = async (
      to: string,
      amount: bigint,
      timestamp: bigint
    ) => {
      setEvents((prev) => [
        ...prev,
        {
          eventName: "FundsDistributed",
          data: {
            to,
            amount: amount.toString(),
            timestamp: timestamp.toString(),
          },
          timestamp: Date.now(),
        },
      ]);
    };

    const handleItemDelivered = async (timestamp: bigint) => {
      setEvents((prev) => [
        ...prev,
        {
          eventName: "ItemDelivered",
          data: { timestamp: timestamp.toString() },
          timestamp: Date.now(),
        },
      ]);
    };

    const handleStateChanged = async (
      previousState: bigint,
      newState: bigint
    ) => {
      setEvents((prev) => [
        ...prev,
        {
          eventName: "StateChanged",
          data: {
            previousState: previousState.toString(),
            newState: newState.toString(),
          },
          timestamp: Date.now(),
        },
      ]);
    };

    contract.on(
      contract.filters["DeliveryCancelled(address,uint256)"],
      handleDeliveryCancelled
    );
    contract.on(
      contract.filters["DepositMade(address,uint256,uint256)"],
      handleDepositMade
    );
    contract.on(
      contract.filters["FundsDistributed(address,uint256,uint256)"],
      handleFundsDistributed
    );
    contract.on(
      contract.filters["ItemDelivered(uint256)"],
      handleItemDelivered
    );
    contract.on(
      contract.filters["StateChanged(uint8,uint8)"],
      handleStateChanged
    );

    return () => {
      contract.off("DeliveryCancelled", handleDeliveryCancelled);
      contract.off("DepositMade", handleDepositMade);
      contract.off("FundsDistributed", handleFundsDistributed);
      contract.off("ItemDelivered", handleItemDelivered);
      contract.off("StateChanged", handleStateChanged);
    };
  }, [contract]);

  return events;
}
